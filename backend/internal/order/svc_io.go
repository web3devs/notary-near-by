package order

import (
	_bucket "notarynearby/internal/bucket"
	_pk "notarynearby/internal/pk"
)

//CreateInput input for creating Orders
type CreateInput struct {
	Owner        _pk.PublicKey   `json:"owner" validate:"required"`
	Participants []_pk.PublicKey `json:"participants"`
	Witnesses    []_pk.PublicKey `json:"witnesses"`
	DocumentType string          `json:"document_type" validate:"required"`
	File         _bucket.File    `json:"file" validate:"required"`
}

//CreateOutput result of Connect
type CreateOutput struct {
	Order     *Order `json:"order"`
	UploadURL string `json:"upload_url"`
}
