package collection

// Collection interface
type Collection interface {
	Init(...Option) error
	Options() Options
	OptionsPointer() *Options
}

// Init function
func Init(coll Collection, opts ...Option) (err error) {
	for _, o := range opts {
		o(coll.OptionsPointer())
	}

	return
}
