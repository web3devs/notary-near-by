package db

import (
	"fmt"

	"github.com/aws/aws-sdk-go/aws/session"
	"github.com/aws/aws-sdk-go/service/dynamodb"
	"github.com/guregu/dynamo"
)

//Service provides DynamoDB guregu client (DB) and native AWS service (Service)
type Service struct {
	Service   *dynamodb.DynamoDB
	DB        *dynamo.DB
	TableName string
}

//New creates new Service
func New(sess *session.Session, databaseTablePrefix, tableName string) *Service {
	a := &Service{}
	a.TableName = fmt.Sprintf("%v-%v", databaseTablePrefix, tableName)
	a.Service = dynamodb.New(sess)
	a.DB = dynamo.New(sess)

	return a
}
