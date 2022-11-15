package pdf

import (
	"github.com/go-pdf/fpdf"
)

//Widget struct to wrap WidgetTypes
type Widget struct {
	WidgetType string      `json:"type"`
	Widget     interface{} `json:"field"`
}

//WidgetType interface
type WidgetType interface {
	Render(pdf *fpdf.Fpdf)
}
