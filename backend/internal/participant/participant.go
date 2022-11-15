package participant

import (
	_pk "notarynearby/internal/pk"
)

//Participant entity
type Participant struct {
	PublicKey _pk.PublicKey `dynamo:"PublicKey" json:"public_key"`
	FullName  string        `dynamo:"FullName" json:"full_name"`
}
