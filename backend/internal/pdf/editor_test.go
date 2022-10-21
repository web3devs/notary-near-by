package pdf

import (
	"testing"
)

func TestAddMapping(t *testing.T) {
	simple := `[{"type": "text", "field": {"page":1, "value": "John Smith", "x": 0, "y": 0, "w": 100, "h": 20}}]`
	e := New("")

	err := e.AddMapping(simple)
	if err != nil {
		t.Errorf("unexpected error: %v", err)
	}

	if p := len(e.textFields); p != 1 {
		t.Errorf("Expected # of fields: %v. Provided: %v", 1, p)
	}
}
