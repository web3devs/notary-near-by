package session

//ConnectInput input for session Connect
type ConnectInput struct {
	ConnectionID string
	CallbackURL  string
}

//ConnectOutput result of Connect
type ConnectOutput struct {
	ConnectionID string
	CallbackURL  string
}
