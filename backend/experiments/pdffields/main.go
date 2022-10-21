package main

import (
	"fmt"
	"time"

	_editor "notarynearby/internal/pdf"
)

// const j = `
// [
// 	{"type": "text", "field": {"page":1, "value": "John Smith", "x": 0, "y": 0, "w": 100, "h": 20}),
// 	{"type": "date", "page":1, "value": "2020-10-12T20:21:22", "x": 0, "y": 0, "w": 100, "h": 20}
// ]
// `

func main() {
	fmt.Println("Applying fields to PDF file")

	e := _editor.New("paper-privacy-enabled-nfts.pdf")

	e.AddTextField(0, "Zoltan Chivay page 1 text 1", 0, 0, 100, 20)
	e.AddTextField(0, "Zoltan Chivay page 1 text 2", 0, 20, 100, 20)

	e.AddTextField(1, "Zoltan Chivay page 2", 0, 20, 100, 20)

	e.AddTextField(0, "Zoltan Chivay page 1 text 3", 0, 40, 100, 20)

	e.AddDateField(0, time.Now().AddDate(1, -2, 0), 0, 100, 150, 20)

	e.AddDateField(0, time.Now().AddDate(1, -2, 0), 250, 250, 150, 20)

	e.RenderFields()

	e.SaveToFile("bazinga.pdf")

	fmt.Println("E: ", e)

	fmt.Println("Done")
}
