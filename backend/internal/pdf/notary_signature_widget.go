package pdf

import (
	"github.com/go-pdf/fpdf"
)

//NotarySignatureValue for custom notary stamp widget value
type NotarySignatureValue struct {
	FullName string `json:"full_name"`
}

//NotarySignatureWidget representing basic date field
type NotarySignatureWidget struct {
	ID    string               `json:"id"`
	Page  int                  `json:"page"`
	X     float64              `json:"x"`
	Y     float64              `json:"y"`
	Value NotarySignatureValue `json:"value"`
}

//Render renders the text field to PDF
func (_x NotarySignatureWidget) Render(pdf *fpdf.Fpdf) {
	w := 200.0
	h := 35.0
	lw := 1.0 //line width
	mt := 4.0 //margin top
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

	//Notary name
	pdf.SetXY(_x.X+lw, _x.Y+lw+mt)
	pdf.SetXY(_x.X+lw, pdf.GetY()+6)
	pdf.SetFont("Times", "IB", 14)
	pdf.MultiCell(w-2*lw, 15-2*lw, _x.Value.FullName, "0", "CT", false)
}

//AddNotarySignatureWidget adds date field to Editor / PDF
func (_x *Editor) AddNotarySignatureWidget(page int, value NotarySignatureValue, x, y float64) {
	_x.notarySignatureWidgets = append(_x.notarySignatureWidgets, NotarySignatureWidget{
		Page:  page,
		X:     x,
		Y:     y,
		Value: value,
	})
}
