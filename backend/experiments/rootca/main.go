package main

import (
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/pem"
	"fmt"
	"io/ioutil"
	"math/big"
	"os"
	"time"

	"software.sslmate.com/src/go-pkcs12"
)

func genCert(template, parent *x509.Certificate, publicKey *rsa.PublicKey, privateKey *rsa.PrivateKey) (*x509.Certificate, []byte) {
	certBytes, err := x509.CreateCertificate(rand.Reader, template, parent, publicKey, privateKey)
	if err != nil {
		panic("Failed to create certificate:" + err.Error())
	}

	cert, err := x509.ParseCertificate(certBytes)
	if err != nil {
		panic("Failed to parse certificate:" + err.Error())
	}

	b := pem.Block{Type: "CERTIFICATE", Bytes: certBytes}
	certPEM := pem.EncodeToMemory(&b)

	return cert, certPEM
}

func GenCARoot() (*x509.Certificate, []byte, *rsa.PrivateKey) {
	if _, err := os.Stat("someFile"); err == nil {
		//read PEM and cert from file
	}
	var rootTemplate = x509.Certificate{
		SerialNumber: big.NewInt(1),
		Subject: pkix.Name{
			Country:            []string{"US"},
			Organization:       []string{"Web3devs Funny Notary Certs Co."},
			OrganizationalUnit: []string{"Legal"},
			Locality:           []string{"Archer"},
			Province:           []string{"Florida"},
			StreetAddress:      []string{"Sesame Streeet 123"},
			PostalCode:         []string{"12345"},
			CommonName:         "Root CA",
		},
		NotBefore:             time.Now().Add(-10 * time.Second),
		NotAfter:              time.Now().AddDate(10, 0, 0),
		KeyUsage:              x509.KeyUsageCertSign | x509.KeyUsageCRLSign,
		ExtKeyUsage:           []x509.ExtKeyUsage{x509.ExtKeyUsageServerAuth},
		BasicConstraintsValid: true,
		IsCA:                  true,
		MaxPathLen:            2,
		// IPAddresses:           []net.IP{net.ParseIP("127.0.0.1")},
	}
	priv, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		panic(err)
	}
	rootCert, rootPEM := genCert(&rootTemplate, &rootTemplate, &priv.PublicKey, priv)
	return rootCert, rootPEM, priv
}

func GenDCA(RootCert *x509.Certificate, RootKey *rsa.PrivateKey) (*x509.Certificate, []byte, *rsa.PrivateKey) {
	priv, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		panic(err)
	}

	var DCATemplate = x509.Certificate{
		SerialNumber: big.NewInt(1),
		Subject: pkix.Name{
			Country:            []string{"US"},
			Organization:       []string{"Web3devs Funny Notary Certs Co."},
			OrganizationalUnit: []string{"Legal"},
			Locality:           []string{"Archer"},
			Province:           []string{"Florida"},
			StreetAddress:      []string{"Sesame Streeet 123"},
			PostalCode:         []string{"12345"},
			CommonName:         "DCA",
		},
		NotBefore:             time.Now().Add(-10 * time.Second),
		NotAfter:              time.Now().AddDate(10, 0, 0),
		KeyUsage:              x509.KeyUsageCertSign | x509.KeyUsageCRLSign,
		ExtKeyUsage:           []x509.ExtKeyUsage{x509.ExtKeyUsageServerAuth},
		BasicConstraintsValid: true,
		IsCA:                  true,
		MaxPathLenZero:        false,
		MaxPathLen:            1,
		// IPAddresses:           []net.IP{net.ParseIP("127.0.0.1")},
	}
	DCACert, DCAPEM := genCert(&DCATemplate, RootCert, &priv.PublicKey, RootKey)
	return DCACert, DCAPEM, priv
}

func GenServerCert(DCACert *x509.Certificate, DCAKey *rsa.PrivateKey) (*x509.Certificate, []byte, *rsa.PrivateKey) {
	priv, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		panic(err)
	}

	// var ServerTemplate = x509.Certificate{
	// 	SerialNumber:   big.NewInt(1),
	// 	NotBefore:      time.Now().Add(-10 * time.Second),
	// 	NotAfter:       time.Now().AddDate(10, 0, 0),
	// 	KeyUsage:       x509.KeyUsageCRLSign,
	// 	ExtKeyUsage:    []x509.ExtKeyUsage{x509.ExtKeyUsageServerAuth},
	// 	IsCA:           false,
	// 	MaxPathLenZero: true,
	// 	// IPAddresses:    []net.IP{net.ParseIP("127.0.0.1")},
	// }

	ServerTemplate := &x509.Certificate{
		SerialNumber: big.NewInt(1),
		Subject: pkix.Name{
			Country:            []string{"EN"},
			Organization:       []string{"Funny Notary Inc."},
			OrganizationalUnit: []string{"Legal"},
			Locality:           []string{"Under"},
			Province:           []string{"Rock"},
			StreetAddress:      []string{"Sesame Streeet 123"},
			PostalCode:         []string{"12345"},
			CommonName:         "Dale2 Ruffer",
		},
		IsCA:           false,
		MaxPathLenZero: true,
		NotBefore:      time.Now().AddDate(-1, 0, 0),
		NotAfter:       time.Now().AddDate(1, 0, 0),
		KeyUsage:       x509.KeyUsageDigitalSignature,
	}

	ServerCert, ServerPEM := genCert(ServerTemplate, DCACert, &priv.PublicKey, DCAKey)
	return ServerCert, ServerPEM, priv

}

func GenZoltan(DCACert *x509.Certificate, DCAKey *rsa.PrivateKey) (*x509.Certificate, []byte, *rsa.PrivateKey) {
	priv, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		panic(err)
	}

	ServerTemplate := &x509.Certificate{
		SerialNumber: big.NewInt(1),
		Subject: pkix.Name{
			Country:            []string{"EN"},
			Organization:       []string{"Funny Notary Inc."},
			OrganizationalUnit: []string{"Legal"},
			Locality:           []string{"Under"},
			Province:           []string{"Rock"},
			StreetAddress:      []string{"Sesame Streeet 123"},
			PostalCode:         []string{"12345"},
			CommonName:         "ZOLTAN",
		},
		IsCA:           false,
		MaxPathLenZero: true,
		NotBefore:      time.Now().AddDate(-1, 0, 0),
		NotAfter:       time.Now().AddDate(1, 0, 0),
		KeyUsage:       x509.KeyUsageDigitalSignature,
	}

	ServerCert, ServerPEM := genCert(ServerTemplate, DCACert, &priv.PublicKey, DCAKey)
	return ServerCert, ServerPEM, priv

}

func main() {
	rootCert, _, rootKey := GenCARoot()
	DCACert, _, DCAKey := GenDCA(rootCert, rootKey)
	ServerCert, _, ServerPrivKey := GenServerCert(DCACert, DCAKey)
	ZoltanCert, _, ZoltanPrivKey := GenZoltan(ServerCert, ServerPrivKey)
	// zoltanpkpem := pem.EncodeToMemory(
	// 	&pem.Block{
	// 		Type:  "RSA PRIVATE KEY",
	// 		Bytes: x509.MarshalPKCS1PrivateKey(ZoltanPrivKey),
	// 	},
	// )
	// fmt.Println("PRIV\n", string(zoltanpkpem))

	//Convert x509 to PFX
	pfxBytes, err := pkcs12.Encode(rand.Reader, ZoltanPrivKey, ZoltanCert, []*x509.Certificate{
		rootCert,
		DCACert,
		ServerCert,
	}, "")
	if err != nil {
		fmt.Println("Error: failed converting x509 to PFX: %w", err)
		return
	}

	//Save to file
	if err := ioutil.WriteFile(
		"zoltan.pfx",
		pfxBytes,
		os.ModePerm,
	); err != nil {
		fmt.Println("Error: failed saving PFX file: %w", err)
		return
	}
}

func verifyDCA(root, dca *x509.Certificate) {
	roots := x509.NewCertPool()
	roots.AddCert(root)
	opts := x509.VerifyOptions{
		Roots: roots,
	}

	if _, err := dca.Verify(opts); err != nil {
		panic("failed to verify certificate: " + err.Error())
	}
	fmt.Println("DCA verified")
}

func verifyLow(root, DCA, child *x509.Certificate) {
	roots := x509.NewCertPool()
	inter := x509.NewCertPool()
	roots.AddCert(root)
	inter.AddCert(DCA)
	opts := x509.VerifyOptions{
		Roots:         roots,
		Intermediates: inter,
	}

	if _, err := child.Verify(opts); err != nil {
		panic("failed to verify certificate: " + err.Error())
	}
	fmt.Println("Low Verified")
}
