package session

import (
	"notarynearby/internal/db"
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
