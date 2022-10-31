package participant

import (
	"notarynearby/internal/db"
)

//Writer for writing data
type Writer struct {
	svc *db.Service
}

//NewWriter instantiates Writer
func NewWriter(svc *db.Service) (*Writer, error) {
	return &Writer{
		svc: svc,
	}, nil
}

//Create saves Participant in DB
func (_x *Writer) Create(i *Participant) error {
	return _x.svc.DB.Table(_x.svc.TableName).Put(i).If("attribute_not_exists(PublicKey)").Run()
}
