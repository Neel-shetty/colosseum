package models

import (
	"database/sql"
	"time"

	"github.com/go-playground/validator/v10"
	"github.com/google/uuid"
)

// @Schema
type User struct {
	ID               uuid.UUID      `gorm:"type:uuid;default:uuid_generate_v4();primary_key" json:"id,omitempty"`
	Name             string         `gorm:"varchar(255);not null" json:"name"`
	Email            string         `gorm:"not null;unique;index:" json:"email"`
	Password         string         `gorm:"not null" json:"password"`
	PhoneNumber      int            `gorm:"not null" json:"phoneNumber"`
	Score            int            `gorm:"not null;default:1000" json:"score"`
	CreatedAt        time.Time      `gorm:"not null" json:"createdAt,omitempty"`
	UpdatedAt        time.Time      `gorm:"not null" json:"updatedAt,omitempty"`
	ProfilePic       sql.NullString `json:"profilPic"`
	Ban              bool           `gorm:"default:0" json:"ban"`
	MonkeyTypeApiKey sql.NullString `json:"monkeyTypeApiKey"`
	MonkeyTypeScore  int            `gorm:"not null;default:0" json:"monkeyTypeScore"`
}

type CreateUserSchema struct {
	Name        string `json:"name" validate:"required"`
	Email       string `json:"email" validate:"email,required"`
	Password    string `json:"password" validate:"required,min=8"`
	PhoneNumber int    `json:"phoneNumber" validate:"required,min=10"`
}

type UpdateUserSchema struct {
	Name        string `json:"name,omitempty"`
	Email       string `json:"email,omitempty"`
	Password    string `json:"password,omitempty"`
	PhoneNumber int    `json:"phoneNumber,omitempty"`
}

type GetUserSchema struct {
	Name        string    `json:"name" validate:"required"`
	Email       string    `json:"email" validate:"email,required"`
	PhoneNumber int       `json:"phoneNumber" validate:"required,min=10"`
	CreatedAt   time.Time `json:"createdAt"`
}

type LoginUserSchema struct {
	Email    string `json:"email" validate:"email,required"`
	Password string `json:"password" validate:"required"`
}

type ErrorResponse struct {
	Field string `json:"field"`
	Tag   string `json:"tag"`
	Value string `json:"value,omitempty"`
}

var validate = validator.New()

func ValidateStruct[T any](payload T) []*ErrorResponse {
	var errors []*ErrorResponse
	err := validate.Struct(payload)
	if err != nil {
		for _, err := range err.(validator.ValidationErrors) {
			var element ErrorResponse
			element.Field = err.StructNamespace()
			element.Tag = err.Tag()
			element.Value = err.Param()
			errors = append(errors, &element)
		}
	}
	return errors
}
