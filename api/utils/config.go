package utils

import (
	"log"

	"github.com/joho/godotenv"
)

func GetEnvConfig() {
	err := godotenv.Load(".env.local")

	if err != nil {
		log.Fatal("Error loading .env file")
	}
}
