package order

import (
	"encoding/json"
	"fmt"

	_pk "notarynearby/internal/pk"
)

//Status represents order status, duh
type Status string

//StatusNew for new Orders
const StatusNew Status = "new"

//StatusNotaryJoined for Orders joined by notary
const StatusNotaryJoined Status = "notary-joined"

//StatusStarted for started Orders
const StatusStarted Status = "started"

//StatusFinished for finished Orders
const StatusFinished Status = "finished"

//StatusDocumentSigned for signed documents
const StatusDocumentSigned Status = "document-signed"

//StatusDocumentSigningConfirmed for documents signing confirmed by notary on blockchain
const StatusDocumentSigningConfirmed Status = "document-signing-confirmed"

//StatusNFTMinted for Order NFT minted
const StatusNFTMinted Status = "nft-minted"

//StatusCanceled for canceled Orders
const StatusCanceled Status = "canceled"

//Person personal data
type Person struct {
	FullName string `json:"full_name"`
}

//Order entity
type Order struct {
	Owner        _pk.PublicKey     `dynamo:"Owner" json:"owner" validate:"required"`
	ID           string            `dynamo:"ID" json:"id" validate:"required"`
	Notary       _pk.PublicKey     `dynamo:"Notary" json:"notary" validate:"required"`
	Participants []_pk.PublicKey   `dynamo:"Participants" json:"participants" validate:"required"`
	Witnesses    []_pk.PublicKey   `dynamo:"Witnesses" json:"witnesses" validate:"required"`
	Widgets      []json.RawMessage `dynamo:"Widgets" json:"widgets"`
	CreatedAt    string            `dynamo:"CreatedAt" json:"created_at"`
	Status       Status            `dynamo:"Status" json:"status"`
	CID          string            `dynamo:"CID" json:"cid"`
	TokenID      string            `dynamo:"TokenID" json:"token_id"`

	DocumentType string `dynamo:"DocumentType" json:"document_type" validate:"required"`

	NotaryJoined       *Person                   `json:"notary_joined"`
	ParticipantsJoined map[_pk.PublicKey]*Person `json:"participants_joined"`
	WitnessesJoined    map[_pk.PublicKey]*Person `json:"witnesses_joined"`
}

//GetInFilePath returns S3 path for the uploaded file (ORIGINAL)
func (_x *Order) GetInFilePath() string {
	return fmt.Sprintf("%v/in.pdf", _x.ID)
}

//GetOutFilePath returns S3 path for the uploaded file (WIDGETS APPLIED)
func (_x *Order) GetOutFilePath() string {
	return fmt.Sprintf("%v/out.pdf", _x.ID)
}

//GetSignedFilePath returns S3 path for the SIGNED file
func (_x *Order) GetSignedFilePath() string {
	return fmt.Sprintf("%v/signed.pdf", _x.ID)
}
