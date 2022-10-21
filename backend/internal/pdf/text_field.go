package pdf

import (
	"github.com/go-pdf/fpdf"
)

//TextField representing basic text field
type TextField struct {
	page       int
	x, y, w, h float64
	value      string
}

//Render renders the text field to PDF
func (_x TextField) Render(pdf *fpdf.Fpdf) {
	fontSize := 10.0
	margin := 0.0
	pdf.SetFont("Arial", "", fontSize)
	pdf.SetXY(_x.x, _x.y)

	pdf.SetCellMargin(margin)
	pdf.SetTextColor(27, 31, 30)
	pdf.SetFillColor(35, 186, 156)
	pdf.SetLineWidth(0.1)

	pdf.CellFormat(_x.w, fontSize+2*margin, _x.value, "1", 0, "LT", true, 0, "")
}

//AddTextField adds text field to Editor / PDF
func (_x *Editor) AddTextField(page int, text string, x, y, w, h float64) {
	_x.textFields = append(_x.textFields, TextField{
		page:  page,
		x:     x,
		y:     y,
		w:     w,
		h:     h,
		value: text,
	})
}
