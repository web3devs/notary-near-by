package session

import (
	"encoding/json"
	"fmt"
	"notarynearby/internal/db"
	"os"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/sns"
)

//Service is the all in one entrypoint for managing sessions
type Service struct {
	sess   *session.Session
	Reader *Reader
	Writer *Writer
	snsc   *sns.SNS
}

//New instantiates Service
func New(sess *session.Session) (*Service, error) {
	svc := db.New(sess, fmt.Sprintf("%v-%v", os.Getenv("PROJECT_NAME"), os.Getenv("STAGE")), "wssessions")

	r, err := NewReader(svc)
	if err != nil {
		return nil, fmt.Errorf("failed initiating Reader: %w", err)
	}

	w, err := NewWriter(svc)
	if err != nil {
		return nil, fmt.Errorf("failed initiating Writer: %w", err)
	}

	snsc := sns.New(sess)

	return &Service{
		sess:   sess,
		Reader: r,
		Writer: w,
		snsc:   snsc,
	}, nil
}

//Connect stores data about WS connection and publishes it to SNS
func (_x *Service) Connect(_in *ConnectInput) (*ConnectOutput, error) {
	s := &Session{
		ConnectionID: _in.ConnectionID,
		CallbackURL:  _in.CallbackURL,
		SessionID:    "TODO", //TODO
	}
	//TODO: validate
	if err := _x.Writer.SaveSession(s); err != nil {
		return nil, fmt.Errorf("failed saving Session in DB: %w", err)
	}

	// m, err := json.Marshal(s)
	// if err != nil {
	// 	return nil, fmt.Errorf("failed marshalling Session: %w", err)
	// }

	// _, err = _x.snsc.Publish(&sns.PublishInput{
	// 	TopicArn: aws.String("arn:aws:sns:us-east-1:789146734688:notarynearby-dev-wssessions"),
	// 	Message:  aws.String(string(m)),
	// })
	// if err != nil {
	// 	return nil, fmt.Errorf("failed publishing Session to SNS: %w", err)
	// }

	return &ConnectOutput{
		ConnectionID: _in.ConnectionID,
		CallbackURL:  _in.CallbackURL,
	}, nil
}

//DispatchAction sends messages to other session participants
func (_x *Service) DispatchAction(_in *DispatchActionInput) (*DispatchActionOutput, error) {
	m, err := json.Marshal(_in)
	if err != nil {
		return nil, fmt.Errorf("failed marshalling Session: %w", err)
	}

	_, err = _x.snsc.Publish(&sns.PublishInput{
		TopicArn: aws.String("arn:aws:sns:us-east-1:789146734688:notarynearby-dev-wssessions"),
		Message:  aws.String(string(m)),
	})
	if err != nil {
		return nil, fmt.Errorf("failed publishing Session to SNS: %w", err)
	}

	return &DispatchActionOutput{
		ConnectionID: _in.ConnectionID,
		CallbackURL:  _in.CallbackURL,
	}, nil
}
