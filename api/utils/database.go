package utils

import (
	"fmt"
	"fontanelle-api/models"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	var err error

	conn_str := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)
	DB, err = gorm.Open(postgres.Open(conn_str), &gorm.Config{})

	if err != nil {
		panic("Failed to connect to Database")
	}
}

func MigrateDatabase() {
	DB.AutoMigrate(&models.User{}, &models.Fountain{}, &models.Vote{})
}
