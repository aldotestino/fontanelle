package models

import "gorm.io/gorm"

type Vote struct {
	gorm.Model
	FountainID uint `gorm:"uniqueIndex:idx_user_vote_fountain"`
	Fountain   Fountain
	UserID     uint `gorm:"uniqueIndex:idx_user_vote_fountain"`
	User       User
	Stars      uint8
}
