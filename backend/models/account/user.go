package account

import (
	"errors"
	"time"

	"go.mongodb.org/mongo-driver/mongo"

	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"golang.org/x/crypto/bcrypt"

	log "github.com/micro/go-micro/v2/logger"
	"github.com/mitchellh/mapstructure"

	"gitlab.com/brazncorp/util/config/database"
)

type UserModel struct{}

// User struct
type User struct {
	ID            primitive.ObjectID `json:"id,omitempty" bson:"_id,omitempty"`
	Name          string             `json:"name,omitempty" bson:"name,omitempty"`
	FirstName     string             `json:"first_name,omitempty" bson:"first_name,omitempty"`
	Email         string             `json:"email,omitempty" bson:"email,omitempty"`
	Password      string             `json:"password,omitempty" bson:"password,omitempty"`
	SuperAdmin    int                `json:"super_admin,omitempty" bson:"super_admin,omitempty"`
	Status        string             `json:"status,omitempty" bson:"status,omitempty"`
	RememberToken string             `json:"remember_token,omitempty" bson:"remember_token,omitempty"`
	RoleIds       []string           `json:"role_ids,omitempty" bson:"role_ids,omitempty"`
	AvatarURL     string             `json:"avatar_url,omitempty" bson:"avatar_url,omitempty"`
	Language      string             `json:"language" bson:"language,omitempty"`
	Timezone      string             `json:"timezone" bson:"timezone,omitempty"`
	UpdatedAt     time.Time          `json:"updated_at,omitempty" bson:"updated_at,omitempty"`
	CreatedAt     time.Time          `json:"created_at,omitempty" bson:"created_at,omitempty"`
}

// UserResponse struct
type UserResponse struct {
	User          `mapstructure:",squash"`
	Password      string `json:"password,omitempty" mapstructure:"-"`
	RememberToken string `json:"remember_token,omitempty" mapstructure:"-"`
}

// Read function
func (u *UserModel) Read() (rsp []UserResponse, err error) {
	var m []User
	fltr := bson.D{{"super_admin", bson.M{"$ne": 1}}}
	if err = database.Connection.Find("users", fltr, &m); err != nil {
		log.Errorf("[Account][User] Read failed!: msg=[%s], err=[%+v]", err.Error(), err)

		return
	}

	err = mapstructure.Decode(m, &rsp)
	for i := 0; i < len(m); i++ {
		rsp[i].CreatedAt = m[i].CreatedAt
		rsp[i].UpdatedAt = m[i].UpdatedAt
	}

	return
}

// ReadOne function
func (u *UserModel) ReadOne(id string) (rsp *UserResponse, err error) {
	var objID primitive.ObjectID
	if objID, err = primitive.ObjectIDFromHex(id); nil != err {
		return
	}

	var m User
	fltr := bson.D{{"_id", objID}}
	if err = database.Connection.FindOne("users", fltr, &m); err != nil {
		log.Errorf("[Account][User] Read failed!: msg=[%s], err=[%+v]", err.Error(), err)

		return
	}

	if m.ID.IsZero() {
		err = errors.New("Resource not found")

		return
	}

	if err = mapstructure.Decode(m, &rsp); nil != err {
		return
	}

	rsp.CreatedAt = m.CreatedAt
	rsp.UpdatedAt = m.UpdatedAt

	return
}

// Update function
func (u *UserModel) Update(id string, user User) (rsp *UserResponse, err error) {
	objID, _ := primitive.ObjectIDFromHex(id)
	fltr := bson.D{{"_id", objID}}
	if err = database.Connection.Upsert("users", fltr, &user); nil != err {
		log.Errorf("[Account][User] Update failed!: msg=[%s], err=[%+v]", err.Error(), err)

		return
	}
	err = mapstructure.Decode(user, &rsp)

	return
}

func (u *UserModel) Create(data User) (rsp *UserResponse, err error) {
	_, err = u.GetUserByEmail(data.Email)
	if err != nil {
		return
	}
	var result *mongo.InsertOneResult
	result, err = database.Connection.Create("users", &data)
	if nil != err {
		return
	}
	data.ID = result.InsertedID.(primitive.ObjectID)
	err = mapstructure.Decode(data, &rsp)

	return
}

func (u *UserModel) CheckAuth(email, password string) (ok bool, err error) {
	user, err := u.GetUserByEmail(email)
	if err != nil {
		return
	}
	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(password))
	if err != nil && err == bcrypt.ErrMismatchedHashAndPassword {
		err = errors.New("Bad credentials")

		return
	}

	ok = true

	return
}

func (u *UserModel) GetUserByEmail(email string) (user User, err error) {
	fltr := bson.D{{"email", email}}
	if err = database.Connection.FindOne("users", fltr, &user); err != nil {
		return
	}
	if user.ID.IsZero() {
		err = errors.New("Email address not found")
		return
	}

	return
}
