package account

import (
	"time"

	log "github.com/micro/go-micro/v2/logger"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"gitlab.com/brazncorp/util/config/database"
	"gitlab.com/brazncorp/web-ui/services"
)

var functions = []string{"view", "create", "update", "delete"}

type Permission struct {
	ID        primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Name      string             `json:"name,omitempty" bson:"name,omitempty"`
	Display   string             `json:"display" bson:"display,omitempty"`
	Function  string             `json:"function" bson:"function,omitempty"`
	ModuleID  string             `json:"module_id" bson:"module_id,omitempty"`
	Status    string             `json:"status" bson:"status,omitempty"`
	RoleIds   []string           `json:"role_ids" bson:"role_ids,omitempty"`
	UpdatedAt time.Time          `json:"updated_at,omitempty" bson:"updated_at,omitempty"`
	CreatedAt time.Time          `json:"created_at,omitempty" bson:"created_at,omitempty"`
}

type PerRole struct {
	ID            string `json:"id"`
	ModuleID      string `json:"module_id"`
	Function      string `json:"function"`
	Selected      bool   `json:"selected"`
	Indeterminate bool   `json:"indeterminate"`
	Disabled      bool   `json:"disabled"`
}

func (u *Permission) GetByRole(permissions []string) ([]PerRole, error) {
	var perms []Permission
	fltr := bson.D{}
	if err := database.Connection.Find("permissions", fltr, &perms); err != nil {
		log.Errorf("[Account][Role] Read failed!: msg=[%s], err=[%+v]", err.Error(), err)

		return nil, err
	}

	result := make([]PerRole, len(perms))
	for i, perm := range perms {
		result[i].ID = perm.ID.Hex()
		result[i].ModuleID = perm.ModuleID
		result[i].Function = perm.Function
		result[i].Disabled = false
		result[i].Indeterminate = false
		if services.Contains(permissions, perm.ID.Hex()) {
			result[i].Selected = true
		} else {
			result[i].Selected = false
		}
	}
	return result, nil
}
