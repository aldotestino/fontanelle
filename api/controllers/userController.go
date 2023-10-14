package controllers

import (
	"fontanelle-api/models"
	"fontanelle-api/utils"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
)

func Signup(c *gin.Context) {
	var body struct {
		Name     string
		Surname  string
		Email    string
		Password string
	}

	if c.Bind(&body) != nil {
		utils.ApiError(c, http.StatusBadRequest, "Invalid body")
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(body.Password), 10)

	if err != nil {
		utils.ApiError(c, http.StatusInternalServerError, "Something bad happened")
		return
	}

	user := models.User{Name: body.Name, Surname: body.Surname, Email: body.Email, Password: string(hash)}
	result := utils.DB.Create(&user)

	if result.Error != nil {
		utils.ApiError(c, http.StatusConflict, "Email already in use")
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "User created successfully",
	})
}

func Signin(c *gin.Context) {
	var body struct {
		Email    string
		Password string
	}

	if c.Bind(&body) != nil {
		utils.ApiError(c, http.StatusBadRequest, "Invalid body")
		return
	}

	var user models.User
	utils.DB.First(&user, "email = ?", body.Email)

	if user.ID == 0 {
		utils.ApiError(c, http.StatusNotFound, "Invalid email or password")
		return
	}

	err := bcrypt.CompareHashAndPassword([]byte(user.Password), []byte(body.Password))

	if err != nil {
		utils.ApiError(c, http.StatusNotFound, "Invalid email or password")
		return
	}

	token := jwt.NewWithClaims(jwt.SigningMethodHS256, jwt.MapClaims{
		"id":  user.ID,
		"exp": time.Now().Add(time.Hour * 24 * 30).Unix(),
	})

	tokenString, err := token.SignedString([]byte(os.Getenv("JWT_SECRET")))

	if err != nil {
		utils.ApiError(c, http.StatusInternalServerError, "Something bad happened")
		return
	}

	c.SetCookie("token", tokenString, 3600*24*30, "", "", os.Getenv("PRODUCTION") == "true", true)

	c.JSON(http.StatusOK, gin.H{
		"name":    user.Name,
		"surname": user.Surname,
		"email":   user.Email,
	})
}

func Me(c *gin.Context) {
	user := c.Keys["user"].(models.User)

	c.JSON(http.StatusOK, gin.H{
		"name":    user.Name,
		"surname": user.Surname,
		"email":   user.Email,
	})
}

func Signout(c *gin.Context) {
	c.SetCookie("token", "", -1, "", "", os.Getenv("PRODUCTION") == "true", true)
	c.JSON(http.StatusOK, gin.H{
		"message": "User signedout successfully",
	})
}
