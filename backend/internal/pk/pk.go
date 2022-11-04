package pk

import "strings"

//PublicKey is just a type that makes sure we use PublicKey instead of "just a string"
//MAYBE we'll add some sort of validation here? Maybe? If this turns out to be "a real project" :D
type PublicKey string

//String interface because PK is sometimes in various capitals :facepalm:
func (x PublicKey) String() string {
	return strings.ToLower(string(x))
}

//Signature is a PublicKey signed with associated PrivateKey
type Signature string
