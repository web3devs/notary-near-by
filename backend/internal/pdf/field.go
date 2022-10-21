package pdf

import (
	"github.com/go-pdf/fpdf"
)

//Field struct to wrap FieldTypes
type Field struct {
	FieldType string      `json:"type"`
	Field     interface{} `json:"field"`
}

//FieldType interface
type FieldType interface {
	Render(pdf *fpdf.Fpdf)
}
