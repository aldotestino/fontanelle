package models

import "gorm.io/gorm"

type Fountain struct {
	gorm.Model
	Name   string
	IsFree uint8
	Lat    float64 `gorm:"uniqueIndex:idx_lat_lng"`
	Lng    float64 `gorm:"uniqueIndex:idx_lat_lng"`
	Street string

	UserID uint
	User   User

	Votes []Vote
}
