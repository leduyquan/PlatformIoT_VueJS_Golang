package controllers

import (
	"net/http"

	"github.com/dgrijalva/jwt-go"
	"github.com/gin-gonic/gin"
	"github.com/micro/go-micro/v2/logger"

	"gitlab.com/brazncorp/web-ui/middlewares"
	maccount "gitlab.com/brazncorp/web-ui/models/account"
	mcommon "gitlab.com/brazncorp/web-ui/models/common"
	"gitlab.com/brazncorp/web-ui/services"
)

var (
	modelUser    = new(maccount.UserModel)
	modelRole    = maccount.NewRole()
	modelProfile = new(maccount.ProfileModel)
)

type account struct {
}

func (v *account) Login(c *gin.Context) {
	var user struct {
		Email    string `json:"email"`
		Password string `json:"password"`
	}

	if err := c.BindJSON(&user); err != nil {
		services.Respond(c, http.StatusUnauthorized, services.ErrorAuth, nil)
		return
	}

	isExist, err := modelUser.CheckAuth(user.Email, user.Password)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{
			"success": false,
			"code":    services.ERROR,
			"msg":     err.Error(),
		})
		return
	}

	if !isExist {
		services.Respond(c, http.StatusUnauthorized, services.ErrorAuth, nil)
		return
	}

	td, err := middlewares.GenerateToken(user.Email)
	if err != nil {
		services.Respond(c, http.StatusInternalServerError, services.ErrorAuthToken, nil)
		return
	}

	middlewares.CreateAuth(user.Email, td)
	services.Respond(c, http.StatusOK, services.SUCCESS, map[string]string{
		"access_token":  td.AccessToken,
		"refresh_token": td.RefreshToken,
	})
}

func (v *account) Logout(c *gin.Context) {
	token := middlewares.ExtractToken(c)
	claim, err := middlewares.ParseTokenExpire(token)
	if err != nil {
		services.Respond(c, http.StatusUnauthorized, services.ErrorAuthCheckTokenFail, nil)
		return
	}

	if claim != nil {
		middlewares.DeleteAuth(claim.UuId)
	}

	c.JSON(http.StatusOK, gin.H{"code": services.SUCCESS, "msg": "Successfully logged out"})
}

func (v *account) Refresh(c *gin.Context) {
	accessToken := middlewares.ExtractToken(c)
	crf, err := middlewares.ParseTokenExpire(accessToken)
	if err != nil {
		services.Respond(c, http.StatusUnauthorized, services.ErrorAuthCheckTokenFail, nil)
		return
	}

	mapToken := map[string]string{}
	if err := c.ShouldBindJSON(&mapToken); err != nil {
		services.Respond(c, http.StatusUnprocessableEntity, services.ErrorUnprocessableEntity, nil)
		return
	}

	refreshToken := mapToken["refresh_token"]
	claim, err := middlewares.ParseToken(refreshToken)
	if err != nil {
		switch err.(*jwt.ValidationError).Errors {
		case jwt.ValidationErrorExpired:
			services.Respond(c, http.StatusUnauthorized, services.ErrorAuthCheckTokenTimeout, nil)
			return
		default:
			services.Respond(c, http.StatusUnauthorized, services.ErrorAuthCheckTokenFail, nil)
			return
		}
	}

	if crf.Email != claim.Email {
		services.Respond(c, http.StatusUnauthorized, services.ErrorAuthCheckTokenFail, nil)
		return
	}

	td, err := middlewares.GenerateToken(claim.Email)
	if err != nil {
		services.Respond(c, http.StatusInternalServerError, services.ErrorAuthToken, nil)
		return
	}

	middlewares.DeleteAuth(claim.UuId)
	middlewares.DeleteAuth(crf.UuId)

	middlewares.CreateAuth(claim.Email, td)
	services.Respond(c, http.StatusOK, services.SUCCESS, map[string]string{
		"access_token":  td.AccessToken,
		"refresh_token": td.RefreshToken,
	})

}

// ReadUsers function
func (v *account) ReadUsers(c *gin.Context) {
	data, err := modelUser.Read()
	if err != nil {
		services.Respond(c, http.StatusInternalServerError, services.ErrorGetFailed, nil)
		return
	}

	services.Respond(c, http.StatusOK, services.SUCCESS, mcommon.Rsp.Respond(data))
}

// ReadUser function
func (v *account) ReadUser(c *gin.Context) {
	id := c.Params.ByName("id")
	data, err := modelUser.ReadOne(id)
	if err != nil {
		services.Respond(c, http.StatusInternalServerError, services.ErrorGetFailed, nil)
		return
	}

	services.Respond(c, http.StatusOK, services.SUCCESS, mcommon.Rsp.Respond(data))
}

// UpdateUser function
func (v *account) UpdateUser(c *gin.Context) {
	id := c.Params.ByName("id")
	var m maccount.User
	c.BindJSON(&m)

	data, err := modelUser.Update(id, m)
	if err != nil {
		services.Respond(c, http.StatusInternalServerError, services.ErrorUpdateFailed, nil)
		return
	}
	services.Respond(c, http.StatusOK, services.SUCCESS, mcommon.Rsp.Respond(data))
}

func (v *account) CreateUser(c *gin.Context) {
	var m maccount.User
	c.BindJSON(&m)

	data, err := modelUser.Create(m)
	if err != nil {
		services.Respond(c, http.StatusInternalServerError, services.ErrorCreateFailed, nil)
		return
	}
	services.Respond(c, http.StatusOK, services.SUCCESS, mcommon.Rsp.Respond(data))
}

func (v *account) ReadRoles(c *gin.Context) {
	data, err := modelRole.Read()
	if err != nil {
		services.Respond(c, http.StatusInternalServerError, services.ErrorGetFailed, nil)
		return
	}
	services.Respond(c, http.StatusOK, services.SUCCESS, mcommon.Rsp.Respond(data))
}

func (v *account) ReadRole(c *gin.Context) {
	id := c.Params.ByName("id")
	data, err := modelRole.GetRoleDetail(id)

	if err != nil {
		services.Respond(c, http.StatusInternalServerError, services.ErrorGetFailed, nil)
		return
	}
	services.Respond(c, http.StatusOK, services.SUCCESS, mcommon.Rsp.Respond(data))
}

func (v *account) UpdateRole(c *gin.Context) {
	id := c.Params.ByName("id")
	var m maccount.Role
	c.BindJSON(&m)

	err := m.Update(id)
	if err != nil {
		services.Respond(c, http.StatusInternalServerError, services.ErrorUpdateFailed, nil)
		return
	}
	services.Respond(c, http.StatusOK, services.SUCCESS, m)
}

func (v *account) UpdateProfile(c *gin.Context) {
	var bindFile maccount.BindProfile
	if err := c.ShouldBind(&bindFile); err != nil {
		services.Respond(c, http.StatusInternalServerError, services.InvalidParams, nil)
		return
	}

	err := modelProfile.UpdateProfile(c, bindFile)
	if err != nil {
		services.Respond(c, http.StatusInternalServerError, services.ErrorUpdateFailed, nil)
		return
	}

	services.Respond(c, http.StatusOK, services.SUCCESS, nil)
}

func (v *account) GetProfile(c *gin.Context) {
	data, err := modelProfile.GetProfile(c)
	if err != nil {
		services.Respond(c, http.StatusInternalServerError, services.ErrorUpdateFailed, nil)
		return
	}

	services.Respond(c, http.StatusOK, services.SUCCESS, mcommon.Rsp.Respond(data))
}

func (v *account) ChangePassword(c *gin.Context) {
	var res maccount.BindProfile
	if err := c.ShouldBind(&res); err != nil {
		logger.Info(err.Error())
		services.Respond(c, http.StatusInternalServerError, services.InvalidParams, nil)
		return
	}

	err := modelProfile.ChangePassword(c, res)
	if err != nil {
		services.Respond(c, http.StatusInternalServerError, services.ErrorUpdateFailed, nil)
		return
	}

	services.Respond(c, http.StatusOK, services.SUCCESS, nil)
}
