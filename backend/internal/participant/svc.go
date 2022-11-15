package participant

import (
	"fmt"
	"notarynearby/internal/db"
	"notarynearby/internal/pk"
	"os"

	"github.com/aws/aws-sdk-go/aws/session"
)

//Service is the all in one entrypoint for managing Participants
type Service struct {
	sess   *session.Session
	Reader *Reader
	Writer *Writer
}

//New instantiates Service
func New(sess *session.Session) (*Service, error) {
	svc := db.New(sess, fmt.Sprintf("%v-%v", os.Getenv("PROJECT_NAME"), os.Getenv("STAGE")), "participants")

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

//Create creates Participants
func (_x *Service) Create(_in *CreateInput) (*CreateOutput, error) {
	s := &Participant{
		PublicKey: pk.PublicKey(_in.PublicKey.String()),
		FullName:  _in.FullName,
	}
	//TODO: Validate PublicKey and Signature
	if err := _x.Writer.Create(s); err != nil {
		return nil, fmt.Errorf("failed saving Session in DB: %w", err)
	}

	return &CreateOutput{
		Participant: s,
	}, nil
}
