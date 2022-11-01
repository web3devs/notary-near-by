package notary

import (
	"fmt"
	"notarynearby/internal/db"
	"os"

	"github.com/aws/aws-sdk-go/aws/session"
)

//Service is the all in one entrypoint for managing Notaries
type Service struct {
	sess   *session.Session
	Reader *Reader
	Writer *Writer
}

//New instantiates Service
func New(sess *session.Session) (*Service, error) {
	svc := db.New(sess, fmt.Sprintf("%v-%v", os.Getenv("PROJECT_NAME"), os.Getenv("STAGE")), "notaries")

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
	s := &Notary{
		PublicKey: _in.PublicKey,
		FirstName: _in.FirstName,
		LastName:  _in.LastName,
	}
	//TODO: Validate PublicKey and Signature
	if err := _x.Writer.Create(s); err != nil {
		return nil, fmt.Errorf("failed saving Session in DB: %w", err)
	}

	return &CreateOutput{
		Notary: s,
	}, nil
}