package pdf

import (
	"github.com/go-pdf/fpdf"
)

//NotaryStampValue for custom notary stamp widget value
type NotaryStampValue struct {
	FullName string `json:"full_name"`
}

//NotaryStampWidget representing basic date field
type NotaryStampWidget struct {
	ID    string           `json:"id"`
	Page  int              `json:"page"`
	X     float64          `json:"x"`
	Y     float64          `json:"y"`
	Value NotaryStampValue `json:"value"`
}

//Render renders the text field to PDF
func (_x NotaryStampWidget) Render(pdf *fpdf.Fpdf) {
	w := 200.0
	h := 100.0
	lw := 1.0 //line width
	mt := 8.0 //margin top
	pdf.SetDrawColor(189, 11, 255)

	margin := 1.0
	pdf.SetCellMargin(margin)
	pdf.SetTextColor(27, 31, 30)
	pdf.SetFillColor(220, 220, 220)

	//Border
	pdf.SetXY(_x.X, _x.Y)
	pdf.SetLineWidth(lw)
	pdf.SetLineJoinStyle("bevel")
	pdf.MultiCell(w, h, "", "1", "CT", false)

	//Notary Public title
	pdf.SetXY(_x.X+lw, _x.Y+lw+mt)
	pdf.SetFont("Arial", "B", 12)
	pdf.SetLineWidth(0.0)
	pdf.MultiCell(w-2*lw, 15-2*lw, "Notary Public\nState of Washington", "0", "CT", false)

	//Notary name
	pdf.SetXY(_x.X+lw, pdf.GetY()+6)
	pdf.SetFont("Times", "IB", 14)
	pdf.MultiCell(w-2*lw, 15-2*lw, _x.Value.FullName, "0", "CT", false)

	//Commission exp.
	pdf.SetXY(_x.X+lw, pdf.GetY()+7)
	pdf.SetFont("Arial", "", 11)
	pdf.MultiCell(w-2*lw, 15-2*lw, "My Commission Expires\nNovember 18, 2035", "0", "CT", false)
}

//AddNotaryStampWidget adds date field to Editor / PDF
func (_x *Editor) AddNotaryStampWidget(page int, value NotaryStampValue, x, y float64) {
	_x.notaryStampWidgets = append(_x.notaryStampWidgets, NotaryStampWidget{
		Page:  page,
		X:     x,
		Y:     y,
		Value: value,
	})
}
