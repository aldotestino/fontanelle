package controllers

import (
	"fontanelle-api/models"
	"fontanelle-api/utils"
	"fontanelle-api/utils/validators"
	"net/http"

	"github.com/gin-gonic/gin"
)

type FountainSelect struct {
	ID     uint    `json:"id"`
	Lat    float64 `json:"lat"`
	Lng    float64 `json:"lng"`
	Street string  `json:"street"`
	Name   string  `json:"name"`
	IsFree bool    `json:"isFree"`
}

func GetFountains(c *gin.Context) {

	var fountains []FountainSelect
	utils.DB.Model(&models.Fountain{}).Find(&fountains)

	c.JSON(http.StatusOK, fountains)
}

func GetUserFountains(c *gin.Context) {
	user := c.Keys["user"].(models.User)

	var fountains []FountainSelect
	utils.DB.Model(&models.Fountain{}).Where("user_id = ?", user.ID).Find(&fountains)

	c.JSON(http.StatusOK, fountains)
}

func AddFountain(c *gin.Context) {
	var body validators.AddFountainRequestBody

	if !utils.BindAndValidateBody(c, &body) {
		return
	}

	user := c.Keys["user"].(models.User)

	fountain := models.Fountain{
		Name:   body.Name,
		IsFree: body.IsFree,
		Lat:    body.Lat,
		Lng:    body.Lng,
		Street: body.Street,
		UserID: user.ID,
	}
	result := utils.DB.Create(&fountain)

	if result.Error != nil {
		utils.ApiError(c, http.StatusConflict, "Fountain in this location already exists")
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"id":     fountain.ID,
		"name":   fountain.Name,
		"isFree": fountain.IsFree,
		"lat":    fountain.Lat,
		"lng":    fountain.Lng,
		"street": fountain.Street,
	})
}
