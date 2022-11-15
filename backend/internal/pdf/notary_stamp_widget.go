package pdf

import (
	"github.com/go-pdf/fpdf"
)

//NotaryStampWidget representing basic date field
type NotaryStampWidget struct {
	ID    string  `json:"id"`
	Page  int     `json:"page"`
	X     float64 `json:"x"`
	Y     float64 `json:"y"`
	Value string  `json:"value"`
}

//Render renders the text field to PDF
func (_x NotaryStampWidget) Render(pdf *fpdf.Fpdf) {
	w := 150.0
	h := 80.0
	lw := 1.0 //line width
	mt := 6.0 //margin top
	fontSize := 10.0
	margin := 1.0
	pdf.SetFont("Arial", "B", fontSize)
	pdf.SetCellMargin(margin)
	pdf.SetTextColor(27, 31, 30)
	pdf.SetFillColor(220, 220, 220)

	//Border
	pdf.SetXY(_x.X, _x.Y)
	pdf.SetLineWidth(lw)
	pdf.SetLineJoinStyle("bevel")
	pdf.MultiCell(w, h, "", "1", "CT", true)

	//Notary Public title
	pdf.SetXY(_x.X+lw, _x.Y+lw+mt)
	pdf.SetLineWidth(0.0)
	pdf.MultiCell(w-2*lw, 15-2*lw, "Notary Public\nState of Washington", "0", "CT", true)

	//Notary name
	pdf.SetXY(_x.X+lw, pdf.GetY()+2)
	pdf.SetFont("Times", "IB", fontSize+3)
	pdf.MultiCell(w-2*lw, 15-2*lw, _x.Value, "0", "CT", true)

	//Commission exp.
	pdf.SetXY(_x.X+lw, pdf.GetY()+5)
	pdf.SetFont("Arial", "", fontSize-2)
	pdf.MultiCell(w-2*lw, 15-2*lw, "My Commission Expires\nNovember 18, 2035", "0", "CT", true)
}

//AddNotaryStampWidget adds date field to Editor / PDF
func (_x *Editor) AddNotaryStampWidget(page int, signature string, x, y float64) {
	_x.notaryStampWidgets = append(_x.notaryStampWidgets, NotaryStampWidget{
		Page:  page,
		X:     x,
		Y:     y,
		Value: signature,
	})
}
