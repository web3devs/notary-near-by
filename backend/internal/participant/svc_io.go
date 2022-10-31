package participant

import _pk "notarynearby/internal/pk"

//CreateInput input for creating Participants
type CreateInput struct {
	PublicKey _pk.PublicKey `json:"public_key"`
	Signature _pk.Signature `json:"signature"`
	FirstName string        `json:"first_name"`
	LastName  string        `json:"last_name"`
}

//CreateOutput result of Connect
type CreateOutput struct {
	Participant *Participant `json:"participant"`
}
