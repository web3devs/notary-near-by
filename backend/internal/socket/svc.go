package socket

import (
	"encoding/json"
	"fmt"
	"strings"

	_os "notarynearby/internal/order"
	_ss "notarynearby/internal/session"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/apigatewaymanagementapi"
)

//Service for managing WS related stuff
type Service struct {
	sess *session.Session
}

//New instantiates Service
func New(sess *session.Session) (*Service, error) {
	return &Service{
		sess: sess,
	}, nil
}

//PostToConnections sends message to all provided connections
func (_x *Service) PostToConnections(sessions []_ss.Session, excludedConnectionID string, msg []byte) error {
	var errs []string
	for _, c := range sessions {
		if excludedConnectionID != "" && c.ConnectionID == excludedConnectionID {
			continue
		}
		apigw := apigatewaymanagementapi.New(_x.sess, &aws.Config{
			Endpoint: aws.String(c.CallbackURL),
		})
		_, err := apigw.PostToConnection(&apigatewaymanagementapi.PostToConnectionInput{
			ConnectionId: aws.String(c.ConnectionID),
			Data:         msg,
		})
		if err != nil {
			fmt.Println("ERROR: failed posting to Connections: ", err)
			errs = append(errs, fmt.Sprintf("failed posting to Connection %v: %v", c.ConnectionID, err))
			continue
		}
	}

	if len(errs) > 0 {
		return fmt.Errorf("some errors: %v", strings.Join(errs, " | "))
	}

	return nil
}

//NotifyUpdateOrder sends "order updated" message back to provided connections
func (_x *Service) NotifyUpdateOrder(cs []_ss.Session, o *_os.Order) error {
	a, err := json.Marshal(struct {
		Action string     `json:"action"`
		Data   *_os.Order `json:"data"`
	}{
		Action: "update-order",
		Data:   o,
	})
	if err != nil {
		return fmt.Errorf("failed notifying about updated order: %w", err)
	}

	return _x.PostToConnections(cs, "", a)
}
