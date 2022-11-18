package main

import (
	"context"
	"encoding/json"
	"fmt"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"

	_api "notarynearby/internal/api"
	_os "notarynearby/internal/order"
	_ss "notarynearby/internal/session"
	_socket "notarynearby/internal/socket"
)

//Request DTO
type Request *_os.ConfirmMintingInput

//Handler lambda entrypoint
func Handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var req Request
	if err := json.Unmarshal([]byte(request.Body), &req); err != nil {
		return _api.ResponseError(fmt.Errorf("Could not unmarshal: %w", err)), nil
	}

	o, err := ps.GetOne(&_os.GetOneInput{OrderID: request.PathParameters["order_id"]})
	if err != nil {
		return _api.ResponseNotFound(fmt.Errorf("Failed fetching Order: %w", err)), nil
	}

	req.Order = o.Order
	os, err := ps.ConfirmMinting(req)
	if err != nil {
		return _api.ResponseNotFound(fmt.Errorf("Failed confirming minting tokens for Order: %w", err)), nil
	}

	//Find out who's involved with the order
	cs, err := ss.Reader.GetAllByOrder(os.Order.ID)
	if err != nil {
		return _api.ResponseNotFound(fmt.Errorf("Failed fetching Connections: %w", err)), nil
	}

	//Send notifications about order being signed
	if err := sckt.NotifyUpdateOrder(cs, o.Order); err != nil {
		return _api.ResponseNotFound(fmt.Errorf("Failed updating Connections with Order change: %w", err)), nil
	}

	return _api.ResponseOK(os), nil
}

var err error
var sess *session.Session
var ps *_os.Service
var ss *_ss.Service
var sckt *_socket.Service

func main() {
	sess, err = session.NewSession(&aws.Config{
		Region: aws.String(os.Getenv("REGION")),
	})
	if err != nil {
		panic(fmt.Errorf("failed starting AWS Session: %w", err))
	}

	ps, err = _os.New(sess)
	if err != nil {
		panic(fmt.Errorf("failed starting Orders Service: %w", err))
	}

	ss, err = _ss.New(sess)
	if err != nil {
		panic(fmt.Errorf("failed starting NNB Session Service: %w", err))
	}

	sckt, err = _socket.New(sess)
	if err != nil {
		panic(fmt.Errorf("failed starting Sockets Service: %w", err))
	}

	lambda.Start(Handler)
}
