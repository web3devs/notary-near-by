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

	_os "notarynearby/internal/order"
	_ns "notarynearby/internal/session"
)

//Handler is our lambda handler invoked by the `lambda.Start` function call
func Handler(ctx context.Context, request events.APIGatewayWebsocketProxyRequest) (events.APIGatewayProxyResponse, error) {
	connectionID := request.RequestContext.ConnectionID
	callbackURL := fmt.Sprintf("https://%s/%s", request.RequestContext.DomainName, request.RequestContext.Stage)

	if request.Body == "" { //new connection
		if _, err := ns.Connect(&_ns.ConnectInput{
			ConnectionID: connectionID,
			CallbackURL:  callbackURL,
		}); err != nil {
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

		return events.APIGatewayProxyResponse{
			StatusCode: 200,
		}, nil
	}

	var a _ns.Action
	if err := json.Unmarshal([]byte(request.Body), &a); err != nil {
		fmt.Println("ERROR: failed unmarshaling Action: ", err)
	}

	//Get associated order
	o, err := oss.Reader.GetOne(a.OrderID)
	if err != nil {
		fmt.Println("ERROR: failed unmarshaling Action: ", err)
	}

	d := _ns.DispatchActionInput{
		ConnectionID: connectionID,
		CallbackURL:  callbackURL,
		Action:       a,
	}
	if o.ID != "" {
		d.Order = o
	}
	if _, err = ns.DispatchAction(&d); err != nil {
		fmt.Println("ERROR: failed processing Action: ", err)
	}

	return events.APIGatewayProxyResponse{
		StatusCode: 200,
	}, nil
}

var err error
var sess *session.Session
var ns *_ns.Service
var oss *_os.Service

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

	oss, err = _os.New(sess)
	if err != nil {
		panic(fmt.Errorf("failed starting Orders Service: %w", err))
	}

	lambda.Start(Handler)
}
