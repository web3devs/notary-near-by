package order

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	_bucket "notarynearby/internal/bucket"
	"notarynearby/internal/db"
	_pk "notarynearby/internal/pk"
	"os"
	"os/exec"
	"time"

	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/gofrs/uuid"

	_editor "notarynearby/internal/pdf"
	_nft "notarynearby/pkg/nftstorage"
)

//Service is the all in one entrypoint for managing Orders
type Service struct {
	sess   *session.Session
	Reader *Reader
	Writer *Writer
	bucket *_bucket.Service
	nft    *_nft.API
}

//New instantiates Service
func New(sess *session.Session) (*Service, error) {
	svc := db.New(sess, fmt.Sprintf("%v-%v", os.Getenv("PROJECT_NAME"), os.Getenv("STAGE")), "orders")

	r, err := NewReader(svc)
	if err != nil {
		return nil, fmt.Errorf("failed initiating Reader: %w", err)
	}

	w, err := NewWriter(svc)
	if err != nil {
		return nil, fmt.Errorf("failed initiating Writer: %w", err)
	}

	bucket, err := _bucket.New(os.Getenv("S3_ORDERS"), sess)
	if err != nil {
		return nil, fmt.Errorf("failed initiating Bucket: %w", err)
	}

	nft, err := _nft.New(os.Getenv("NFT_STORAGE_API_KEY"))
	if err != nil {
		return nil, fmt.Errorf("failed initiating NFT Storage client: %w", err)
	}

	return &Service{
		sess:   sess,
		Reader: r,
		Writer: w,
		bucket: bucket,
		nft:    nft,
	}, nil
}

//Create creates Order
func (_x *Service) Create(_in *CreateInput) (*CreateOutput, error) {
	id, err := uuid.NewV4()
	if err != nil {
		return nil, fmt.Errorf("failed generating UUID: %w", err)
	}

	//add Owner as Participant if not found in Particpants list
	addOwner := true
	for _, p := range _in.Participants {
		if p == _in.Owner {
			addOwner = false
		}
	}
	if addOwner {
		_in.Participants = append(_in.Participants, _pk.PublicKey(_in.Owner.String()))
	}

	pts := []_pk.PublicKey{}
	for _, p := range _in.Participants {
		pts = append(pts, _pk.PublicKey(p.String()))
	}

	wts := []_pk.PublicKey{}
	for _, p := range _in.Witnesses {
		pts = append(pts, _pk.PublicKey(p.String()))
	}

	s := &Order{
		Owner:        _pk.PublicKey(_in.Owner.String()),
		ID:           id.String(),
		Participants: pts,
		Witnesses:    wts,
		Widgets:      []json.RawMessage{},
		DocumentType: _in.DocumentType,
		CreatedAt:    time.Now().Format(time.RFC3339),
		Status:       StatusNew,
	}
	//TODO: Validate PublicKey and Signature
	if err := _x.Writer.Create(s); err != nil {
		return nil, fmt.Errorf("failed saving Session in DB: %w", err)
	}

	uploadURL, err := _x.bucket.GetUploadURL(s.GetInFilePath())
	if err != nil {
		return nil, fmt.Errorf("failed creating upload URL: %w", err)
	}

	return &CreateOutput{
		Order:     s,
		UploadURL: uploadURL,
	}, nil
}

//NotaryJoined sets connected Notary
func (_x *Service) NotaryJoined(o *Order, p *Person) error {
	o.Status = StatusNotaryJoined
	o.NotaryJoined = p

	return _x.Writer.NotaryJoined(o)
}

//ParticipantJoined sets connected Participant
func (_x *Service) ParticipantJoined(o *Order, pk _pk.PublicKey, p *Person) error {
	if o.ParticipantsJoined == nil {
		o.ParticipantsJoined = map[_pk.PublicKey]*Person{}
	}

	for _, x := range o.Participants {
		if pk.Equals(x) {
			o.ParticipantsJoined[_pk.PublicKey(pk.String())] = p

			return _x.Writer.ParticipantJoined(o)
		}
	}

	return fmt.Errorf("participant not found")
}

//WitnessJoined sets connected Witness
func (_x *Service) WitnessJoined(o *Order, pk _pk.PublicKey, p *Person) error {
	if o.WitnessesJoined == nil {
		o.WitnessesJoined = map[_pk.PublicKey]*Person{}
	}

	for _, x := range o.Witnesses {
		if pk.Equals(x) {
			o.WitnessesJoined[_pk.PublicKey(pk.String())] = p

			return _x.Writer.WitnessJoined(o)
		}
	}

	return fmt.Errorf("witness not found")
}

//GetOne returns order with download URL
func (_x *Service) GetOne(_in *GetOneInput) (*GetOneOutput, error) {
	var r GetOneOutput

	o, err := _x.Reader.GetOne(_in.OrderID)
	if err != nil {
		return nil, fmt.Errorf("could not find Order: %w", err)
	}

	fp := o.GetInFilePath()
	if _in.DownloadURLSigned {
		fp = o.GetSignedFilePath()
	}

	downloadURL, err := _x.bucket.GetDownloadURL(fp)
	if err != nil {
		return nil, fmt.Errorf("could not create download URL: %w", err)
	}

	r.Order = o
	r.DownloadURL = downloadURL

	return &r, nil
}

//CeremonyStatusChanged sets connected Witness
func (_x *Service) CeremonyStatusChanged(_in *CeremonyStatusChangedInput) (*CeremonyStatusChangedOutput, error) {
	s := StatusNew
	switch _in.Status {
	case "start":
		s = StatusStarted
	case "finish":
		s = StatusFinished
	case "cancel":
		s = StatusCanceled
	case string(StatusNew):
		s = StatusNew
	case string(StatusStarted):
		s = StatusStarted
	case string(StatusFinished):
		s = StatusFinished
	case string(StatusDocumentSigned):
		s = StatusDocumentSigned
	case string(StatusNFTMinted):
		s = StatusNFTMinted
	case string(StatusCanceled):
		s = StatusCanceled
	}

	_in.Order.Status = s
	if err := _x.Writer.UpdateStatus(_in.Order); err != nil {
		return nil, fmt.Errorf("failed updating status: %w", err)
	}

	return &CeremonyStatusChangedOutput{
		Order: _in.Order,
	}, nil
}

//ConfirmSigning confirms Order's been signed by Notary (Notary tokens minted)
func (_x *Service) ConfirmSigning(_in *ConfirmSigningInput) (*ConfirmSigningOutput, error) {
	if _in.Order.Status != StatusDocumentSigned {
		return nil, fmt.Errorf("failed confirming signing. Order in incorrect state: %v", _in.Order.Status)
	}

	_in.Order.Status = StatusDocumentSigningConfirmed
	if err := _x.Writer.UpdateStatus(_in.Order); err != nil {
		return nil, fmt.Errorf("failed updating status: %w", err)
	}

	return &ConfirmSigningOutput{
		Order: _in.Order,
	}, nil
}

//ConfirmMinting confirms Order NFT access token's been minted by Participant (Participant tokens minted)
func (_x *Service) ConfirmMinting(_in *ConfirmMintingInput) (*ConfirmMintingOutput, error) {
	if _in.Order.Status != StatusDocumentSigningConfirmed {
		return nil, fmt.Errorf("failed confirming minting. Order in incorrect state: %v", _in.Order.Status)
	}

	_in.Order.TokenID = _in.TokenID
	_in.Order.Status = StatusNFTMinted
	if err := _x.Writer.UpdateTokenID(_in.Order); err != nil {
		return nil, fmt.Errorf("failed updating status: %w", err)
	}

	return &ConfirmMintingOutput{
		Order: _in.Order,
	}, nil
}

//GeneratePDF applies _x.Widgets to Order's PDF IN file and stores it on S3
func (_x *Service) GeneratePDF(_in *GeneratePDFInput) (*GeneratePDFOutput, error) {
	fmt.Println("1. Fetch bytes from S3")
	bts, err := _x.bucket.Download(_in.Order.GetInFilePath())
	if err != nil {
		return nil, fmt.Errorf("failed downloading file from S3: %w", err)
	}
	tmpFileIn := fmt.Sprintf("/tmp/%v-in.pdf", _in.Order.ID)
	tmpFileOut := fmt.Sprintf("/tmp/%v-out.pdf", _in.Order.ID)

	fmt.Println("2. Save bytes to /tmp/ORDER_ID-in.pdf")
	if err := ioutil.WriteFile(tmpFileIn, bts, 0777); err != nil {
		return nil, fmt.Errorf("failed writing IN.pdf to /tmp: %w", err)
	}

	fmt.Println("3. Init editor with the temp file and apply fields")
	e := _editor.New(tmpFileIn)
	if e == nil {
		return nil, fmt.Errorf("failed initiating Editor")
	}

	j, err := json.Marshal(_in.Order.Widgets)
	if err != nil {
		return nil, fmt.Errorf("failed JSON marshaling Order.Widgets: %w", err)
	}

	if err := e.LoadWidgets([]byte(j)); err != nil {
		return nil, fmt.Errorf("failed loading widgets to Editor: %w", err)
	}

	e.RenderWidgets()

	fmt.Println("4. Save files to /tmp/orderID/out.pdf")
	if err := e.SaveToFile(tmpFileOut); err != nil {
		return nil, fmt.Errorf("failed saving OUT.pdf file to /tmp: %w", err)
	}

	fmt.Println("5. Send /tmp/orderID/out.pdf to S3 for signing")
	f, err := os.Open(tmpFileOut)
	if err != nil {
		return nil, fmt.Errorf("failed opening OUT.pdf file: %w", err)
	}

	if err := _x.bucket.Upload(_in.Order.GetOutFilePath(), f); err != nil {
		return nil, fmt.Errorf("failed uploading OUT.pdf to S3: %w", err)
	}

	fmt.Println("6. Remove directory and it's contents /tmp/orderID")
	os.Remove(tmpFileIn)
	os.Remove(tmpFileOut)

	return &GeneratePDFOutput{
		Order: _in.Order,
	}, nil
}

//SignPDF signs PDF with provided Notary's PFX Digital Certificate
func (_x *Service) SignPDF(_in *SignPDFInput) (*SignPDFOutput, error) {
	pfx := fmt.Sprintf("/tmp/%v.pfx", _in.Order.ID)
	pdf := fmt.Sprintf("/tmp/%v.pdf", _in.Order.ID)
	signed := fmt.Sprintf("/tmp/%v.signed.pdf", _in.Order.ID)

	//Create PDF file
	bts, err := _x.bucket.Download(_in.Order.GetOutFilePath())
	if err != nil {
		return nil, fmt.Errorf("failed downloading file from S3: %w", err)
	}

	if err := ioutil.WriteFile(pdf, bts, 0777); err != nil {
		return nil, fmt.Errorf("failed writing .pdf to /tmp: %w", err)
	}

	//Create PFX file
	if err := ioutil.WriteFile(pfx, _in.PFX, 0777); err != nil {
		return nil, fmt.Errorf("failed writing .pfx to /tmp: %w", err)
	}

	//Run scripts
	cmd := exec.Command(
		"node",
		"/opt/index.js",
		fmt.Sprintf(`{"pfx":"%s","pdf":"%s"}`, pfx, pdf),
	)
	out, err := cmd.CombinedOutput()
	if err != nil {
		return nil, fmt.Errorf("running command failed: %s %s", err, string(out))
	}

	//We should have the file, now let's push it to S3
	f, err := os.Open(signed)
	if err != nil {
		return nil, fmt.Errorf("failed opening signed.pdf file: %w", err)
	}

	if err := _x.bucket.Upload(_in.Order.GetSignedFilePath(), f); err != nil {
		return nil, fmt.Errorf("failed uploading OUT.pdf to S3: %w", err)
	}

	//Now we can send the file to IPFS and persist IPFS CID within the order
	sbts, err := os.ReadFile(signed) //XXX: Don't have the brainpower to look for os.File => []byte
	if err != nil {
		return nil, fmt.Errorf("failed reading signed.pdf: %w", err)
	}

	m := _nft.Metadata{
		Name:        fmt.Sprintf("Notarial act %v", _in.Order.ID),
		Description: fmt.Sprintf("TODO: Some notarial act description"),
	}
	mbts, err := json.Marshal(m)
	if err != nil {
		return nil, fmt.Errorf("failed marshaling metadata.json: %w", err)
	}

	o, err := _x.nft.Upload(&_nft.UploadInput{
		SignedFile:   sbts,
		MetadataFile: mbts,
	})
	if err != nil {
		return nil, fmt.Errorf("failed uploading files to IPFS: %w", err)
	}

	_in.Order.CID = o.Value.CID
	_in.Order.Status = StatusDocumentSigned
	if err := _x.Writer.UpdateCID(_in.Order); err != nil {
		return nil, fmt.Errorf("failed saving CID: %w", err)
	}

	return &SignPDFOutput{
		Order: _in.Order,
	}, nil
}
