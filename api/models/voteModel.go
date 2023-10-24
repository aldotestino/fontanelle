package models

import (
	"time"

	"gorm.io/gorm"
)

type Vote struct {
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`

	FountainID uint `gorm:"primaryKey"`
	Fountain   Fountain

	UserID uint `gorm:"primaryKey"`
	User   User

	Stars uint8
}
