package notary

import (
	_pk "notarynearby/internal/pk"
	"time"
)

//CreateInput input for creating Notaries
type CreateInput struct {
	PublicKey                _pk.PublicKey `json:"public_key"`
	Signature                _pk.Signature `json:"signature"`
	FullName                 string        `json:"full_name"`
	State                    string        `json:"state"`
	IDNumber                 string        `json:"id_number"`
	CommissionExpirationDate time.Time     `json:"commission_expiration_date"`
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
