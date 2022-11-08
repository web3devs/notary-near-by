package main

import (
	"context"
	"fmt"

	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"

	_ns "notarynearby/internal/notary"
	_os "notarynearby/internal/order"
	_ps "notarynearby/internal/participant"
	_ss "notarynearby/internal/session"
)

//TODO: look at this: https://stackoverflow.com/questions/66838823/aws-dynamo-stream-processing-using-go-lambda

// Handler is our lambda handler invoked by the `lambda.Start` function call
func Handler(context context.Context, event events.DynamoDBEvent) error {
	fmt.Println("EVENT: ", event)

	return nil
}

var err error
var sess *session.Session
var ss *_ss.Service
var oss *_os.Service
var ps *_ps.Service
var ns *_ns.Service

func main() {
	sess, err = session.NewSession(&aws.Config{
		Region: aws.String(os.Getenv("REGION")),
	})
	if err != nil {
		panic(fmt.Errorf("failed starting AWS Session: %w", err))
	}

	ss, err = _ss.New(sess)
	if err != nil {
		panic(fmt.Errorf("failed starting NNB Session Service: %w", err))
	}

	ps, err = _ps.New(sess)
	if err != nil {
		panic(fmt.Errorf("failed starting Participant Service: %w", err))
	}

	ns, err = _ns.New(sess)
	if err != nil {
		panic(fmt.Errorf("failed starting Notary Service: %w", err))
	}

	oss, err = _os.New(sess)
	if err != nil {
		panic(fmt.Errorf("failed starting Orders Service: %w", err))
	}

	lambda.Start(Handler)
}
