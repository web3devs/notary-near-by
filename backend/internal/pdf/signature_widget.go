package pdf

import "github.com/go-pdf/fpdf"

//SignatureValue for custom signature widget value
type SignatureValue struct {
	Label     string `json:"label"`
	PublicKey string `json:"public_key"`
	FullName  string `json:"full_name"`
}

//SignatureWidget representing basic text widget
type SignatureWidget struct {
	ID    string         `json:"id"`
	Page  int            `json:"page"`
	X     float64        `json:"x"`
	Y     float64        `json:"y"`
	W     float64        `json:"w"`
	H     float64        `json:"h"`
	Value SignatureValue `json:"value"`
}

//Render renders the text widget to PDF
func (_x SignatureWidget) Render(pdf *fpdf.Fpdf) {
	fontSize := 14.0
	margin := 0.0
	pdf.SetFont("Arial", "", fontSize)
	pdf.SetXY(_x.X, _x.Y)

	pdf.SetCellMargin(margin)
	pdf.SetTextColor(27, 31, 30)
	pdf.SetFillColor(35, 186, 156)
	pdf.SetLineWidth(0.1)

	pdf.SetDrawColor(189, 11, 255)
	pdf.CellFormat(_x.W, fontSize+2*margin, _x.Value.FullName, "1", 0, "LT", false, 0, "")
}

//AddSignatureWidget adds signature widget to Editor / PDF
func (_x *Editor) AddSignatureWidget(page int, value SignatureValue, x, y, w, h float64) {
	_x.signatureWidgets = append(_x.signatureWidgets, SignatureWidget{
		Page:  page,
		X:     x,
		Y:     y,
		W:     w,
		H:     h,
		Value: value,
	})
}
