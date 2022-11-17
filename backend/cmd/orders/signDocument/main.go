package main

import (
	"context"
	"fmt"
	"strings"

	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"

	_ns "notarynearby/internal/notary"
	_os "notarynearby/internal/order"
	_ss "notarynearby/internal/session"
	_socket "notarynearby/internal/socket"
)

// Handler is our lambda handler invoked by the `lambda.Start` function call
func Handler(ctx context.Context, request events.S3Event) error {
	for _, r := range request.Records {
		fmt.Println("Key: ", r.S3.Object.Key)
		orderID := strings.ReplaceAll(r.S3.Object.Key, "/out.pdf", "")

		//Find Order
		o, err := oss.GetOne(&_os.GetOneInput{OrderID: orderID})
		if err != nil {
			fmt.Println("ERROR: could not find Order: %w", err)
			continue
		}

		//Get Notary's PFX (digital certificate)
		pfxO, err := ns.GetPFX(&_ns.GetPFXInput{PublicKey: o.Order.Notary})
		if err != nil {
			fmt.Println("ERROR: could not find PFX for Notary: %w", err)
			continue
		}

		//Sign the PDF
		if _, err := oss.SignPDF(&_os.SignPDFInput{
			Order: o.Order,
			PFX:   pfxO.PFX,
		}); err != nil {
			fmt.Println("ERROR: could not sign PDF: %w", err)
			continue
		}

		//Find out who's involved with the order
		cs, err := ss.Reader.GetAllByOrder(orderID)
		if err != nil {
			fmt.Println("ERROR: failed fetching Connections: ", err)
			continue
		}

		//Send notifications about order being signed
		if err := sckt.NotifyUpdateOrder(cs, o.Order); err != nil {
			fmt.Println("ERROR: failed updating Connections with Order change: ", err)
			continue
		}
	}

	return nil
}

var err error
var sess *session.Session
var ss *_ss.Service
var oss *_os.Service
var ns *_ns.Service
var sckt *_socket.Service

func main() {
	sess, err = session.NewSession(&aws.Config{
		Region: aws.String(os.Getenv("REGION")),
	})
	if err != nil {
		panic(fmt.Errorf("failed starting AWS Session: %w", err))
	}

	ns, err = _ns.New(sess)
	if err != nil {
		panic(fmt.Errorf("failed starting Notary Service: %w", err))
	}

	ss, err = _ss.New(sess)
	if err != nil {
		panic(fmt.Errorf("failed starting NNB Session Service: %w", err))
	}

	oss, err = _os.New(sess)
	if err != nil {
		panic(fmt.Errorf("failed starting Orders Service: %w", err))
	}

	sckt, err = _socket.New(sess)
	if err != nil {
		panic(fmt.Errorf("failed starting Sockets Service: %w", err))
	}

	lambda.Start(Handler)
}
