package session

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

//GetOne returns Session for provided ConnectionID
func (_x *Reader) GetOne(connectionID string) (Session, error) {
	var r Session

	err := _x.table().Get("ConnectionID", connectionID).One(&r)

	return r, err
}

//GetAllByOrder returns all Deposits for provided Order
func (_x *Reader) GetAllByOrder(orderID string) ([]Session, error) {
	var rr []Session

	if orderID == "--DISABLED--" {
		return rr, nil
	}

	err := _x.table().Get("OrderID", orderID).Index("ByOrderID").All(&rr)

	return rr, err
}
