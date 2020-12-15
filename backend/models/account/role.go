package account

import (
	"errors"
	"time"

	log "github.com/micro/go-micro/v2/logger"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"

	"gitlab.com/brazncorp/util/config/database"
	"gitlab.com/brazncorp/web-ui/models"
)

func NewRole() *Role {
	return nil
}

type Role struct {
	ID            primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Name          string             `json:"name,omitempty" bson:"name,omitempty"`
	Description   string             `json:"description,omitempty" bson:"description,omitempty"`
	PermissionIds []string           `json:"permission_ids,omitempty" bson:"permission_ids,omitempty"`
	Status        string             `json:"status,omitempty" bson:"status,omitempty"`
	UpdatedAt     time.Time          `json:"updated_at,omitempty" bson:"updated_at,omitempty"`
	CreatedAt     time.Time          `json:"created_at,omitempty" bson:"created_at,omitempty"`
}

func (u *Role) Read() ([]Role, error) {
	var m []Role
	fltr := bson.D{{"status", "Active"}}
	if err := database.Connection.Find("roles", fltr, &m); err != nil {
		log.Errorf("[Account][Role] Read failed!: msg=[%s], err=[%+v]", err.Error(), err)

		return nil, err
	}

	return m, nil
}

func (u *Role) ReadOne(id string) (Role, error) {
	var m Role
	objID, err := primitive.ObjectIDFromHex(id)
	if nil != err {
		return m, errors.New("Invalid object ID")
	}
	fltr := bson.D{{"_id", objID}}
	if err := database.Connection.FindOne("roles", fltr, &m); err != nil {
		log.Errorf("[Account][Role] Read failed!: msg=[%s], err=[%+v]", err.Error(), err)

		return m, err
	}

	if m.ID.IsZero() {
		return m, errors.New("Resource not found")
	}

	return m, nil
}

func (u *Role) GetRoleDetail(id string) (interface{}, error) {
	var perm Permission
	var m models.Module
	objID, err := primitive.ObjectIDFromHex(id)
	if nil != err {
		log.Error(err)
		return u, errors.New("Invalid object ID")
	}
	fltr := bson.D{{"_id", objID}}
	if err := database.Connection.FindOne("roles", fltr, &u); err != nil {
		log.Error(err)

		return u, err
	}

	if u.ID.IsZero() {
		return u, errors.New("Resource not found")
	}

	perms, err := perm.GetByRole(u.PermissionIds)
	var mod []map[string]interface{}
	m.GetModules(&mod)

	data := map[string]interface{}{
		"role":       u,
		"permission": perms,
		"module":     mod,
	}
	return data, nil
}

func (u *Role) Update(id string) error {
	if "" != id {
		objID, err := primitive.ObjectIDFromHex(id)
		if nil != err {
			log.Errorf("[Account][Role] Invalid ID!: msg=[%s], err=[%+v]", err.Error(), err)

			return err
		}
		u.ID = objID
	}

	if err := database.Connection.Upsert("roles", nil, &u); nil != err {
		log.Errorf("[Account][Role] Update failed!: msg=[%s], err=[%+v]", err.Error(), err)

		return err
	}

	return nil
}
