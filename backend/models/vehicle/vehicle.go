package vehicle

// Vehicle interface
type Vehicle interface {
	Init(...Option) error
	Options() Options
	OptionsPointer() *Options
	MarshalJSON() ([]byte, error)
	UnmarshalJSON([]byte) error
	FromRequest(interface{})
	Write() error
	List(LpFilter) (interface{}, error)
}

// Init function
func Init(veh Vehicle, opts ...Option) (err error) {
	options := veh.OptionsPointer()
	options.Item = veh
	for _, o := range opts {
		o(options)
	}

	return
}
