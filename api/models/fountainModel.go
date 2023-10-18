package models

import "gorm.io/gorm"

type Fountain struct {
	gorm.Model
	Name   string
	IsFree uint8
	Lat    float64
	Lng    float64
	Street string

	UserID uint
	User   User
}
