package models

import "gorm.io/gorm"

type User struct {
	gorm.Model
	Name     string
	Surname  string
	Email    string `gorm:"unique"`
	Password string
	Votes    []Vote
}
