package bucket

import (
	"fmt"
	"io"
	"io/ioutil"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
	"github.com/aws/aws-sdk-go/service/s3/s3manager"
)

//Service for managing buckets and files
type Service struct {
	bucket   string
	s3c      *s3.S3
	uploader *s3manager.Uploader
}

//New creates bucket service instance
func New(bucket string, sess *session.Session) (*Service, error) {
	s3c := s3.New(sess)
	if s3c == nil {
		return nil, fmt.Errorf("failed creating S3 client instance")
	}

	uploader := s3manager.NewUploader(sess)
	if uploader == nil {
		return nil, fmt.Errorf("failed creating S3 Uploader instance")
	}

	return &Service{
		bucket:   bucket,
		s3c:      s3c,
		uploader: uploader,
	}, nil
}

//GetUploadURL creates upload URL for the file
func (_x *Service) GetUploadURL(fileName string) (string, error) {
	req, _ := _x.s3c.PutObjectRequest(&s3.PutObjectInput{
		Bucket: aws.String(_x.bucket),
		Key:    aws.String(fileName),
		ACL:    aws.String("private"),
	})
	url, err := req.Presign(15 * time.Minute)
	if err != nil {
		return "", err
	}

	return url, nil
}

//GetDownloadURL returns download URL
func (_x *Service) GetDownloadURL(fileName string) (string, error) {
	req, _ := _x.s3c.GetObjectRequest(&s3.GetObjectInput{
		Bucket: aws.String(_x.bucket),
		Key:    aws.String(fileName),
	})
	urlStr, err := req.Presign(60 * time.Minute)
	if err != nil {
		return "", err
	}

	return urlStr, nil
}

//Upload uploads file to S3 or returns error
func (_x *Service) Upload(fileName string, data io.ReadCloser) error {
	if _, err := _x.uploader.Upload(&s3manager.UploadInput{
		Bucket: aws.String(_x.bucket),
		Key:    aws.String(fileName),
		Body:   data,
	}); err != nil {
		return fmt.Errorf("failed to upload file, %w", err)
	}

	return nil
}

//Download downloads file from S3
func (_x *Service) Download(fileName string) ([]byte, error) {
	req, resp := _x.s3c.GetObjectRequest(&s3.GetObjectInput{
		Bucket: aws.String(_x.bucket),
		Key:    aws.String(fileName),
	})
	if err := req.Send(); err != nil {
		return nil, fmt.Errorf("failed obtaining io.ReadCloser for a file: %w", err)
	}

	bytes, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		return nil, fmt.Errorf("failed reading bytes from io.ReadCloser: %w", err)
	}

	return bytes, nil
}
