package session

//Session combines WebSocket session with notarization ceremony
type Session struct {
	OrderID      string `dynamo:"OrderID" json:"order_id" validate:"required"`
	ConnectionID string `dynamo:"ConnectionID" json:"connection_id" validate:"required"`
	CallbackURL  string `dynamo:"CallbackURL" json:"callback_url" validate:"required"`
}
