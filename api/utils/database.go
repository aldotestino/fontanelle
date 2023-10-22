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

	conn_str := fmt.Sprintf("host=%s user=%s password=%s dbname=postgres port=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_PORT"),
	)
	DB, err = gorm.Open(postgres.Open(conn_str), &gorm.Config{})

	if err != nil {
		panic("Failed to connect to Database")
	}

	var db_exists bool
	query := DB.Raw("SELECT EXISTS(SELECT datname FROM pg_catalog.pg_database WHERE datname = ?)", os.Getenv("DB_NAME")).Scan(&db_exists)
	if query.Error != nil {
		panic("Failed to check if database exists: " + query.Error.Error())
	}

	if !db_exists {
		if err := DB.Exec(fmt.Sprintf("CREATE DATABASE %s", os.Getenv("DB_NAME"))).Error; err != nil {
			panic("Failed to create the database: " + err.Error())
		}
	}

	conn_str = fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable",
		os.Getenv("DB_HOST"),
		os.Getenv("DB_USER"),
		os.Getenv("DB_PASSWORD"),
		os.Getenv("DB_NAME"),
		os.Getenv("DB_PORT"),
	)

	DB, err = gorm.Open(postgres.Open(conn_str), &gorm.Config{})
	if err != nil {
		panic("Failed to connect to the new database: " + err.Error())
	}
}

func MigrateDatabase() {

	DB.AutoMigrate(&models.User{}, &models.Fountain{})

	// Add unique constraint to lat and lng if not exists
	var constraint_exists bool
	tx := DB.Raw("SELECT EXISTS (SELECT 1  FROM pg_constraint WHERE conname = 'unique_lat_lng')").Scan(&constraint_exists)
	if tx.Error != nil {
		panic("Failed to check if constraint exists: " + tx.Error.Error())
	}

	if !constraint_exists {
		if err := DB.Exec("ALTER TABLE fountains ADD CONSTRAINT unique_lat_lng UNIQUE (lat, lng)").Error; err != nil {
			panic("Failed to create the constraint: " + err.Error())
		}
	}

}
