package utils

import (
	"fontanelle-api/models"
	"os"

	"gorm.io/driver/postgres"
	"gorm.io/gorm"
)

var DB *gorm.DB

func ConnectDatabase() {
	var err error
	DB, err = gorm.Open(postgres.Open(os.Getenv("DATABASE_URL")), &gorm.Config{})

	if err != nil {
		panic("Failed to connect to Database")
	}
}

func MigrateDatabase() {
	DB.AutoMigrate(&models.User{}, &models.Fountain{})

	// Add unique constraint to lat and lng
	DB.Exec("ALTER TABLE fountains ADD CONSTRAINT unique_lat_lng UNIQUE (lat, lng)")
}
