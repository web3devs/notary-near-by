package main

import (
	"context"
	"encoding/json"
	"fmt"
	"strings"

	"os"

	"github.com/aws/aws-lambda-go/events"
	"github.com/aws/aws-lambda-go/lambda"
	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"

	_ns "notarynearby/internal/notary"
	_os "notarynearby/internal/order"
	_ps "notarynearby/internal/participant"
	_pk "notarynearby/internal/pk"
	_ss "notarynearby/internal/session"
	_socket "notarynearby/internal/socket"
)

func handleActionJoin(m *_ss.DispatchActionInput, o *_os.Order, s *_ss.Session, cs []_ss.Session) error {
	var tmp struct {
		PublicKey _pk.PublicKey `json:"public_key"`
		Signature string        `json:"signature"`
		Role      string        `json:"role"`
	}
	if err := json.Unmarshal(*m.Action.Data, &tmp); err != nil {
		return fmt.Errorf("failed unmarshaling action: %w", err)
	}

	switch tmp.Role {
	case "notary":
		if o.Status != _os.StatusNew {
			break
		}
		//Find registered user (Participant or Notary, notary takes precedence) and fill in Order details
		n, err := ns.Reader.GetOne(tmp.PublicKey)
		if err != nil {
			return fmt.Errorf("notary not found: %w", err)
		}

		if n.PublicKey != "" {
			o.Notary = n.PublicKey
			if err := oss.NotaryJoined(o, &_os.Person{
				FullName: n.FullName,
			}); err != nil {
				return fmt.Errorf("faild connecting notary: %w", err)
			}
		}
		break
	case "participant":
		p, err := ps.Reader.GetOne(tmp.PublicKey)
		if err != nil {
			return fmt.Errorf("participant not found: %w", err)
		}
		if p.PublicKey != "" {
			if err := oss.ParticipantJoined(o, tmp.PublicKey, &_os.Person{
				FullName: p.FullName,
			}); err != nil {
				return fmt.Errorf("faild connecting participant: %w", err)
			}
		}
		break
	case "witness":
		p, err := ps.Reader.GetOne(tmp.PublicKey)
		if err != nil {
			return fmt.Errorf("participant not found: %w", err)
		}
		if p.PublicKey != "" {
			if err := oss.WitnessJoined(o, tmp.PublicKey, &_os.Person{
				FullName: p.FullName,
			}); err != nil {
				return fmt.Errorf("faild connecting participant: %w", err)
			}
		}
		break
	}

	//TODO:
	//verify signature/pubKey (see if pubKey matches signature AND pubKey exists in the Order!)
	//if ok - update Session with provided OrderID
	s.OrderID = m.Action.OrderID
	if err := ss.Writer.JoinSession(s); err != nil {
		return fmt.Errorf("failed joining session: %w", err)
	}

	cs = append(cs, *s)

	return sckt.NotifyUpdateOrder(cs, o)
}

func handleActionUpdateWidget(m *_ss.DispatchActionInput, o *_os.Order, s *_ss.Session, cs []_ss.Session) error {
	var tmp struct {
		PublicKey string          `json:"public_key"`
		Signature string          `json:"signature"`
		Widget    json.RawMessage `json:"data"`
	}
	err := json.Unmarshal(*m.Action.Data, &tmp)
	if err != nil {
		return fmt.Errorf("failed unmarshaling action: %w", err)
	}

	type wid struct {
		ID string `json:"id"`
	}

	widget := wid{}
	err = json.Unmarshal(tmp.Widget, &widget)
	if err != nil {
		return fmt.Errorf("failed unmarshaling incoming widget: %w", err)
	}

	for k, w := range o.Widgets {
		wg := wid{}
		err := json.Unmarshal(w, &wg)
		if err != nil {
			return fmt.Errorf("failed unmarshaling widget: %w", err)
		}
		if wg.ID == widget.ID {
			o.Widgets[k] = tmp.Widget
			if err := oss.Writer.UpdateWidgets(o); err != nil {
				return fmt.Errorf("failed updating widgets: %w", err)
			}
			break
		}
	}

	return sckt.NotifyUpdateOrder(cs, o)
}

func handleActionAddWidget(m *_ss.DispatchActionInput, o *_os.Order, s *_ss.Session, cs []_ss.Session) error {
	var tmp struct {
		PublicKey string          `json:"public_key"`
		Signature string          `json:"signature"`
		Widget    json.RawMessage `json:"data"`
	}
	err := json.Unmarshal(*m.Action.Data, &tmp)
	if err != nil {
		return fmt.Errorf("failed unmarshaling action: %w", err)
	}

	type wid struct {
		ID string `json:"id"`
	}

	widget := wid{}
	err = json.Unmarshal(tmp.Widget, &widget)
	if err != nil {
		return fmt.Errorf("failed unmarshaling incoming widget: %w", err)
	}

	o.Widgets = append(o.Widgets, tmp.Widget)
	if err := oss.Writer.UpdateWidgets(o); err != nil {
		return fmt.Errorf("failed updating widgets: %w", err)
	}

	return sckt.NotifyUpdateOrder(cs, o)
}

func handleActionRemoveWidget(m *_ss.DispatchActionInput, o *_os.Order, s *_ss.Session, cs []_ss.Session) error {
	var tmp struct {
		PublicKey string          `json:"public_key"`
		Signature string          `json:"signature"`
		Widget    json.RawMessage `json:"data"`
	}
	err := json.Unmarshal(*m.Action.Data, &tmp)
	if err != nil {
		return fmt.Errorf("failed unmarshaling action: %w", err)
	}

	type wid struct {
		ID string `json:"id"`
	}

	widget := wid{}
	err = json.Unmarshal(tmp.Widget, &widget)
	if err != nil {
		return fmt.Errorf("failed unmarshaling incoming widget: %w", err)
	}

	ws := []json.RawMessage{}
	for _, w := range o.Widgets {
		wg := wid{}
		err := json.Unmarshal(w, &wg)
		if err != nil {
			return fmt.Errorf("failed unmarshaling widget: %w", err)
		}
		fmt.Println("Widget: ", wg.ID)
		if wg.ID != widget.ID {
			ws = append(ws, w)
		}
	}

	o.Widgets = ws
	if err := oss.Writer.UpdateWidgets(o); err != nil {
		return fmt.Errorf("failed updating widgets: %w", err)
	}

	return sckt.NotifyUpdateOrder(cs, o)
}

func handleActionCeremonyStatusChanged(m *_ss.DispatchActionInput, o *_os.Order, s *_ss.Session, cs []_ss.Session) error {
	//TODO: Verify public key and signature
	status := strings.ReplaceAll(string(m.Action.Action), "ceremony-", "") //a little hack
	_, err := oss.CeremonyStatusChanged(&_os.CeremonyStatusChangedInput{
		Order:  o,
		Status: status,
	})
	if err != nil {
		return fmt.Errorf("failed updating order status: %w", err)
	}

	return sckt.NotifyUpdateOrder(cs, o)
}

func handleActionCeremonyFinish(m *_ss.DispatchActionInput, o *_os.Order, s *_ss.Session, cs []_ss.Session) error {
	if err := oss.MakeFinished(o); err != nil {
		return fmt.Errorf("failed updating order status: %w", err)
	}

	sckt.NotifyUpdateOrder(cs, o)

	_, err = oss.GeneratePDF(&_os.GeneratePDFInput{
		Order: o,
	})
	if err != nil {
		return fmt.Errorf("failed generating PDF: %w", err)
	}

	return nil
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
			if err := handleActionJoin(&m, o, &s, cs); err != nil {
				fmt.Println("ERROR: ", err)
				continue
			}
		case _ss.ActionMessage:
			a, err := json.Marshal(m.Action)
			if err != nil {
				fmt.Println("ERROR: failed marshaling Action into JSON: ", err)
				continue
			}

			sckt.PostToConnections(cs, m.ConnectionID, a)
			break
		case _ss.ActionUpdateWidget:
			if err := handleActionUpdateWidget(&m, o, &s, cs); err != nil {
				fmt.Println("ERROR: ", err)
				continue
			}
		case _ss.ActionAddWidget:
			if err := handleActionAddWidget(&m, o, &s, cs); err != nil {
				fmt.Println("ERROR: ", err)
				continue
			}
		case _ss.ActionRemoveWidget:
			if err := handleActionRemoveWidget(&m, o, &s, cs); err != nil {
				fmt.Println("ERROR: ", err)
				continue
			}
		case _ss.ActionCeremonyStart:
			fallthrough
		case _ss.ActionCeremonyCancel:
			if err := handleActionCeremonyStatusChanged(&m, o, &s, cs); err != nil {
				fmt.Println("ERROR: ", err)
				continue
			}
		case _ss.ActionCeremonyFinish:
			if err := handleActionCeremonyFinish(&m, o, &s, cs); err != nil {
				fmt.Println("ERROR: ", err)
				continue
			}
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
var sckt *_socket.Service

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

	sckt, err = _socket.New(sess)
	if err != nil {
		panic(fmt.Errorf("failed starting Sockets Service: %w", err))
	}

	lambda.Start(Handler)
}
