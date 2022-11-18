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
	OrderID           string `json:"order_id"`
	DownloadURLSigned bool
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

type SignPDFInput struct {
	Order *Order `json:"order"`
	PFX   []byte
}
type SignPDFOutput struct {
	Order *Order `json:"order"`
}

//ConfirmSigningInput input for confirming Signing of the Order related documents
type ConfirmSigningInput struct {
	Order *Order `json:"order"`
}

//ConfirmSigningOutput result of confirming Signing of the Order related documents
type ConfirmSigningOutput struct {
	Order *Order `json:"order"`
}

//ConfirmMintingInput input for confirming Minting of Participant NFT for the Order
type ConfirmMintingInput struct {
	Order   *Order `json:"-"`
	TokenID string `json:"token_id"`
}

//ConfirmMintingOutput result of confirming Minting of Participant NFT for the Order
type ConfirmMintingOutput struct {
	Order *Order `json:"order"`
}
