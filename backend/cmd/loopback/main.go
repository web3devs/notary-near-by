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

	_ns "notarynearby/internal/notary"
	_os "notarynearby/internal/order"
	_ps "notarynearby/internal/participant"
	_pk "notarynearby/internal/pk"
	_ss "notarynearby/internal/session"
)

func postToConnections(sessions []_ss.Session, excludedConnectionID string, msg []byte) {
	for _, c := range sessions {
		if excludedConnectionID != "" && c.ConnectionID == excludedConnectionID {
			continue
		}
		apigw := apigatewaymanagementapi.New(sess, &aws.Config{
			Endpoint: aws.String(c.CallbackURL),
		})
		_, err := apigw.PostToConnection(&apigatewaymanagementapi.PostToConnectionInput{
			ConnectionId: aws.String(c.ConnectionID),
			Data:         msg,
		})
		if err != nil {
			fmt.Println("ERROR: failed posting to Connections: ", err)
			continue
		}
	}

}

// Handler is our lambda handler invoked by the `lambda.Start` function call
func Handler(context context.Context, records events.SNSEvent) error {
	for _, r := range records.Records {
		fmt.Println("r.SNS.Message: ", r.SNS.Message)
		var m _ss.DispatchActionInput
		err := json.Unmarshal([]byte(r.SNS.Message), &m)
		if err != nil {
			fmt.Println("sns unmarshal error: ", err)
			continue
		}

		//Get order
		o, err := oss.Reader.GetOne(m.Action.OrderID)
		if err != nil {
			fmt.Println("ERROR: failed fetching Order: ", err)
			continue
		}

		//Get current connection
		s, err := ss.Reader.GetOne(m.ConnectionID)
		if err != nil {
			fmt.Println("ERROR: no Session found: ", err)
			continue
		}

		//Get all ConnectionIDs for Order
		cs, err := ss.Reader.GetAllByOrder(m.Action.OrderID)
		if err != nil {
			fmt.Println("ERROR: failed fetching Connections: ", err)
			continue
		}

		switch m.Action.Action {
		case _ss.ActionJoin:
			var tmp struct {
				PublicKey _pk.PublicKey `json:"public_key"`
				Signature string        `json:"signature"`
			}
			if err := json.Unmarshal(*m.Action.Data, &tmp); err != nil {
				fmt.Println("ERROR: failed unmarshaling action: ", err)
				continue
			}

			//Find registered user (Participant or Notary, notary takes precedence) and fill in Order details
			n, err := ns.Reader.GetOne(tmp.PublicKey)
			if err != nil {
				fmt.Println("WARNING: notary not found: ", err)
				continue
			}

			if n.PublicKey != "" {
				if err := oss.NotaryJoined(o, &_os.Person{
					FirstName: n.FirstName,
					LastName:  n.LastName,
				}); err != nil {
					fmt.Println("ERROR: faild connecting notary: ", err)
					continue
				}
			}

			p, err := ps.Reader.GetOne(tmp.PublicKey)
			if err != nil {
				fmt.Println("WARNING: participant not found: %", err)
				continue
			}
			if n.PublicKey == "" && p.PublicKey != "" {
				pe := &_os.Person{
					FirstName: p.FirstName,
					LastName:  p.LastName,
				}
				if err := oss.ParticipantJoined(o, tmp.PublicKey, pe); err != nil {
					fmt.Println("WARNING: faild connecting participant: ", err)
					fmt.Println("trying to connect as Witness")
					if err := oss.WitnessJoined(o, tmp.PublicKey, pe); err != nil {
						fmt.Println("ERROR: faild connecting participant OR witness: ", err)
					}
					continue
				}
			}

			//TODO:
			//verify signature/pubKey (see if pubKey matches signature AND pubKey exists in the Order!)
			//if ok - update Session with provided OrderID
			s.OrderID = m.Action.OrderID
			if err := ss.Writer.JoinSession(&s); err != nil {
				fmt.Println("ERROR: failed joining session: %", err)
				continue
			}

			a, err := json.Marshal(struct {
				Action string     `json:"action"`
				Data   *_os.Order `json:"data"`
			}{
				Action: "update-order",
				Data:   o,
			})
			if err != nil {
				fmt.Println("ERROR: failed marshaling action: ", err)
				continue
			}

			postToConnections(cs, "", a)

			break

		case _ss.ActionMessage:
			a, err := json.Marshal(m.Action)
			if err != nil {
				fmt.Println("ERROR: failed marshaling Action into JSON: ", err)
				continue
			}

			postToConnections(cs, m.ConnectionID, a)
			break
		case _ss.ActionUpdateWidget:
			var tmp struct {
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

			widget := wid{}
			err = json.Unmarshal(tmp.Widget, &widget)
			if err != nil {
				fmt.Println("ERROR: failed unmarshaling incoming widget: ", err)
				continue
			}

			for k, w := range o.Widgets {
				wg := wid{}
				err := json.Unmarshal(w, &wg)
				if err != nil {
					fmt.Println("ERROR: failed unmarshaling widget: ", err)
					continue
				}
				if wg.ID == widget.ID {
					o.Widgets[k] = tmp.Widget
					if err := oss.Writer.UpdateWidgets(o); err != nil {
						fmt.Println("ERROR: failed updating widgets: ", err)
						continue
					}
					break
				}
			}

			a, err := json.Marshal(struct {
				Action string     `json:"action"`
				Data   *_os.Order `json:"data"`
			}{
				Action: "update-order",
				Data:   o,
			})

			postToConnections(cs, "", a)
			break
		case _ss.ActionAddWidget:
			var tmp struct {
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

			widget := wid{}
			err = json.Unmarshal(tmp.Widget, &widget)
			if err != nil {
				fmt.Println("ERROR: failed unmarshaling incoming widget: ", err)
				continue
			}

			fmt.Println("widgets.pre: ", o.Widgets)
			o.Widgets = append(o.Widgets, tmp.Widget)
			fmt.Println("widgets.post: ", o.Widgets)
			if err := oss.Writer.UpdateWidgets(o); err != nil {
				fmt.Println("ERROR: failed updating widgets: ", err)
				continue
			}
			fmt.Println("widgets.post2: ", o.Widgets)

			a, err := json.Marshal(struct {
				Action string     `json:"action"`
				Data   *_os.Order `json:"data"`
			}{
				Action: "update-order",
				Data:   o,
			})
			postToConnections(cs, "", a)
			break
		}
	}
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
