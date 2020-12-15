package collection

// DefaultCollection struct
type DefaultCollection struct {
	opts Options
}

// NewCollection function
func NewCollection(opts ...Option) Collection {
	var dc DefaultCollection
	dc.Init(opts...)

	return &dc
}

// Init function
func (d *DefaultCollection) Init(opts ...Option) (err error) {
	err = Init(d, opts...)

	return
}

// Options function
func (d *DefaultCollection) Options() Options {
	return d.opts
}

// OptionsPointer function
func (d *DefaultCollection) OptionsPointer() *Options {
	return &d.opts
}
