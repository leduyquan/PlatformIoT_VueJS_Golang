package account

import (
	"errors"
	"mime/multipart"

	"golang.org/x/crypto/bcrypt"

	"github.com/mitchellh/mapstructure"

	"github.com/micro/go-micro/v2/logger"

	"github.com/gin-gonic/gin"
)

type ProfileModel struct{}

type BindProfile struct {
	Name                 string                `form:"name"`
	Language             string                `form:"language"`
	Timezone             string                `form:"timezone"`
	Password             string                `form:"password"`
	CurrentPassword      string                `form:"current_password"`
	PasswordConfirmation string                `form:"password_confirmation"`
	File                 *multipart.FileHeader `form:"image"`
}

func (p *ProfileModel) GetProfile(c *gin.Context) (rsp *UserResponse, err error) {
	var model UserModel
	value, ok := c.Get("email")
	if !ok {
		err = errors.New("Email address not found")
		return
	}

	user, err := model.GetUserByEmail(value.(string))
	if err != nil {
		return
	}

	err = mapstructure.Decode(user, &rsp)

	return
}

func (p *ProfileModel) UpdateProfile(c *gin.Context, data BindProfile) error {
	var avatarUrl string
	var model UserModel
	value, ok := c.Get("email")
	if !ok {
		return errors.New("Email address not found")
	}

	user, err := model.GetUserByEmail(value.(string))
	if err != nil {
		return err
	}

	avatarUrl = user.AvatarURL
	if data.File != nil {
		file := data.File
		dst := "public/img/" + file.Filename
		avatarUrl = "file/img/" + file.Filename
		if err := c.SaveUploadedFile(file, dst); err != nil {
			return err
		}
	}

	user.Name = data.Name
	user.AvatarURL = avatarUrl
	user.Language = data.Language
	user.Timezone = data.Timezone

	_, err = model.Update(user.ID.Hex(), user)
	if err != nil {
		logger.Error(err)
		return err
	}

	return nil
}

func (p *ProfileModel) ChangePassword(c *gin.Context, data BindProfile) error {
	var model UserModel
	value, ok := c.Get("email")
	if !ok {
		return errors.New("Email address not found")
	}

	user, err := model.GetUserByEmail(value.(string))
	if err != nil {
		return err
	}

	if data.CurrentPassword == "" || data.Password == "" || data.PasswordConfirmation == "" || data.Password != data.PasswordConfirmation {
		return errors.New("Bad credentials")
	}

	err = bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(data.CurrentPassword))
	if err != nil && err == bcrypt.ErrMismatchedHashAndPassword {
		return err
	}

	hashedPass, _ := bcrypt.GenerateFromPassword([]byte(data.Password), bcrypt.DefaultCost)
	user.Password = string(hashedPass)
	_, err = model.Update(user.ID.Hex(), user)
	if err != nil {
		logger.Error(err)
		return err
	}

	return nil
}
