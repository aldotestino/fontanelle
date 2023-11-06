package controllers

import (
	"fontanelle-api/models"
	"fontanelle-api/utils"
	"fontanelle-api/utils/validators"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/golang-jwt/jwt/v5"
	"golang.org/x/crypto/bcrypt"
	"gorm.io/gorm"
)

func GoogleOAuth(c *gin.Context) {
	code := c.Query("code")

	if code == "" {
		utils.ApiError(c, http.StatusUnauthorized, "Authorization code not provided")
		return
	}

	tokenRes, err := utils.GetGoogleOauthToken(code)
	if err != nil {
		utils.ApiError(c, http.StatusBadGateway, err.Error())
		return
	}

	googleUser, err := utils.GetGoogleUser(tokenRes.AccessToken, tokenRes.IdToken)
	if err != nil {
		utils.ApiError(c, http.StatusBadGateway, err.Error())
		return
	}

	user := models.User{Name: googleUser.GivenName, Surname: googleUser.FamilyName, Email: googleUser.Email, Picture: googleUser.Picture, Provider: "google"}

	db := c.MustGet("DB").(*gorm.DB)
	result := db.FirstOrCreate(&user, "email = ?", user.Email)
	if result.Error != nil {
		utils.ApiError(c, http.StatusInternalServerError, "Something bad happened")
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

	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("token", tokenString, 3600*24*30, "", os.Getenv("APP_URL"), os.Getenv("GIN_MODE") == "release", true)

	c.Redirect(http.StatusTemporaryRedirect, os.Getenv("APP_URL"))
}

func Signup(c *gin.Context) {
	var body validators.SignupRequestBody

	if !utils.BindAndValidateBody(c, &body) {
		return
	}

	hash, err := bcrypt.GenerateFromPassword([]byte(body.Password), 10)

	if err != nil {
		utils.ApiError(c, http.StatusInternalServerError, "Something bad happened")
		return
	}

	user := models.User{Name: body.Name, Surname: body.Surname, Email: body.Email, Password: string(hash), Provider: "local"}
	db := c.MustGet("DB").(*gorm.DB)
	result := db.Create(&user)

	if result.Error != nil {
		utils.ApiError(c, http.StatusConflict, "Email already in use")
		return
	}

	c.JSON(http.StatusCreated, gin.H{
		"message": "User created successfully",
	})
}

func Signin(c *gin.Context) {
	var body validators.SigninRequestBody

	if !utils.BindAndValidateBody(c, &body) {
		return
	}

	var user models.User
	db := c.MustGet("DB").(*gorm.DB)
	db.First(&user, "email = ?", body.Email)

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

	c.SetSameSite(http.SameSiteLaxMode)
	c.SetCookie("token", tokenString, 3600*24*30, "", os.Getenv("APP_URL"), os.Getenv("GIN_MODE") == "release", true)

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
		"picture": user.Picture,
	})
}

func Signout(c *gin.Context) {
	c.SetCookie("token", "", -1, "", "", os.Getenv("PRODUCTION") == "true", true)
	c.JSON(http.StatusOK, gin.H{
		"message": "User signed out successfully",
	})
}
