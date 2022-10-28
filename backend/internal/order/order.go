package order

import (
	"encoding/json"

	_pk "notarynearby/internal/pk"
)

//Order entity
type Order struct {
	Owner        _pk.PublicKey     `dynamo:"Owner" json:"owner" validate:"required"`
	ID           string            `dynamo:"ID" json:"id" validate:"required"`
	Notary       _pk.PublicKey     `dynamo:"Notary" json:"notary" validate:"required"`
	Participants []_pk.PublicKey   `dynamo:"Participants" json:"participants" validate:"required"`
	Witnesses    []_pk.PublicKey   `dynamo:"Witnesses" json:"witnesses" validate:"required"`
	Widgets      []json.RawMessage `dynamo:"Widgets" json:"widgets"`
}
