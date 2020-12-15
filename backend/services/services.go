package services

// NewAuth function
func NewAuth() Auth {
	return DefaultAuth{}
}

// NewCommand function
func NewCommand() Command {
	return LinuxCommand{}
}

// NewImage function
func NewImage() Image {
	return DefaultImage{}
}

// NewJSON function
func NewJSON() JSON {
	return DefaultJSON{}
}

// NewResponse function
func NewResponse() Response {
	return DefaultResponse{}
}
