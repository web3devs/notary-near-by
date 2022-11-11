package nftstorage

import (
	"bytes"
	"encoding/json"
	"fmt"
	"time"

	"github.com/go-resty/resty/v2"
)

//API wrapper for nft.storage
type API struct {
	apiKey string
	url    string
	c      *resty.Client
}

//New returns instance of API
func New(apiKey string) (*API, error) {
	c := resty.New()

	return &API{
		apiKey: apiKey,
		url:    "https://api.nft.storage",
		c:      c,
	}, nil
}

//UploadInput for uploading stuff to IPFS
type UploadInput struct {
	SignedFile   []byte
	MetadataFile []byte
}

//UploadOutput the IPFS nft.storage API response (most important: CID)
type UploadOutput struct {
	Ok    bool `json:"ok"`
	Value struct {
		CID     string    `json:"cid"`
		Created time.Time `json:"created"`
		Type    string    `json:"type"`
		Scope   string    `json:"scope"`
		Files   []struct {
			Name string `json:"name"`
			Type string `json:"type"`
		} `json:"files"`
		Size int    `json:"size"`
		Name string `json:"name"`
		Pin  struct {
			CID     string    `json:"cid"`
			Created time.Time `json:"created"`
			Size    int       `json:"size"`
			Status  string    `json:"status"`
		} `json:"pin"`
		Deals []interface{} `json:"deals"`
	} `json:"value"`
}

//Upload uploads files to IPFS
func (_x *API) Upload(_in *UploadInput) (*UploadOutput, error) {
	r, err := _x.c.R().
		SetHeader("Authorization", "Bearer "+_x.apiKey).
		SetFileReader("file", "signed.pdf", bytes.NewReader(_in.SignedFile)).
		SetFileReader("file", "metadata.json", bytes.NewReader(_in.MetadataFile)).
		Post(_x.url + "/upload")
	if err != nil {
		return nil, fmt.Errorf("failed uploading file: %w", err)
	}

	fmt.Println(string(r.Body()))

	var o UploadOutput
	if err := json.Unmarshal(r.Body(), &o); err != nil {
		return nil, fmt.Errorf("failed Unmarshaling response: %w", err)
	}

	return &o, nil
}
