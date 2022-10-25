package main

import (
	"bytes"
	"context"
	"encoding/json"
	"fmt"
	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"

	_ns "notarynearby/internal/session"
)

//Handler is our lambda handler invoked by the `lambda.Start` function call
func Handler(ctx context.Context, request events.APIGatewayWebsocketProxyRequest) (events.APIGatewayProxyResponse, error) {
	fmt.Println("connection handler ran")

	fmt.Println("ConnectionID: ", request.RequestContext.ConnectionID)
	fmt.Println("CallbackURL: ", fmt.Sprintf("https://%s/%s", request.RequestContext.DomainName, request.RequestContext.Stage))

	o, err := ns.Connect(&_ns.ConnectInput{
		ConnectionID: request.RequestContext.ConnectionID,
		CallbackURL:  fmt.Sprintf("https://%s/%s", request.RequestContext.DomainName, request.RequestContext.Stage),
	})
	if err != nil {
		fmt.Println("ERROR: failed storing WS Connection details: ", err)
		var buf bytes.Buffer

		body, err := json.Marshal(map[string]interface{}{
			"message": fmt.Sprintf("ERROR: %v", err),
		})
		if err != nil {
			return events.APIGatewayProxyResponse{StatusCode: 500}, err
		}

		json.HTMLEscape(&buf, body)
		return events.APIGatewayProxyResponse{
			StatusCode:      500,
			IsBase64Encoded: false,
			Body:            buf.String(),
		}, nil
	}

	fmt.Println("O: ", o)

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
	}, nil
}

var err error
var sess *session.Session
var ns *_ns.Service

func main() {
	sess, err = session.NewSession(&aws.Config{
		Region: aws.String(os.Getenv("REGION")),
	})
	if err != nil {
		panic(fmt.Errorf("failed starting AWS Session: %w", err))
	}

	ns, err = _ns.New(sess)
	if err != nil {
		panic(fmt.Errorf("failed starting NNB Session Service: %w", err))
	}

	lambda.Start(Handler)
}
