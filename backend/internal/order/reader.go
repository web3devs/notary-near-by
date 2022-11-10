package order

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

//GetOne returns Order for provided ID
func (_x *Reader) GetOne(id string) (*Order, error) {
	var r Order

	err := _x.table().Get("ID", id).Index("ByID").One(&r)

	return &r, err
}

//GetAll returns all Orders
func (_x *Reader) GetAll() ([]Order, error) {
	var r []Order

	err := _x.table().Scan().All(&r)

	return r, err
}

//GetByOwner returns all Orders by owner address
func (_x *Reader) GetByOwner(owner _pk.PublicKey) ([]Order, error) {
	var r []Order

	err := _x.table().Get("Owner", owner.String()).All(&r)

	return r, err
}
