package session

import "encoding/json"

//ActionType defines types of available actions
type ActionType string

const (
	//ActionJoin for joining a session
	ActionJoin ActionType = "join"

	//ActionMessage for sending messages
	ActionMessage ActionType = "message"
)

//Action is our client action
type Action struct {
	Action ActionType       `json:"action"`
	Data   *json.RawMessage `json:"data"`
}
