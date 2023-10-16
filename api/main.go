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

	user := r.Group("/api/v1/user")
	{
		user.POST("/signup", controllers.Signup)
		user.POST("/signin", controllers.Signin)
		user.GET("/me", middlewares.RequireAuth, controllers.Me)
		user.GET("/signout", middlewares.RequireAuth, controllers.Signout)
	}

	r.Run()
}
