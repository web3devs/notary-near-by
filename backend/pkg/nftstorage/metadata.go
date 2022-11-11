package nftstorage

//Metadata structure for the metadata.json file
type Metadata struct {
	Name        string            `json:"name"`
	Description string            `json:"description"`
	Image       string            `json:"image"`
	Properties  map[string]string `json:"properties"`
}
