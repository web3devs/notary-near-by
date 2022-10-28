package participant

import (
	_pk "notarynearby/internal/pk"
)

//Participant entity
type Participant struct {
	PublicKey _pk.PublicKey `dynamo:"PublicKey" json:"public_key"`
	FirstName string        `dynamo:"FirstName" json:"first_name"`
	LastName  string        `dynamo:"LastName" json:"last_name"`
}
