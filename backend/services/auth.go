package services

import (
	"bytes"
	"encoding/json"
	"errors"
	"net/http"

	"github.com/micro/go-micro/v2/config"
)

// Auth interface
type Auth interface {
	Get(path string, data interface{}) error
	SyncUp(path string, data interface{}) error
}

// DefaultAuth struct
type DefaultAuth struct {
}

// Get function
func (a DefaultAuth) Get(path string, data interface{}) error {
	host := config.Get("cloud", "host").String("")
	token := config.Get("cloud", "token").String("")
	u := host + path
	req, err := http.NewRequest("GET", u, nil)
	if err != nil {
		return err
	}

	req.Header.Add("Authorization", "Bearer "+token)
	req.Header.Add("Accept", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}
	defer resp.Body.Close()

	if resp.StatusCode == 200 {
		if err := json.NewDecoder(resp.Body).Decode(data); err != nil {
			return err
		}
		return nil
	}

	return errors.New("Handler unsuccessful")
}

// SyncUp function
func (a DefaultAuth) SyncUp(path string, data interface{}) error {
	host := config.Get("cloud", "host").String("")
	token := config.Get("cloud", "token").String("")

	b := new(bytes.Buffer)
	json.NewEncoder(b).Encode(data)

	u := host + path
	req, err := http.NewRequest("POST", u, b)
	if err != nil {
		return err
	}

	req.Header.Add("Authorization", "Bearer "+token)
	req.Header.Set("Content-Type", "application/json")
	req.Header.Add("Accept", "application/json")

	resp, err := http.DefaultClient.Do(req)
	if err != nil {
		return err
	}

	defer resp.Body.Close()

	if resp.StatusCode == 200 {
		return nil
	}

	return errors.New("Handler unsuccessful")
}
