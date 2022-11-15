package notary

import (
	"fmt"
	_pk "notarynearby/internal/pk"
)

//Notary entity
type Notary struct {
	PublicKey _pk.PublicKey `dynamo:"PublicKey" json:"public_key"`
	FullName  string        `dynamo:"FullName" json:"full_name"`
}

//GetCertificatePath returns Key for Notary's PFX (Digital Certificate)
func (_x *Notary) GetCertificatePath() string {
	return fmt.Sprintf("/%v/notary.pfx", _x.PublicKey)
}
