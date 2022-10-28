package notary

import (
	_pk "notarynearby/internal/pk"
)

//Notary entity
type Notary struct {
	PublicKey _pk.PublicKey `dynamo:"PublicKey" json:"public_key"`
	FirstName string        `dynamo:"FirstName" json:"first_name"`
	LastName  string        `dynamo:"LastName" json:"last_name"`
}
