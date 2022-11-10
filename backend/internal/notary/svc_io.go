package notary

import _pk "notarynearby/internal/pk"

//CreateInput input for creating Notaries
type CreateInput struct {
	PublicKey _pk.PublicKey `json:"public_key"`
	Signature _pk.Signature `json:"signature"`
	FirstName string        `json:"first_name"`
	LastName  string        `json:"last_name"`
}

//CreateOutput result of Connect
type CreateOutput struct {
	Notary *Notary `json:"notary"`
}

//GetOneInput input for fetching Notary
type GetOneInput struct {
	PublicKey _pk.PublicKey `json:"public_key"`
}

//GetOneOutput output for fetching Notary
type GetOneOutput struct {
	Notary *Notary `json:"notary"`
}

//GetPFXInput input for fetching Notary's PFX file
type GetPFXInput struct {
	PublicKey _pk.PublicKey `json:"public_key"`
}

//GetPFXOutput output for fetching Notary's PFX file
type GetPFXOutput struct {
	Notary *Notary `json:"notary"`
	PFX    []byte  `json:"pfx"`
}
