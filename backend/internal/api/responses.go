package api

import (
	"encoding/json"

	"github.com/aws/aws-lambda-go/events"
)

//WrapError wraps provided error into error-ish response
func WrapError(err error) string {
	return "{\"error\":\"" + err.Error() + "\"}"
}

//Response produces API GW response with all required headers
func Response(code int, body string) events.APIGatewayProxyResponse {
	return events.APIGatewayProxyResponse{
		StatusCode: code,
		Headers: map[string]string{
			"Accept":                           "*/*",
			"Content-Type":                     "application/json",
			"Access-Control-Allow-Origin":      "*",
			"Access-Control-Allow-Credentials": "true",
		},
		IsBase64Encoded: false,
		Body:            body,
	}
}

//ResponseOK for HTTP 200
func ResponseOK(data interface{}) events.APIGatewayProxyResponse {
	body := ""
	if data != nil {
		djs, err := json.Marshal(data)
		if err != nil {
			return Response(500, WrapError(err))
		}

		body = string(djs)
	}

	return Response(200, body)
}

//ResponseError for HTTP 500
func ResponseError(err error) events.APIGatewayProxyResponse {
	return Response(500, WrapError(err))
}
