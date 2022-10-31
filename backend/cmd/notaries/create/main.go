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
	_ns "notarynearby/internal/notary"
)

//Request DTO
type Request *_ns.CreateInput

//Handler lambda entrypoint
func Handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var req Request
	if err := json.Unmarshal([]byte(request.Body), &req); err != nil {
		return _api.ResponseError(fmt.Errorf("Could not unmarshal: %w", err)), nil
	}

	o, err := ps.Create(req)
	if err != nil {
		return _api.ResponseError(fmt.Errorf("Failed creating Notary: %w", err)), nil
	}

	return _api.ResponseOK(o), nil
}

var err error
var sess *session.Session
var ps *_ns.Service

func main() {
	sess, err = session.NewSession(&aws.Config{
		Region: aws.String(os.Getenv("REGION")),
	})
	if err != nil {
		panic(fmt.Errorf("failed starting AWS Session: %w", err))
	}

	ps, err = _ns.New(sess)
	if err != nil {
		panic(fmt.Errorf("failed starting Notaries Service: %w", err))
	}

	lambda.Start(Handler)
}
