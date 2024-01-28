package controllers

import (
	"fontanelle-api/models"
	"fontanelle-api/utils"
	"fontanelle-api/utils/validators"
	"net/http"
	"strconv"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

func GetFountains(c *gin.Context) {

	type ReportsCount struct {
		One   uint `json:"1"`
		Two   uint `json:"2"`
		Three uint `json:"3"`
		Four  uint `json:"4"`
		Five  uint `json:"5"`
	}

	type FountainSelect struct {
		ID      uint         `json:"id"`
		Lat     float64      `json:"lat"`
		Lng     float64      `json:"lng"`
		Street  string       `json:"street"`
		Name    string       `json:"name"`
		IsFree  bool         `json:"isFree"`
		Stars   float64      `json:"stars"`
		Reports ReportsCount `json:"reports" gorm:"embedded"`
	}

	var fountains []FountainSelect
	db := c.MustGet("DB").(*gorm.DB)
	db.Model(&models.Fountain{}).
		Select("fountains.*, AVG(v.stars) as stars, " +
			"COUNT(CASE WHEN r.reason = 1 THEN 1 END) as one, " +
			"COUNT(CASE WHEN r.reason = 2 THEN 1 END) as two, " +
			"COUNT(CASE WHEN r.reason = 3 THEN 1 END) as three," +
			"COUNT(CASE WHEN r.reason = 4 THEN 1 END) as four," +
			"COUNT(CASE WHEN r.reason = 5 THEN 1 END) as five").
		Joins("LEFT JOIN votes v ON fountains.id = v.fountain_id").
		Joins("LEFT JOIN reports r ON fountains.id = r.fountain_id").
		Group("fountains.id").
		Find(&fountains)

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
	db := c.MustGet("DB").(*gorm.DB)
	db.Model(&models.Fountain{}).Where("user_id = ?", user.ID).Find(&fountains)

	c.JSON(http.StatusOK, fountains)
}

func VoteFountain(c *gin.Context) {

	fountainIDString := c.Query("fountainId")

	if fountainIDString == "" {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "Missing fountainId",
		})
		return
	}

	fountainID, err := strconv.ParseUint(fountainIDString, 10, 32)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "Invalid fountainId",
		})
		return
	}

	var body validators.VoteFountainRequestBody

	if err := utils.BindAndValidateBody(c, &body); err != nil {
		c.AbortWithStatusJSON(err.StatusCode, gin.H{
			"error": err.Message,
		})
		return
	}

	user := c.Keys["user"].(models.User)

	vote := models.Vote{
		FountainID: uint(fountainID),
		UserID:     user.ID,
		Stars:      body.Stars,
	}
	db := c.MustGet("DB").(*gorm.DB)
	result := db.Create(&vote)

	if result.Error != nil {
		c.AbortWithStatusJSON(http.StatusConflict, gin.H{
			"error": "You already voted for this fountain",
		})
		return
	}

	// calculate new stars
	var stars float64
	db.Model(&models.Vote{}).Select("AVG(votes.stars) as stars").Where("fountain_id = ?", fountainID).Scan(&stars)

	c.JSON(http.StatusCreated, gin.H{
		"fountainId": fountainID,
		"stars":      stars,
	})
}

func ReportFountain(c *gin.Context) {
	fountainIDString := c.Query("fountainId")

	if fountainIDString == "" {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "Missing fountainId",
		})
		return
	}

	fountainID, err := strconv.ParseUint(fountainIDString, 10, 32)

	if err != nil {
		c.AbortWithStatusJSON(http.StatusBadRequest, gin.H{
			"error": "Invalid fountainId",
		})
		return
	}

	var body validators.ReportFountainRequestBody

	if err := utils.BindAndValidateBody(c, &body); err != nil {
		c.AbortWithStatusJSON(err.StatusCode, gin.H{
			"error": err.Message,
		})
		return
	}

	user := c.Keys["user"].(models.User)

	report := models.Report{
		FountainID: uint(fountainID),
		UserID:     user.ID,
		Reason:     body.Reason,
	}
	db := c.MustGet("DB").(*gorm.DB)
	result := db.Create(&report)

	if result.Error != nil {
		c.AbortWithStatusJSON(http.StatusConflict, gin.H{
			"error": "You already reported for the same reason this fountain",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"fountainId": fountainID,
		"reason":     body.Reason,
	})
}

func AddFountain(c *gin.Context) {
	var body validators.AddFountainRequestBody

	if err := utils.BindAndValidateBody(c, &body); err != nil {
		c.AbortWithStatusJSON(err.StatusCode, gin.H{
			"error": err.Message,
		})
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
	db := c.MustGet("DB").(*gorm.DB)
	result := db.Create(&fountain)

	if result.Error != nil {
		c.AbortWithStatusJSON(http.StatusConflict, gin.H{
			"error": "Fountain in this location already exists",
		})
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"id":     fountain.ID,
		"name":   fountain.Name,
		"isFree": fountain.IsFree,
		"lat":    fountain.Lat,
		"lng":    fountain.Lng,
		"street": fountain.Street,
		"reports": map[int]int{
			1: 0,
			2: 0,
			3: 0,
			4: 0,
			5: 0,
		},
	})
}
