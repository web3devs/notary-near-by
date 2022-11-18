package pdf

import (
	"encoding/json"
	"fmt"
	"io"
	"os"

	"github.com/go-pdf/fpdf"
	"github.com/go-pdf/fpdf/contrib/gofpdi"
)

//Editor edits PDF document
type Editor struct {
	filePath               string
	pdf                    *fpdf.Fpdf
	pageSizes              map[int]map[string]map[string]float64
	templates              []int
	textWidgets            []TextWidget
	dateWidgets            []DateWidget
	signatureWidgets       []SignatureWidget
	notarySignatureWidgets []NotarySignatureWidget
	notaryStampWidgets     []NotaryStampWidget
	rs                     *io.ReadSeeker
	imp                    *gofpdi.Importer
}

//New instantiates Editor with provided original PDF file
func New(filePath string) *Editor {
	var imp *gofpdi.Importer
	var rs io.ReadSeeker
	// pdf := fpdf.New("P", "pt", "Letter", "")
	// pdf := fpdf.New("P", "pt", "Legal", "")
	pdf := fpdf.New("P", "pt", "A4", "")

	pageSizes := map[int]map[string]map[string]float64{}

	if filePath != "" {
		// gofpdi.ImportPage(pdf, filePath, 1, "/MediaBox")
		// pageSizes = gofpdi.GetPageSizes()

		f, err := os.Open(filePath)
		if err != nil {
			return nil
		}
		rs = io.ReadSeeker(f)

		fmt.Println("F: ", f)
		imp = gofpdi.NewImporter()
		imp.ImportPageFromStream(pdf, &rs, 1, "/MediaBox")
		pageSizes = imp.GetPageSizes()

		ps := pageSizes[1]["/MediaBox"]
		fmt.Println("PAGE SIZES: ", ps["w"], ps["h"])

		//Detect page size....stupid FPDF
		pszs := []struct {
			name string
			w    float64
			h    float64
		}{
			{name: "a3", w: 841.89, h: 1190.55},
			{name: "a4", w: 595.28, h: 841.89},
			{name: "a5", w: 420.94, h: 595.28},
			{name: "a6", w: 297.64, h: 420.94},
			{name: "a2", w: 1190.55, h: 1683.78},
			{name: "a1", w: 1683.78, h: 2383.94},
			{name: "letter", w: 612, h: 792},
			{name: "legal", w: 612, h: 1008},
			{name: "tabloid", w: 792, h: 1224},
		}

		for _, psz := range pszs {
			if ps["w"] == psz.w && ps["h"] == psz.h {
				pdf = fpdf.New("P", "pt", psz.name, "")
				break
			}
		}
	}

	fmt.Println(pdf.PageSize(1))

	pdf.SetAutoPageBreak(false, 0)

	editor := &Editor{
		filePath:  filePath,
		pdf:       pdf,
		pageSizes: pageSizes,
		templates: []int{},
		rs:        &rs,
		imp:       imp,
	}

	editor.LoadTemplates()

	return editor
}

//LoadTemplates reads pages in the original PDF and loads Editor with them
func (_x *Editor) LoadTemplates() {
	ipagesLen := len(_x.pageSizes)
	for p := 0; p < ipagesLen; p++ {
		if p >= len(_x.templates) {
			// _x.templates = append(_x.templates, gofpdi.ImportPage(_x.pdf, _x.filePath, p+1, "/MediaBox"))
			_x.templates = append(_x.templates, _x.imp.ImportPageFromStream(_x.pdf, _x.rs, p+1, "/MediaBox"))
		}
	}
}

//loadPage loads single page template
func (_x *Editor) loadPage(p int) {
	mbox := _x.pageSizes[p]["/MediaBox"]
	// gofpdi.UseImportedTemplate(_x.pdf, _x.templates[p], mbox["x"], mbox["y"], mbox["w"], mbox["h"])
	_x.imp.UseImportedTemplate(_x.pdf, _x.templates[p], mbox["x"], mbox["y"], mbox["w"], mbox["h"])
}

//RenderWidgets renders all defined widgets to PDF
func (_x *Editor) RenderWidgets() {
	_x.pdf.AddLayer("Widgets", false)

	ps := len(_x.pageSizes)
	for p := 0; p < ps; p++ {
		_x.pdf.AddPage()
		_x.loadPage(p)
		//Text
		for _, t := range _x.textWidgets {
			if t.Page == p {
				t.Render(_x.pdf)
			}
		}

		//Date
		for _, t := range _x.dateWidgets {
			if t.Page == p {
				t.Render(_x.pdf)
			}
		}

		//Signatures
		for _, t := range _x.signatureWidgets {
			if t.Page == p {
				t.Render(_x.pdf)
			}
		}

		//Notary signatures
		for _, t := range _x.notarySignatureWidgets {
			if t.Page == p {
				t.Render(_x.pdf)
			}
		}

		//Notary stamps
		for _, t := range _x.notaryStampWidgets {
			if t.Page == p {
				t.Render(_x.pdf)
			}
		}
	}
}

//SaveToFile saves PDF output to file
func (_x *Editor) SaveToFile(filePath string) error {
	return _x.pdf.OutputFileAndClose(filePath)
}

//LoadWidgets loads widgets from JSON input
func (_x *Editor) LoadWidgets(j []byte) error {
	var widgets []json.RawMessage
	err := json.Unmarshal(j, &widgets)
	if err != nil {
		return fmt.Errorf("widget parsing mapping: %w", err)
	}

	for _, f := range widgets {
		var wt struct {
			Type string `json:"type"`
		}
		err := json.Unmarshal(f, &wt)
		if err != nil {
			return fmt.Errorf("widget parsing mapping: %w", err)
		}

		switch wt.Type {
		case "text":
			var w TextWidget
			err := json.Unmarshal(f, &w)
			if err != nil {
				return fmt.Errorf("widget parsing mapping: %w", err)
			}

			_x.AddTextWidget(w.Page-1, w.Value, w.X, w.Y, w.W, w.H)
		case "date":
			var w DateWidget
			err := json.Unmarshal(f, &w)
			if err != nil {
				return fmt.Errorf("widget parsing mapping: %w", err)
			}

			_x.AddDateWidget(w.Page-1, w.Value, w.X, w.Y, w.W, w.H)
		case "signature":
			var w SignatureWidget
			err := json.Unmarshal(f, &w)
			if err != nil {
				return fmt.Errorf("widget parsing mapping: %w", err)
			}

			_x.AddSignatureWidget(w.Page-1, w.Value, w.X, w.Y, w.W, w.H)
		case "notary-signature":
			var w NotarySignatureWidget
			err := json.Unmarshal(f, &w)
			if err != nil {
				return fmt.Errorf("widget parsing mapping: %w", err)
			}

			_x.AddNotarySignatureWidget(w.Page-1, w.Value, w.X, w.Y)
		case "notary-stamp":
			var w NotaryStampWidget
			err := json.Unmarshal(f, &w)
			if err != nil {
				return fmt.Errorf("widget parsing mapping: %w", err)
			}

			_x.AddNotaryStampWidget(w.Page-1, w.Value, w.X, w.Y)
		}
	}

	return nil
}
