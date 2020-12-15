package cache

import (
	"sync"
)

type Cache struct {
	memStorage map[string]interface{}
	sync.RWMutex
}

var CacheStore *Cache

func init() {
	CacheStore = NewCache()
}

func NewCache() *Cache {
	return &Cache{memStorage: make(map[string]interface{}, 0)}
}

func (c *Cache) Put(key string, value interface{}) {
	c.Lock()
	defer c.Unlock()
	c.memStorage[key] = value
}

func (c *Cache) Get(key string) (interface{}, bool) {
	c.Lock()
	defer c.Unlock()

	value, ok := c.memStorage[key]
	return value, ok
}

func (c *Cache) Delete(key string) {
	c.Lock()
	defer c.Unlock()

	delete(c.memStorage, key)

}