package main

import (
	"fmt"

	ethcommon "github.com/ethereum/go-ethereum/common"
	"github.com/storyicon/sigverify"
)

func main() {
	accountAddress := "0x352aBe22d01AC782bbe79A042B79964f770B91e2"
	signedMessage := "0x52a94a0a17e8a525e9d0559c1b3611ba48002a8efe8998dbf9d5f742971c571762f825a29103932f02bc4bacf57d75d2f4146df4d24591de877e264b5aed895b1b"
	valid, err := sigverify.VerifyEllipticCurveHexSignatureEx(
		ethcommon.HexToAddress(accountAddress),
		[]byte("hello!"),
		signedMessage,
	)
	fmt.Println(valid, err) // true <nil>
}
