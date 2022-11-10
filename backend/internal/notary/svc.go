package notary

import (
	"bytes"
	"crypto/rand"
	"crypto/rsa"
	"crypto/x509"
	"crypto/x509/pkix"
	"encoding/pem"
	"fmt"
	"io/ioutil"
	"math/big"
	"notarynearby/internal/db"
	"os"
	"time"

	_bucket "notarynearby/internal/bucket"

	"github.com/aws/aws-sdk-go/aws/session"
	"software.sslmate.com/src/go-pkcs12"
)

//Service is the all in one entrypoint for managing Notaries
type Service struct {
	sess    *session.Session
	Reader  *Reader
	Writer  *Writer
	bucket  *_bucket.Service
	rootPFX []byte
	dcaPFX  []byte
}

//New instantiates Service
func New(sess *session.Session) (*Service, error) {
	svc := db.New(sess, fmt.Sprintf("%v-%v", os.Getenv("PROJECT_NAME"), os.Getenv("STAGE")), "notaries")

	r, err := NewReader(svc)
	if err != nil {
		return nil, fmt.Errorf("failed initiating Reader: %w", err)
	}

	w, err := NewWriter(svc)
	if err != nil {
		return nil, fmt.Errorf("failed initiating Writer: %w", err)
	}

	bucket, err := _bucket.New(os.Getenv("S3_NOTARIES"), sess)
	if err != nil {
		return nil, fmt.Errorf("failed initiating Bucket: %w", err)
	}

	s := &Service{
		sess:   sess,
		Reader: r,
		Writer: w,
		bucket: bucket,
	}

	if err := s.lazyGenerateRootCerts(); err != nil {
		return nil, fmt.Errorf("failed generating Root Certificates for notaries: %w", err)
	}

	return s, nil
}

func (_x *Service) genCert(template, parent *x509.Certificate, publicKey *rsa.PublicKey, privateKey *rsa.PrivateKey) (*x509.Certificate, []byte) {
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

func (_x *Service) genCARoot() (*x509.Certificate, []byte, *rsa.PrivateKey) {
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
	rootCert, rootPEM := _x.genCert(&rootTemplate, &rootTemplate, &priv.PublicKey, priv)
	return rootCert, rootPEM, priv
}

func (_x *Service) genDCA(RootCert *x509.Certificate, RootKey *rsa.PrivateKey) (*x509.Certificate, []byte, *rsa.PrivateKey) {
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
	DCACert, DCAPEM := _x.genCert(&DCATemplate, RootCert, &priv.PublicKey, RootKey)
	return DCACert, DCAPEM, priv
}

func (_x *Service) getNotaryCert(n *Notary, DCACert *x509.Certificate, DCAKey *rsa.PrivateKey) (*x509.Certificate, []byte, *rsa.PrivateKey) {
	priv, err := rsa.GenerateKey(rand.Reader, 2048)
	if err != nil {
		panic(err)
	}

	ServerTemplate := &x509.Certificate{
		SerialNumber: big.NewInt(1),
		Subject: pkix.Name{
			Country:            []string{"EN"},
			Organization:       []string{fmt.Sprintf("Notary %v %v", n.FirstName, n.LastName)},
			OrganizationalUnit: []string{"Legal"},
			Locality:           []string{"Under"},
			Province:           []string{"Rock"},
			StreetAddress:      []string{"Sesame Streeet 123"},
			PostalCode:         []string{"12345"},
			CommonName:         fmt.Sprintf("%v %v", n.FirstName, n.LastName),
		},
		IsCA:           false,
		MaxPathLenZero: true,
		NotBefore:      time.Now().AddDate(-1, 0, 0),
		NotAfter:       time.Now().AddDate(1, 0, 0),
		KeyUsage:       x509.KeyUsageDigitalSignature,
	}

	cert, pem := _x.genCert(ServerTemplate, DCACert, &priv.PublicKey, DCAKey)
	return cert, pem, priv
}

func (_x *Service) lazyGenerateRootCerts() error {
	var root []byte
	var dca []byte
	root, rooterr := _x.bucket.Download("root.pfx")
	dca, dcaerr := _x.bucket.Download("dca.pfx")
	if rooterr != nil || dcaerr != nil {
		//root
		rootCert, _, rootKey := _x.genCARoot()
		rootPfx, err := pkcs12.Encode(rand.Reader, rootKey, rootCert, []*x509.Certificate{}, "")
		if err != nil {
			return fmt.Errorf("failed creating root.pfx: %w", err)
		}

		//dca
		dcaCert, _, dcaKey := _x.genDCA(rootCert, rootKey)
		dcaPfx, err := pkcs12.Encode(rand.Reader, dcaKey, dcaCert, []*x509.Certificate{}, "")
		if err != nil {
			return fmt.Errorf("failed creating dca.pfx: %w", err)
		}

		if err := _x.bucket.Upload("root.pfx", ioutil.NopCloser(bytes.NewReader(rootPfx))); err != nil {
			return fmt.Errorf("failed uploading root.pfx to S3: %w", err)
		}
		if err := _x.bucket.Upload("dca.pfx", ioutil.NopCloser(bytes.NewReader(dcaPfx))); err != nil {
			return fmt.Errorf("failed uploading dca.pfx to S3: %w", err)
		}

		root = rootPfx
		dca = dcaPfx
	}

	if len(root) == 0 || len(dca) == 0 {
		return fmt.Errorf("failed obtaining and generating root/dca PFX files")
	}

	return nil
}

//Create creates Notaries
func (_x *Service) Create(_in *CreateInput) (*CreateOutput, error) {
	s := &Notary{
		PublicKey: _in.PublicKey,
		FirstName: _in.FirstName,
		LastName:  _in.LastName,
	}
	//TODO: Validate PublicKey and Signature
	if err := _x.Writer.Create(s); err != nil {
		return nil, fmt.Errorf("failed saving Session in DB: %w", err)
	}

	root, err := _x.bucket.Download("root.pfx")
	if err != nil {
		return nil, fmt.Errorf("failed fetching root.pfx: %w", err)
	}
	dca, err := _x.bucket.Download("dca.pfx")
	if err != nil {
		return nil, fmt.Errorf("failed fetching dca.pfx: %w", err)
	}

	_, rootCert, err := pkcs12.Decode(root, "")
	if err != nil {
		return nil, fmt.Errorf("failed decoding root.pfx: %w", err)
	}

	dcaPriv, dcaCert, err := pkcs12.Decode(dca, "")
	if err != nil {
		return nil, fmt.Errorf("failed decoding dca.pfx: %w", err)
	}
	dcaRsa := dcaPriv.(*rsa.PrivateKey)

	cert, _, priv := _x.getNotaryCert(s, dcaCert, dcaRsa)

	notaryPfx, err := pkcs12.Encode(rand.Reader, priv, cert, []*x509.Certificate{
		rootCert,
		dcaCert,
	}, "")
	if err != nil {
		return nil, fmt.Errorf("failed creating notary.pfx: %w", err)
	}

	if err := _x.bucket.Upload(s.GetCertificatePath(), ioutil.NopCloser(bytes.NewReader(notaryPfx))); err != nil {
		return nil, fmt.Errorf("failed uploading notary.pfx to S3: %w", err)
	}

	return &CreateOutput{
		Notary: s,
	}, nil
}

//GetOne returns a Notary
func (_x *Service) GetOne(_in *GetOneInput) (*GetOneOutput, error) {
	n, err := _x.Reader.GetOne(_in.PublicKey)
	if err != nil {
		return nil, fmt.Errorf("failed fetching Notary: %w", err)
	}

	return &GetOneOutput{
		Notary: &n,
	}, nil
}

//GetPFX returns a Notary's PFX file
func (_x *Service) GetPFX(_in *GetPFXInput) (*GetPFXOutput, error) {
	n, err := _x.Reader.GetOne(_in.PublicKey)
	if err != nil {
		return nil, fmt.Errorf("failed fetching Notary: %w", err)
	}

	pfx, err := _x.bucket.Download(n.GetCertificatePath())
	if err != nil {
		return nil, fmt.Errorf("failed downloading PFX file: %w", err)
	}

	return &GetPFXOutput{
		Notary: &n,
		PFX:    pfx,
	}, nil
}
