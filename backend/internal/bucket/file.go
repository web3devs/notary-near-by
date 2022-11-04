package bucket

//File type for files, duh
type File struct {
	Name string `json:"name"`
	Size int64  `json:"size"`
	Type string `json:"type"`
}
