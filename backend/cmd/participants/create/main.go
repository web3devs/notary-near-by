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
	_ps "notarynearby/internal/participant"
)

//Request DTO
type Request *_ps.CreateInput

//Handler lambda entrypoint
func Handler(ctx context.Context, request events.APIGatewayProxyRequest) (events.APIGatewayProxyResponse, error) {
	var req Request
	if err := json.Unmarshal([]byte(request.Body), &req); err != nil {
		return _api.ResponseError(fmt.Errorf("Could not unmarshal: %w", err)), nil
	}

	o, err := ps.Create(req)
	if err != nil {
		return _api.ResponseError(fmt.Errorf("Failed creating Participant: %w", err)), nil
	}

	return _api.ResponseOK(o), nil
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
		panic(fmt.Errorf("failed starting Participants Service: %w", err))
	}

	lambda.Start(Handler)
}
