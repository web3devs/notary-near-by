package order

import (
	_pk "notarynearby/internal/pk"
)

//CreateInput input for creating Orders
type CreateInput struct {
	Owner        _pk.PublicKey   `json:"owner" validate:"required"`
	Participants []_pk.PublicKey `json:"participants"`
	Witnesses    []_pk.PublicKey `json:"witnesses"`
}

//CreateOutput result of Connect
type CreateOutput struct {
	Order *Order `json:"order"`
}
