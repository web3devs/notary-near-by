package pdf

import (
	"testing"
)

func TestAddMapping(t *testing.T) {
	simple := `[
  {
    "id": "6ca0f39e-366b-4bd7-b228-21aa4a15e0e3",
    "type": "text",
    "page": 1,
    "value": "Yadda yadda yadda",
    "x": 217,
    "y": 429,
    "w": 250,
    "h": 15
  },
  {
    "id": "ae640527-1cd8-4c7e-8cda-36f3d8d5c6b9",
    "type": "text",
    "page": 4,
    "value": "Yadda yadda yadda",
    "x": 245,
    "y": 514,
    "w": 250,
    "h": 15
  },
  {
    "id": "869e1d87-9f7c-4b9b-ae51-2d9ad0bcbf8a",
    "type": "text",
    "page": 2,
    "value": "Yadda yadda yadda",
    "x": 166,
    "y": 354,
    "w": 250,
    "h": 15
  }
]`
	e := New("")

	err := e.LoadWidgets([]byte(simple))
	if err != nil {
		t.Errorf("unexpected error: %v", err)
	}

	if p := len(e.textFields); p != 3 {
		t.Errorf("Expected # of fields: %v. Provided: %v", 1, p)
	}
}
