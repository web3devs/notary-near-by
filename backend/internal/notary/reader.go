package notary

import (
	"notarynearby/internal/db"
	_pk "notarynearby/internal/pk"

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

//GetOne returns Notary for provided PublicKey
func (_x *Reader) GetOne(id _pk.PublicKey) (Notary, error) {
	var r Notary

	err := _x.table().Get("PublicKey", id.String()).One(&r)

	return r, err
}
