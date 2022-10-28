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

// Handler is our lambda handler invoked by the `lambda.Start` function call
func Handler(context context.Context, records events.SNSEvent) error {
	fmt.Println("loopback handler ran")
	fmt.Println("XXX: ", os.Getenv("SNS_SESSIONS_ARN"))
	for _, r := range records.Records {
		fmt.Println("r.SNS.Message: ", r.SNS.Message)
		var m _ns.DispatchActionInput
		err := json.Unmarshal([]byte(r.SNS.Message), &m)
		if err != nil {
			fmt.Println("sns unmarshal error: ", err)
			continue
		}

		switch m.Action.Action {
		case _ns.ActionMessage:
			var tmp struct {
				OrderID string `json:"order_id"`
			}
			err := json.Unmarshal(*m.Action.Data, &tmp)
			if err != nil {
				fmt.Println("ERROR: failed unmarshaling Action.Data: ", err)
				continue
			}

			fmt.Println("tmp: ", tmp)
			fmt.Println("ns.Reader: ", ns.Reader)

			//Get all ConnectionIDs but the sender's
			cs, err := ns.Reader.GetAllByOrder(tmp.OrderID)
			if err != nil {
				fmt.Println("ERROR: failed fetching Connections: ", err)
				continue
			}

			a, err := json.Marshal(m.Action)
			if err != nil {
				fmt.Println("ERROR: failed marshaling Action into JSON: ", err)
				continue
			}

			for _, c := range cs {
				if c.ConnectionID == m.ConnectionID { //TODO: Exclude it in GetAllBySession?
					continue
				}
				apigw := apigatewaymanagementapi.New(sess, &aws.Config{
					Endpoint: aws.String(c.CallbackURL),
				})
				_, err := apigw.PostToConnection(&apigatewaymanagementapi.PostToConnectionInput{
					ConnectionId: aws.String(c.ConnectionID),
					Data:         a,
				})
				if err != nil {
					fmt.Println("ERROR: failed posting to Connections: ", err)
					continue
				}
			}
			break
		case _ns.ActionUpdateWidget:
			var tmp struct {
				OrderID   string          `json:"order_id"`
				PublicKey string          `json:"public_key"`
				Signature string          `json:"signature"`
				Widget    json.RawMessage `json:"data"`
			}
			err := json.Unmarshal(*m.Action.Data, &tmp)
			if err != nil {
				fmt.Println("ERROR: failed unmarshaling action: ", err)
				continue
			}

			type wid struct {
				ID string `json:"id"`
			}

			//Get all ConnectionIDs
			cs, err := ns.Reader.GetAllByOrder(tmp.OrderID)
			if err != nil {
				fmt.Println("ERROR: failed fetching Connections: ", err)
				continue
			}

			widget := wid{}
			err = json.Unmarshal(tmp.Widget, &widget)
			if err != nil {
				fmt.Println("ERROR: failed unmarshaling incoming widget: ", err)
				continue
			}

			_widgets := cs[0].Widgets

			for k, w := range _widgets {
				wg := wid{}
				err := json.Unmarshal(w, &wg)
				if err != nil {
					fmt.Println("ERROR: failed unmarshaling widget: ", err)
					continue
				}
				if wg.ID == widget.ID {
					_widgets[k] = tmp.Widget
					break
				}
			}

			for _, c := range cs {
				c.Widgets = _widgets
				if err := ns.Writer.UpdateWidgets(&c); err != nil {
					fmt.Println("ERROR: failed updating widgets: ", err)
					continue
				}

				a, err := json.Marshal(struct {
					Action string            `json:"action"`
					Data   []json.RawMessage `json:"data"`
				}{
					Action: "update-widgets",
					Data:   c.Widgets,
				})

				apigw := apigatewaymanagementapi.New(sess, &aws.Config{
					Endpoint: aws.String(c.CallbackURL),
				})
				_, err = apigw.PostToConnection(&apigatewaymanagementapi.PostToConnectionInput{
					ConnectionId: aws.String(c.ConnectionID),
					Data:         a,
				})
				if err != nil {
					fmt.Println("ERROR: failed posting to Connections: ", err)
					continue
				}
			}
			break
		case _ns.ActionAddWidget:
			var tmp struct {
				OrderID   string          `json:"order_id"`
				PublicKey string          `json:"public_key"`
				Signature string          `json:"signature"`
				Widget    json.RawMessage `json:"data"`
			}
			err := json.Unmarshal(*m.Action.Data, &tmp)
			if err != nil {
				fmt.Println("ERROR: failed unmarshaling action: ", err)
				continue
			}

			type wid struct {
				ID string `json:"id"`
			}

			//Get all ConnectionIDs
			cs, err := ns.Reader.GetAllByOrder(tmp.OrderID)
			if err != nil {
				fmt.Println("ERROR: failed fetching Connections: ", err)
				continue
			}

			widget := wid{}
			err = json.Unmarshal(tmp.Widget, &widget)
			if err != nil {
				fmt.Println("ERROR: failed unmarshaling incoming widget: ", err)
				continue
			}

			_widgets := cs[0].Widgets
			_widgets = append(_widgets, tmp.Widget)

			for _, c := range cs {
				c.Widgets = _widgets
				if err := ns.Writer.UpdateWidgets(&c); err != nil {
					fmt.Println("ERROR: failed updating widgets: ", err)
					continue
				}

				a, err := json.Marshal(struct {
					Action string            `json:"action"`
					Data   []json.RawMessage `json:"data"`
				}{
					Action: "update-widgets",
					Data:   c.Widgets,
				})

				apigw := apigatewaymanagementapi.New(sess, &aws.Config{
					Endpoint: aws.String(c.CallbackURL),
				})
				_, err = apigw.PostToConnection(&apigatewaymanagementapi.PostToConnectionInput{
					ConnectionId: aws.String(c.ConnectionID),
					Data:         a,
				})
				if err != nil {
					fmt.Println("ERROR: failed posting to Connections: ", err)
					continue
				}

			}
			break
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

	ns, err = _ns.New(sess)
	if err != nil {
		panic(fmt.Errorf("failed starting NNB Session Service: %w", err))
	}

	lambda.Start(Handler)
}
