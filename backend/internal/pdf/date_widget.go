package pdf

import (
	"time"

	"github.com/go-pdf/fpdf"
)

//DateWidget representing basic date widget
type DateWidget struct {
	ID    string    `json:"id"`
	Page  int       `json:"page"`
	X     float64   `json:"x"`
	Y     float64   `json:"y"`
	W     float64   `json:"w"`
	H     float64   `json:"h"`
	Value time.Time `json:"value"`
}

//Render renders the text widget to PDF
func (_x DateWidget) Render(pdf *fpdf.Fpdf) {
	fontSize := 10.0
	margin := 0.0
	pdf.SetFont("Arial", "", fontSize)
	pdf.SetXY(_x.X, _x.Y)

	pdf.SetCellMargin(margin)
	pdf.SetTextColor(27, 31, 30)
	pdf.SetFillColor(35, 186, 156)
	pdf.SetLineWidth(0.1)

	v := _x.Value.Format(time.UnixDate)

	pdf.CellFormat(_x.W, fontSize+2*margin, v, "1", 0, "LT", true, 0, "")
}

//AddDateWidget adds date widget to Editor / PDF
func (_x *Editor) AddDateWidget(page int, date time.Time, x, y, w, h float64) {
	_x.dateWidgets = append(_x.dateWidgets, DateWidget{
		Page:  page,
		X:     x,
		Y:     y,
		W:     w,
		H:     h,
		Value: date,
	})
}
