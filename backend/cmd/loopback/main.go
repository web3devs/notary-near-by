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
	"github.com/aws/aws-sdk-go/service/apigatewaymanagementapi"

	_ns "notarynearby/internal/session"
)

// Response is of type APIGatewayProxyResponse since we're leveraging the
// AWS Lambda Proxy Request functionality (default behavior)
//
// https://serverless.com/framework/docs/providers/aws/events/apigateway/#lambda-proxy-integration
type Response events.APIGatewayProxyResponse

// Handler is our lambda handler invoked by the `lambda.Start` function call
func Handler(context context.Context, records events.SNSEvent) error {
	fmt.Println("loopback handler ran")
	for _, r := range records.Records {
		var m _ns.Session
		err := json.Unmarshal([]byte(r.SNS.Message), &m)
		if err != nil {
			fmt.Println("sns unmarshal error")
			fmt.Println(err)
		}
		url := fmt.Sprintf(m.CallbackURL)
		apigw := apigatewaymanagementapi.New(sess, &aws.Config{
			Endpoint: aws.String(url),
		})
		_, err = apigw.PostToConnection(&apigatewaymanagementapi.PostToConnectionInput{
			ConnectionId: aws.String(m.ConnectionID),
			Data:         []byte(`hello`),
		})
		if err != nil {
			fmt.Println("error")
			fmt.Println(err)
		}
	}
	return nil
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

	lambda.Start(Handler)
}
