package pdf

import (
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
	ps := len(_x.pageSizes)
	for p := 0; p < ps; p++ {
		_x.pdf.AddPage()
		//TextFields
		for _, t := range _x.textFields {
			if t.page == p {
				t.Render(_x.pdf)
			}
		}
		_x.loadPage(p)

		//DateFields
		for _, t := range _x.dateFields {
			if t.page == p {
				t.Render(_x.pdf)
			}
		}
		_x.loadPage(p)
	}
}

//SaveToFile saves PDF output to file
func (_x *Editor) SaveToFile(filePath string) error {
	return _x.pdf.OutputFileAndClose(filePath)
}

func (_x *Editor) AddMapping(j string) error {
	// var fields []Field

	// err := json.Unmarshal([]byte(j), &fields)
	// if err != nil {
	// 	return fmt.Errorf("failed parsing mapping: %w", err)
	// }

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
