package session

import "encoding/json"

//ActionType defines types of available actions
type ActionType string

const (
	//ActionJoin for joining a session
	ActionJoin ActionType = "join"

	//ActionMessage for sending messages
	ActionMessage ActionType = "message"

	//ActionAddWidget for adding widgets
	ActionAddWidget ActionType = "add-widget"

	//ActionUpdateWidget for updating widgets
	ActionUpdateWidget ActionType = "update-widget"
)

//Action is our client action
type Action struct {
	OrderID string           `json:"order_id"`
	Action  ActionType       `json:"action" validate:"required"`
	Data    *json.RawMessage `json:"data"`
}
