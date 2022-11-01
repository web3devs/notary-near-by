package order

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

//Create saves Order in DB
func (_x *Writer) Create(i *Order) error {
	return _x.svc.DB.Table(_x.svc.TableName).Put(i).If("attribute_not_exists(ID)").Run()
}

//UpdateWidgets update widgets in DB
func (_x *Writer) UpdateWidgets(i *Order) error {
	return _x.svc.DB.Table(_x.svc.TableName).
		Update("Owner", i.Owner).
		Range("ID", i.ID).
		Set("Widgets", i.Widgets).
		Value(i)
}