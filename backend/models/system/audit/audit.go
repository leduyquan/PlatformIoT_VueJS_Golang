package models

import (
	"strconv"
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"github.com/micro/go-micro/v2/logger"

	"gitlab.com/brazncorp/util/config/database"
	"gitlab.com/brazncorp/util/pagination"
	"gitlab.com/brazncorp/util/zero"
	msetting "gitlab.com/brazncorp/web-ui/models/system/setting"
)

type UserAudit struct {
	ID     string `json:"id" bson:"id,omitempty"`
	Email  string `json:"email" bson:"email,omitempty"`
	Name   string `json:"name" bson:"name,omitempty"`
	Status string `json:"status" bson:"status,omitempty"`
}

type Audit struct {
	ID          primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	AgentId     string             `json:"agent_id,omitempty" bson:"agent_id,omitempty"`
	AgentName   string             `json:"agent_name,omitempty" bson:"agent_name,omitempty"`
	User        UserAudit          `json:"user" bson:"user"`
	Description string             `json:"description" bson:"description"`
	CreatedAt   time.Time          `json:"created_at,omitempty" bson:"created_at,omitempty"`
	UpdatedAt   time.Time          `json:"updated_at,omitempty" bson:"updated_at,omitempty"`
}

func (s *Audit) Get(res map[string]interface{}) (interface{}, error) {
	logs := []Audit{}
	opt := s.getFilter(res)
	collection := database.Connection.Database(database.Config.Database).Collection("audit_logs")
	paginatedData, err := pagination.New(collection).Limit(opt["size"].(int64)).Page(opt["page"].(int64)).Sort("created_at", -1).Filter(opt["filter"]).Find(&logs)
	if err != nil {
		return nil, err
	}

	return paginatedData, nil
}

func (s *Audit) Save() error {
	var m msetting.Agent
	_ = database.Connection.FindOne("agents", nil, &m)

	if !m.ID.IsZero() {
		s.AgentName = m.Name
		s.AgentId = m.ID.Hex()
	}

	s.defineUser()
	_, err := database.Connection.Create("audit_logs", s)

	return err
}

func (s *Audit) defineUser() {
	if zero.IsZero(s.User) {
		s.User.ID = "SYSTEM_USER"
		s.User.Name = "SYSTEM_USER"
		s.User.Email = "SYSTEM_USER"
		s.User.Status = "Active"
	}
}

func (s *Audit) getFilter(fltr map[string]interface{}) map[string]interface{} {
	page, _ := strconv.ParseInt(fltr["page"].(string), 10, 64)
	size, _ := strconv.ParseInt(fltr["size"].(string), 10, 64)
	setElements := bson.D{}
	if fltr["keyword"] != `""` {
		setElements = append(setElements, bson.E{Key: "$or", Value: []bson.M{
			{"description": bson.D{{"$regex", fltr["keyword"]}, {"$options", "i"}}},
			{"user.name": bson.D{{"$regex", fltr["keyword"]}, {"$options", "i"}}},
			{"user.email": bson.D{{"$regex", fltr["keyword"]}, {"$options", "i"}}},
		}})
	}

	var data = map[string]interface{}{
		"page":   page,
		"size":   size,
		"filter": setElements,
	}
	logger.Info(data)
	return data
}
