package pk

import "testing"

func TestEquals(t *testing.T) {
	cases := []struct {
		l PublicKey
		r PublicKey
		e bool
	}{
		{l: "asd", r: "asd", e: true},
		{l: "asd", r: "ASD", e: true},
		{l: "dsa", r: "ASD", e: false},
	}

	for idx, c := range cases {
		if c.l.Equals(c.r) && c.e != true {
			t.Errorf("Case %v. PKs equal, expected %v", idx, c.e)
		}

		if !c.l.Equals(c.r) && c.e == true {
			t.Errorf("Case %v. PKs are not equal, expected %v", idx, c.e)
		}
	}
}
