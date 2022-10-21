package main

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"crypto/x509/pkix"
	"fmt"
	"io/ioutil"
	"math/big"
	"os"
	"time"

	"software.sslmate.com/src/go-pkcs12"
)

func main() {
	fmt.Println("Generate P12 cert for signing")

	//Generate RSA Private Key
	rsaPrivKey, err := rsa.GenerateKey(rand.Reader, 1024)
	if err != nil {
		fmt.Println("Error: failed generating Private Key: %w", err)
		return
	}
	if err := rsaPrivKey.Validate(); err != nil {
		fmt.Println("Error: private Key not valid: %w", err)
		return
	}

	//Create CSR (signing request)
	csr := &x509.Certificate{
		SerialNumber: big.NewInt(1),
		Subject: pkix.Name{
			Country:            []string{"EN"},
			Organization:       []string{"Funny Notary Inc."},
			OrganizationalUnit: []string{"Legal"},
			Locality:           []string{"Archer"},
			Province:           []string{"Florida"},
			CommonName:         "Dale Ruffer",
		},
		NotBefore: time.Now().AddDate(-1, 0, 0),
		NotAfter:  time.Now().AddDate(1, 0, 0),
		KeyUsage:  x509.KeyUsageDigitalSignature,
	}

	//Create x509 cert from CSR and private key
	certDer, err := x509.CreateCertificate(rand.Reader, csr, csr, &rsaPrivKey.PublicKey, rsaPrivKey)
	if err != nil {
		fmt.Println("Error: failed creating x509 certificate: %w", err)
		return
	}
	cert, err := x509.ParseCertificate(certDer)
	if err != nil {
		fmt.Println("Error: failed converting x509 der to *x509.Certificate: %w", err)
		return
	}

	//Convert x509 to PFX
	pfxBytes, err := pkcs12.Encode(rand.Reader, rsaPrivKey, cert, []*x509.Certificate{}, "")
	if err != nil {
		fmt.Println("Error: failed converting x509 to PFX: %w", err)
		return
	}

	//Save to file
	if err := ioutil.WriteFile(
		"certificate.pfx",
		pfxBytes,
		os.ModePerm,
	); err != nil {
		fmt.Println("Error: failed saving PFX file: %w", err)
		return
	}

	fmt.Println("Done")
}
