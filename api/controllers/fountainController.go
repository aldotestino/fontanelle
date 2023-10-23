package controllers

import (
	"fontanelle-api/models"
	"fontanelle-api/utils"
	"fontanelle-api/utils/validators"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
)

func GetFountains(c *gin.Context) {

	type FountainSelect struct {
		ID     uint    `json:"id"`
		Lat    float64 `json:"lat"`
		Lng    float64 `json:"lng"`
		Street string  `json:"street"`
		Name   string  `json:"name"`
		IsFree bool    `json:"isFree"`
		Stars  float64 `json:"stars"`
	}

	var fountains []FountainSelect

	utils.DB.Preload("Votes").Model(&models.Fountain{}).Select("fountains.*, AVG(votes.stars) as stars").Joins("left join votes on votes.fountain_id = fountains.id").Group("fountains.id").Find(&fountains)

	c.JSON(http.StatusOK, fountains)
}

func GetUserFountains(c *gin.Context) {
	user := c.Keys["user"].(models.User)

	type FountainSelect struct {
		ID     uint   `json:"id"`
		Street string `json:"street"`
		Name   string `json:"name"`
	}

	var fountains []FountainSelect
	utils.DB.Model(&models.Fountain{}).Where("user_id = ?", user.ID).Find(&fountains)

	c.JSON(http.StatusOK, fountains)
}

func VoteFountain(c *gin.Context) {

	fountainIDString := c.Query("fountainId")

	if fountainIDString == "" {
		utils.ApiError(c, http.StatusBadRequest, "Missing fountainId")
		return
	}

	fountainID, err := strconv.ParseUint(fountainIDString, 10, 32)

	if err != nil {
		utils.ApiError(c, http.StatusBadRequest, "Invalid fountainId")
		return
	}

	var body validators.VoteFountainRequestBody

	if !utils.BindAndValidateBody(c, &body) {
		return
	}

	user := c.Keys["user"].(models.User)

	vote := models.Vote{
		FountainID: uint(fountainID),
		UserID:     user.ID,
		Stars:      body.Stars,
	}
	result := utils.DB.Create(&vote)

	if result.Error != nil {
		utils.ApiError(c, http.StatusConflict, "You already voted for this fountain")
		return
	}

	// calculate new stars
	var stars float64
	utils.DB.Model(&models.Vote{}).Select("AVG(votes.stars) as stars").Where("fountain_id = ?", fountainID).Scan(&stars)

	c.JSON(http.StatusCreated, gin.H{
		"fountainId": fountainID,
		"stars":      stars,
	})
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
