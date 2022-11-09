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

//GetOneInput input for getting Order with additional fields
type GetOneInput struct {
	OrderID string `json:"order_id"`
}

//GetOneOutput result of GetOneInput
type GetOneOutput struct {
	Order       *Order `json:"order"`
	DownloadURL string `json:"download_url"`
}

//CeremonyStatusChangedInput input for changing status of ceremony
type CeremonyStatusChangedInput struct {
	Order  *Order `json:"order"`
	Status string `json:"status"`
}

//CeremonyStatusChangedOutput result of CeremonyStatusChangedInput
type CeremonyStatusChangedOutput struct {
	Order *Order `json:"order"`
}

type GeneratePDFInput struct {
	Order *Order `json:"order"`
}
type GeneratePDFOutput struct {
	Order *Order `json:"order"`
}
