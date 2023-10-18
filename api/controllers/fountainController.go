package controllers

import (
	"fontanelle-api/models"
	"fontanelle-api/utils"
	"fontanelle-api/utils/validators"
	"net/http"

	"github.com/gin-gonic/gin"
)

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
		utils.ApiError(c, http.StatusConflict, result.Error.Error())
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
