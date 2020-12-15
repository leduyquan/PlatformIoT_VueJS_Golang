package barrier

import (
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	log "github.com/micro/go-micro/v2/logger"

	"gitlab.com/brazncorp/util/config/database"
	mcommon "gitlab.com/brazncorp/web-ui/models/common"
	mfile "gitlab.com/brazncorp/web-ui/models/file"
	msetting "gitlab.com/brazncorp/web-ui/models/system/setting"
)

var table = "barriers"

// Barrier struct
type Barrier struct {
	ID         primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	AgentID    string             `json:"agent_id,omitempty" bson:"agent_id,omitempty"`
	AgentName  string             `json:"agent_name,omitempty" bson:"agent_name,omitempty"`
	CameraID   int                `json:"camera_id,omitempty" bson:"camera_id,omitempty"`
	CameraName string             `json:"camera_name,omitempty" bson:"camera_name,omitempty"`
	Name       string             `json:"name,omitempty" bson:"name,omitempty"`
	Host       string             `json:"host,omitempty" bson:"host,omitempty"`
	Port       int                `json:"port,omitempty" bson:"port,omitempty"`
	URL        string             `json:"url,omitempty" bson:"url,omitempty"`
	Rules      []struct {
		CategoryID string `json:"category_id,omitempty" bson:"category_id,omitempty"`
		RuleID     string `json:"rule_id,omitempty" bson:"rule_id,omitempty"`
	} `json:"rules,omitempty" bson:"rules,omitempty"`
	Active    bool      `json:"active,omitempty" bson:"active,omitempty"`
	CreatedAt time.Time `json:"created_at,omitempty" bson:"created_at,omitempty"`
	UpdatedAt time.Time `json:"updated_at,omitempty" bson:"updated_at,omitempty"`
}

func (b *Barrier) All() (rsp []Barrier, err error) {
	if err = database.Connection.Find("barriers", nil, &rsp); err != nil {
		return
	}

	return
}

func (b *Barrier) Detail(id string) (err error) {
	objID, _ := primitive.ObjectIDFromHex(id)
	fltr := bson.D{{"_id", objID}}
	if err = database.Connection.FindOne("barriers", fltr, &b); err != nil {
		return
	}

	return
}

func (b *Barrier) Save(id string) (err error) {
	if "" != id {
		var objID primitive.ObjectID
		if objID, err = primitive.ObjectIDFromHex(id); nil != err {
			log.Errorf("[Dashboard][Barrier] Invalid ID!: msg=[%s], err=[%+v], data=[%s]", err.Error(), err, id)

			return
		}
		b.ID = objID
	}

	if err = database.Connection.Upsert(table, nil, b); nil != err {
		log.Errorf("[Dashboard][Barrier] Update failed!: msg=[%s], err=[%+v], data=[%+v]", err.Error(), err, b)

		return
	}

	if err = mfile.NewBarrierConfig().Save(b); nil != err {
		return
	}

	return
}

func (b *Barrier) Delete(id string) (err error) {
	objID, _ := primitive.ObjectIDFromHex(id)
	fltr := bson.D{{"_id", objID}}
	op := func(db *mongo.Database) (interface{}, error) {
		return db.Collection("barriers").DeleteOne(database.Connection.Context, fltr)
	}
	if _, err = database.Connection.Operate(op); nil != err {
		log.Errorf("[Dashboard][Barrier] Delete failed!: msg=[%s], err=[%+v], data=[%s]", err.Error(), err, id)

		return
	}

	if err = mfile.NewBarrierConfig().Delete(id); nil != err {
		return
	}

	return
}

func (b *Barrier) SyncUp() (err error) {
	data := map[string]interface{}{}
	var m msetting.Agent
	_ = database.Connection.FindOne("agents", nil, &m)

	if !m.ID.IsZero() {
		var barriers []Barrier
		if err = database.Connection.Find("barriers", nil, &barriers); err != nil {
			return
		}
		data["agent_id"] = m.ID
		data["barriers"] = barriers

		err = mcommon.Auth.SyncUp("/api/barriers/sync", data)

		return
	}

	return
}
