package bucket

import (
	"fmt"
	"time"

	"github.com/aws/aws-sdk-go/aws"
	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/s3"
)

//Service for managing buckets and files
type Service struct {
	bucket string
	s3c    *s3.S3
}

//New creates bucket service instance
func New(bucket string, sess *session.Session) (*Service, error) {
	s3c := s3.New(sess)
	if s3c == nil {
		return nil, fmt.Errorf("Failed creating S3 client instance")
	}

	return &Service{
		bucket: bucket,
		s3c:    s3c,
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
