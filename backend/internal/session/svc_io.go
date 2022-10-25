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

//DispatchActionInput input for dispatching actions
type DispatchActionInput struct {
	ConnectionID string `json:"connection_id"`
	CallbackURL  string `json:"callback_url"`
	Action       Action `json:"action"`
}

//DispatchActionOutput for action dispatching results
type DispatchActionOutput struct {
	ConnectionID string
	CallbackURL  string
}
