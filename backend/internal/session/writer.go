package session

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

//SaveSession saves session in DB
func (_x *Writer) SaveSession(i *Session) error {
	return _x.svc.DB.Table(_x.svc.TableName).Put(i).Run()
}

//JoinSession saves session in DB
func (_x *Writer) JoinSession(i *Session) error {
	return _x.svc.DB.Table(_x.svc.TableName).
		Update("ConnectionID", i.ConnectionID).
		Set("OrderID", i.OrderID).
		Value(i)
}
