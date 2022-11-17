package notary

import (
	"fmt"
	_pk "notarynearby/internal/pk"
	"time"
)

//Notary entity
type Notary struct {
	PublicKey                _pk.PublicKey `dynamo:"PublicKey" json:"public_key"`
	FullName                 string        `dynamo:"FullName" json:"full_name"`
	State                    string        `dynamo:"State" json:"state"`
	IDNumber                 string        `dynamo:"IDNumber" json:"id_number"`
	CommissionExpirationDate time.Time     `dynamo:"CommissionExpirationDate" json:"commission_expiration_date"`
	CID                      string        `dynamo:"CID" json:"cid"`
}

//GetCertificatePath returns Key for Notary's PFX (Digital Certificate)
func (_x *Notary) GetCertificatePath() string {
	return fmt.Sprintf("/%v/notary.pfx", _x.PublicKey)
}
