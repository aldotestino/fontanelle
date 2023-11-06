package main

import (
	"fontanelle-api/controllers"
	"fontanelle-api/middlewares"
	"fontanelle-api/utils"
	"log"
	"os"

	"github.com/gin-gonic/gin"
	cors "github.com/rs/cors/wrapper/gin"
	"gorm.io/gorm"
)

var DB *gorm.DB

func init() {
	if os.Getenv("GIN_MODE") != gin.ReleaseMode {
		utils.GetEnvConfig()
	}
	var err error
	DB, err = utils.ConnectDatabase()
	if err != nil {
		panic("Failed to connect to database")
	}
	utils.MigrateDatabase(DB)
}

func main() {
	r := gin.Default()

	r.Use(cors.New(cors.Options{
		AllowedOrigins:   []string{os.Getenv("APP_URL")},
		AllowCredentials: true,
	}))

	r.Use(middlewares.SetDB(DB))

	user := r.Group("/api/v1/user")
	{
		user.GET("/google", controllers.GoogleOAuth)
		user.POST("/signup", controllers.Signup)
		user.POST("/signin", controllers.Signin)
		user.GET("/me", middlewares.RequireAuth, controllers.Me)
		user.GET("/signout", middlewares.RequireAuth, controllers.Signout)
	}

	fountain := r.Group("/api/v1/fountain")
	{
		fountain.GET("", controllers.GetFountains)
		fountain.GET("/mine", middlewares.RequireAuth, controllers.GetUserFountains)
		fountain.POST("", middlewares.RequireAuth, controllers.AddFountain)
		fountain.POST("/vote", middlewares.RequireAuth, controllers.VoteFountain)
		fountain.POST("/report", middlewares.RequireAuth, controllers.ReportFountain)
	}

	if gin.Mode() == gin.ReleaseMode {
		log.Default().Println("Listening and serving HTTP on :" + os.Getenv("PORT"))
	}
	r.Run()
}
