package order

import (
	"encoding/json"
	"fmt"
	"notarynearby/internal/db"
	_pk "notarynearby/internal/pk"
	"os"

	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/gofrs/uuid"
)

//Service is the all in one entrypoint for managing Orders
type Service struct {
	sess   *session.Session
	Reader *Reader
	Writer *Writer
}

//New instantiates Service
func New(sess *session.Session) (*Service, error) {
	svc := db.New(sess, fmt.Sprintf("%v-%v", os.Getenv("PROJECT_NAME"), os.Getenv("STAGE")), "orders")

	r, err := NewReader(svc)
	if err != nil {
		return nil, fmt.Errorf("failed initiating Reader: %w", err)
	}

	w, err := NewWriter(svc)
	if err != nil {
		return nil, fmt.Errorf("failed initiating Writer: %w", err)
	}

	return &Service{
		sess:   sess,
		Reader: r,
		Writer: w,
	}, nil
}

//Create creates Order
func (_x *Service) Create(_in *CreateInput) (*CreateOutput, error) {
	id, err := uuid.NewV4()
	if err != nil {
		return nil, fmt.Errorf("failed generating UUID: %w", err)
	}

	s := &Order{
		Owner:        _in.Owner,
		ID:           id.String(),
		Participants: _in.Participants,
		Witnesses:    _in.Witnesses,
		Widgets:      []json.RawMessage{},
	}
	//TODO: Validate PublicKey and Signature
	if err := _x.Writer.Create(s); err != nil {
		return nil, fmt.Errorf("failed saving Session in DB: %w", err)
	}

	return &CreateOutput{
		Order: s,
	}, nil
}

func (_x *Service) NotaryJoined(o *Order, p *Person) error {
	o.NotaryJoined = p

	return _x.Writer.NotaryJoined(o)
}

func (_x *Service) ParticipantJoined(o *Order, pk _pk.PublicKey, p *Person) error {
	for _, x := range o.Participants {
		if pk == x {
			o.ParticipantsJoined[pk] = p

			return _x.Writer.ParticipantJoined(o)
		}
	}

	return fmt.Errorf("participant not found")
}

func (_x *Service) WitnessJoined(o *Order, pk _pk.PublicKey, p *Person) error {
	for _, x := range o.Witnesses {
		if pk == x {
			o.WitnessesJoined[pk] = p

			return _x.Writer.WitnessJoined(o)
		}
	}

	return fmt.Errorf("witness not found")
}
