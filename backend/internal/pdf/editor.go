package pdf

import (
	"encoding/json"
	"fmt"

	"github.com/go-pdf/fpdf"
	"github.com/go-pdf/fpdf/contrib/gofpdi"
)

//Editor edits PDF document
type Editor struct {
	filePath   string
	pdf        *fpdf.Fpdf
	pageSizes  map[int]map[string]map[string]float64
	templates  []int
	textFields []TextField
	dateFields []DateField
}

//New instantiates Editor with provided original PDF file
func New(filePath string) *Editor {
	pdf := fpdf.New("P", "pt", "A4", "")
	pageSizes := map[int]map[string]map[string]float64{}

	if filePath != "" {
		gofpdi.ImportPage(pdf, filePath, 1, "/MediaBox")
		pageSizes = gofpdi.GetPageSizes()
	}

	editor := &Editor{
		filePath:  filePath,
		pdf:       pdf,
		pageSizes: pageSizes,
		templates: []int{},
	}

	editor.LoadTemplates()

	return editor
}

//LoadTemplates reads pages in the original PDF and loads Editor with them
func (_x *Editor) LoadTemplates() {
	ipagesLen := len(_x.pageSizes)
	for p := 0; p < ipagesLen; p++ {
		if p >= len(_x.templates) {
			_x.templates = append(_x.templates, gofpdi.ImportPage(_x.pdf, _x.filePath, p+1, "/MediaBox"))
		}
	}
}

//loadPage loads single page template
func (_x *Editor) loadPage(p int) {
	mbox := _x.pageSizes[p]["/MediaBox"]
	gofpdi.UseImportedTemplate(_x.pdf, _x.templates[p], mbox["x"], mbox["y"], mbox["w"], mbox["h"])
}

//RenderFields renders all defined fields to PDF
func (_x *Editor) RenderFields() {
	_x.pdf.AddLayer("Widgets", false)

	ps := len(_x.pageSizes)
	for p := 0; p < ps; p++ {
		_x.pdf.AddPage()
		_x.loadPage(p)
		//TextFields
		for _, t := range _x.textFields {
			if t.Page == p {
				t.Render(_x.pdf)
			}
		}

		//DateFields
		for _, t := range _x.dateFields {
			if t.page == p {
				t.Render(_x.pdf)
			}
		}
	}
}

//SaveToFile saves PDF output to file
func (_x *Editor) SaveToFile(filePath string) error {
	return _x.pdf.OutputFileAndClose(filePath)
}

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

		if wt.Type == "text" {
			var w TextField
			err := json.Unmarshal(f, &w)
			if err != nil {
				return fmt.Errorf("widget parsing mapping: %w", err)
			}

			_x.AddTextField(w.Page-1, w.Value, w.X, w.Y, w.W, w.H)
		}
	}

	// fmt.Println("FIELDS: ", fields)

	// for _, f := range fields {
	// 	switch f.FieldType {
	// 	case "text":
	// 		_x.AddTextField(f.Field["page"])
	// 	case "date":
	// 	}
	// }

	// fmt.Println(fields)

	return nil
}
