package order

import (
	"encoding/json"
	"fmt"
	_bucket "notarynearby/internal/bucket"
	"notarynearby/internal/db"
	_pk "notarynearby/internal/pk"
	"os"
	"time"

	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/gofrs/uuid"
)

//Service is the all in one entrypoint for managing Orders
type Service struct {
	sess   *session.Session
	Reader *Reader
	Writer *Writer
	bucket *_bucket.Service
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

	bucket, err := _bucket.New(os.Getenv("S3_ORDERS"), sess)
	if err != nil {
		return nil, fmt.Errorf("failed initiating Bucket: %w", err)
	}

	return &Service{
		sess:   sess,
		Reader: r,
		Writer: w,
		bucket: bucket,
	}, nil
}

//Create creates Order
func (_x *Service) Create(_in *CreateInput) (*CreateOutput, error) {
	id, err := uuid.NewV4()
	if err != nil {
		return nil, fmt.Errorf("failed generating UUID: %w", err)
	}

	//add Owner as Participant if not found in Particpants list
	addOwner := true
	for _, p := range _in.Participants {
		if p == _in.Owner {
			addOwner = false
		}
	}
	if addOwner {
		_in.Participants = append(_in.Participants, _in.Owner)
	}

	s := &Order{
		Owner:        _in.Owner,
		ID:           id.String(),
		Participants: _in.Participants,
		Witnesses:    _in.Witnesses,
		Widgets:      []json.RawMessage{},
		DocumentType: _in.DocumentType,
		CreatedAt:    time.Now().Format(time.RFC3339),
	}
	//TODO: Validate PublicKey and Signature
	if err := _x.Writer.Create(s); err != nil {
		return nil, fmt.Errorf("failed saving Session in DB: %w", err)
	}

	uploadURL, err := _x.bucket.GetUploadURL(s.GetInFilePath())
	if err != nil {
		return nil, fmt.Errorf("failed creating upload URL: %w", err)
	}

	return &CreateOutput{
		Order:     s,
		UploadURL: uploadURL,
	}, nil
}

//NotaryJoined sets connected Notary
func (_x *Service) NotaryJoined(o *Order, p *Person) error {
	o.NotaryJoined = p

	return _x.Writer.NotaryJoined(o)
}

//ParticipantJoined sets connected Participant
func (_x *Service) ParticipantJoined(o *Order, pk _pk.PublicKey, p *Person) error {
	if o.ParticipantsJoined == nil {
		o.ParticipantsJoined = map[_pk.PublicKey]*Person{}
	}

	for _, x := range o.Participants {
		if pk == x {
			o.ParticipantsJoined[pk] = p

			return _x.Writer.ParticipantJoined(o)
		}
	}

	return fmt.Errorf("participant not found")
}

//WitnessJoined sets connected Witness
func (_x *Service) WitnessJoined(o *Order, pk _pk.PublicKey, p *Person) error {
	if o.WitnessesJoined == nil {
		o.WitnessesJoined = map[_pk.PublicKey]*Person{}
	}

	for _, x := range o.Witnesses {
		if pk == x {
			o.WitnessesJoined[pk] = p

			return _x.Writer.WitnessJoined(o)
		}
	}

	return fmt.Errorf("witness not found")
}
