package pdf

import (
	"github.com/go-pdf/fpdf"
)

//TextField representing basic text field
type TextField struct {
	ID    string  `json:"id"`
	Page  int     `json:"page"`
	X     float64 `json:"x"`
	Y     float64 `json:"y"`
	W     float64 `json:"w"`
	H     float64 `json:"h"`
	Value string  `json:"value"`
}

//Render renders the text field to PDF
func (_x TextField) Render(pdf *fpdf.Fpdf) {
	fontSize := 10.0
	margin := 0.0
	pdf.SetFont("Arial", "", fontSize)
	pdf.SetXY(_x.X, _x.Y)

	pdf.SetCellMargin(margin)
	pdf.SetTextColor(27, 31, 30)
	pdf.SetFillColor(35, 186, 156)
	pdf.SetLineWidth(0.1)

	pdf.CellFormat(_x.W, fontSize+2*margin, _x.Value, "1", 0, "LT", true, 0, "")
}

//AddTextField adds text field to Editor / PDF
func (_x *Editor) AddTextField(page int, text string, x, y, w, h float64) {
	_x.textFields = append(_x.textFields, TextField{
		Page:  page,
		X:     x,
		Y:     y,
		W:     w,
		H:     h,
		Value: text,
	})
}
