package participant

import (
	"notarynearby/internal/db"

	"github.com/guregu/dynamo"
)

//Reader for reading data
type Reader struct {
	svc *db.Service
}

//NewReader creates Reader instance
func NewReader(svc *db.Service) (*Reader, error) {
	return &Reader{
		svc: svc,
	}, nil
}

func (_x *Reader) table() dynamo.Table {
	return _x.svc.DB.Table(_x.svc.TableName)
}

//GetOne returns Participant for provided ID
func (_x *Reader) GetOne(id string) (Participant, error) {
	var r Participant

	err := _x.table().Get("ID", id).One(&r)

	return r, err
}
