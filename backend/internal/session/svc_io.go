package session

import (
	_o "notarynearby/internal/order"
)

//ConnectInput input for session Connect
type ConnectInput struct {
	ConnectionID string
	CallbackURL  string
}

//ConnectOutput result of Connect
type ConnectOutput struct {
	ConnectionID string
	CallbackURL  string
}

//DispatchActionInput input for dispatching actions
type DispatchActionInput struct {
	ConnectionID string    `json:"connection_id" validate:"required"`
	CallbackURL  string    `json:"callback_url" validate:"required"`
	Action       Action    `json:"action" validate:"required"`
	Order        *_o.Order `json:"-" validate:"required"`
}

//DispatchActionOutput for action dispatching results
type DispatchActionOutput struct {
	ConnectionID string
	CallbackURL  string
}
