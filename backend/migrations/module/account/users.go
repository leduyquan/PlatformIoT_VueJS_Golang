package account

import (
	"time"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
	"golang.org/x/crypto/bcrypt"

	"gitlab.com/brazncorp/util/config/database"
)

type User struct {
}

func (c *User) Run() error {
	hashedPass, _ := bcrypt.GenerateFromPassword([]byte("Br@zn@2sims"), bcrypt.DefaultCost)
	op := func(db *mongo.Database) (interface{}, error) {
		col := db.Collection("users")
		opts := options.Update().SetUpsert(true)
		fltr := bson.D{{"email", "masteradmin@brazn.co"}}
		update := bson.D{{"$set", bson.D{
			{"name", "Brazn Corp"},
			{"first_name", "Brazn Corp"},
			{"email", "masteradmin@brazn.co"},
			{"password", string(hashedPass)},
			{"super_admin", 1},
			{"status", "Active"},
			{"updated_at", time.Now().UTC()},
			{"created_at", time.Now().UTC()},
		}}}
		_, err := col.UpdateOne(database.Connection.Context, fltr, update, opts)

		return nil, err
	}
	if _, err := database.Connection.Operate(op); err != nil {
		return err
	}

	return nil
}
