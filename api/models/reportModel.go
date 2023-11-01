package models

import (
	"time"

	"gorm.io/gorm"
)

// Reason:
// 1. Mancanza di manutenzione
// 2. Qualità dell'acqua compromessa
// 3. Rotture o danni strutturali
// 4. Accesso limitato o insufficiente
// 5. Mancanza di igiene e pulizia

type Report struct {
	CreatedAt time.Time
	UpdatedAt time.Time
	DeletedAt gorm.DeletedAt `gorm:"index"`

	FountainID uint `gorm:"primaryKey"`
	Fountain   Fountain

	UserID uint `gorm:"primaryKey"`
	User   User

	Reason uint8 `gorm:"primaryKey"`
}
