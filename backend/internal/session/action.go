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

	//ActionRemoveWidget for removing widgets
	ActionRemoveWidget ActionType = "remove-widget"

	//ActionUpdateWidget for updating widgets
	ActionUpdateWidget ActionType = "update-widget"

	//ActionCeremonyStart for starting the ceremony
	ActionCeremonyStart ActionType = "ceremony-start"

	//ActionCeremonyFinish for finishing the ceremony
	ActionCeremonyFinish ActionType = "ceremony-finish"

	//ActionCeremonyCancel for canceling the ceremony
	ActionCeremonyCancel ActionType = "ceremony-cancel"
)

//Action is our client action
type Action struct {
	OrderID string           `json:"order_id"`
	Action  ActionType       `json:"action" validate:"required"`
	Data    *json.RawMessage `json:"data"`
}
