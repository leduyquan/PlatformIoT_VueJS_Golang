package controllers

import (
	"github.com/gin-gonic/gin"

	"gitlab.com/brazncorp/web-ui/stream"
)

type Account interface {
	Login(c *gin.Context)
	Logout(c *gin.Context)
	Refresh(c *gin.Context)
	GetProfile(c *gin.Context)
	UpdateProfile(c *gin.Context)
	ChangePassword(c *gin.Context)
	ReadUsers(c *gin.Context)
	ReadUser(c *gin.Context)
	UpdateUser(c *gin.Context)
	CreateUser(c *gin.Context)
	ReadRoles(c *gin.Context)
	ReadRole(c *gin.Context)
	UpdateRole(c *gin.Context)
}

type Barrier interface {
	Get(c *gin.Context)
	Detail(c *gin.Context)
	Store(c *gin.Context)
	Delete(c *gin.Context)
	GetLogs(c *gin.Context)
}

type Configuration interface {
	GetModules(c *gin.Context)
}

type ALPR interface {
	Webhook(c *gin.Context)
	GetConfig(c *gin.Context)
	GetLP(c *gin.Context)
	StreamLP(c *gin.Context)
	StreamVideoFeed(c *gin.Context)
}

type SDM interface {
	StreamCamera(c *gin.Context)
	GetConfig(c *gin.Context)
	GetCameraConfig(c *gin.Context)
	StoreCameraConfig(c *gin.Context)
	DeleteCameraConfig(c *gin.Context)
	GetCameraCalibrate(c *gin.Context)
	StoreCameraCalibrate(c *gin.Context)
	RestartService(c *gin.Context)
}

type Service interface {
	GetAuditLogs(c *gin.Context)
}

// Setting interface
type Setting interface {
	AgentRead(c *gin.Context)
	AgentUpdate(c *gin.Context)
	CameraDirectory(c *gin.Context)
	CameraRead(c *gin.Context)
	CameraFetch(c *gin.Context)
}

// Vehicle interface
type Vehicle interface {
	// Dashboard API
	GetFilterData(c *gin.Context)
	GetList(c *gin.Context)

	// Admin API
	ReadPlates(c *gin.Context)
	ReadCategories(c *gin.Context)
	ReadRules(c *gin.Context)
	SyncPlates(c *gin.Context)
	SyncCategories(c *gin.Context)
	SyncRules(c *gin.Context)
}

func NewAccount() Account {
	return (*account)(nil)
}

func NewBarrier() Barrier {
	return (*barrier)(nil)
}

func NewConfiguration() Configuration {
	return (*configuration)(nil)
}

func NewSDM() SDM {
	return (*sdm)(nil)
}

func NewALPR() ALPR {
	return &alpr{
		s: stream.NewStreamer(),
	}
}

func NewService() Service {
	return (*service)(nil)
}

// NewSetting function
func NewSetting() Setting {
	return (*setting)(nil)
}

// NewVehicle function
func NewVehicle() Vehicle {
	return (*vehicle)(nil)
}
