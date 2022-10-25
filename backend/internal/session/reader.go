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

//GetAllBySession returns all Deposits for provided Owner
func (_x *Reader) GetAllBySession(sessionID string) ([]Session, error) {
	var rr []Session

	// err := _x.table().Get("SessionID", sessionID).Index("BySessionID").All(&rr) //TODO: use this when connected
	err := _x.table().Scan().All(&rr)

	return rr, err
}
