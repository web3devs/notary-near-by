package session

//Session combines WebSocket session with notarization ceremony
type Session struct {
	SessionID    string `dynamo:"SessionID" json:"session_id" validate:"required"`
	ConnectionID string `dynamo:"ConnectionID" json:"connection_id" validate:"required"`
	CallbackURL  string `dynamo:"CallbackURL" json:"callback_url" validate:"required"`
}
