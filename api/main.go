package main

import (
	"fontanelle-api/controllers"
	"fontanelle-api/middlewares"
	"fontanelle-api/utils"

	"github.com/gin-gonic/gin"
	cors "github.com/rs/cors/wrapper/gin"
)

func init() {
	utils.GetEnvConfig()
	utils.ConnectDatabase()
	utils.MigrateDatabase()
}

func main() {
	r := gin.Default()

	r.Use(cors.New(cors.Options{
		AllowedOrigins:   []string{"http://192.168.1.52:5173"},
		AllowCredentials: true,
	}))

	r.POST("/api/v1/user/signup", controllers.Signup)
	r.POST("/api/v1/user/signin", controllers.Signin)
	r.GET("/api/v1/user/me", middlewares.RequireAuth, controllers.Me)
	r.GET("/api/v1/user/signout", middlewares.RequireAuth, controllers.Signout)

	r.Run()
}
