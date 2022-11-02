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
	_ps "notarynearby/internal/participant"
	_pk "notarynearby/internal/pk"
)

//Handler lambda entrypoint
func Handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	os, err := ps.Reader.GetOne(_pk.PublicKey(request.PathParameters["participant"]))
	if err != nil {
		return _api.ResponseError(fmt.Errorf("Failed fetching Order: %w", err)), nil
	}

	return _api.ResponseOK(os), nil
}

var err error
var sess *session.Session
var ps *_ps.Service

func main() {
	sess, err = session.NewSession(&aws.Config{
		Region: aws.String(os.Getenv("REGION")),
	})
	if err != nil {
		panic(fmt.Errorf("failed starting AWS Session: %w", err))
	}

	ps, err = _ps.New(sess)
	if err != nil {
		panic(fmt.Errorf("failed starting Orders Service: %w", err))
	}

	lambda.Start(Handler)
}
