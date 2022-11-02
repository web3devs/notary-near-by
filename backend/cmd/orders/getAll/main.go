package main

import (
	"context"
	"fmt"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"

	_api "notarynearby/internal/api"
	_os "notarynearby/internal/order"
)

//Handler lambda entrypoint
func Handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	os, err := ps.Reader.GetAll()
	if err != nil {
		return _api.ResponseNotFound(fmt.Errorf("Failed fetching Orders: %w", err)), nil
	}

	return _api.ResponseOK(os), nil
}

var err error
var sess *session.Session
var ps *_os.Service

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

	lambda.Start(Handler)
}
