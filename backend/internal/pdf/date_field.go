package pdf

import (
	"time"

	"github.com/go-pdf/fpdf"
)

//DateField representing basic date field
type DateField struct {
	page       int
	x, y, w, h float64
	value      time.Time
}

//Render renders the text field to PDF
func (_x DateField) Render(pdf *fpdf.Fpdf) {
	fontSize := 10.0
	margin := 0.0
	pdf.SetFont("Arial", "", fontSize)
	pdf.SetXY(_x.x, _x.y)

	pdf.SetCellMargin(margin)
	pdf.SetTextColor(27, 31, 30)
	pdf.SetFillColor(103, 217, 22)
	pdf.SetLineWidth(0.1)

	v := _x.value.Format(time.RFC3339)

	pdf.CellFormat(_x.w, fontSize+2*margin, v, "1", 0, "LT", true, 0, "")
}

//AddDateField adds date field to Editor / PDF
func (_x *Editor) AddDateField(page int, date time.Time, x, y, w, h float64) {
	_x.dateFields = append(_x.dateFields, DateField{
		page:  page,
		x:     x,
		y:     y,
		w:     w,
		h:     h,
		value: date,
	})
}
