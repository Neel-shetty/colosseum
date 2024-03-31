package models

import "github.com/gofiber/fiber/v2"

type HttpError struct {
	status  string `validate:"oneof=fail success"`
	message string
}

type HttpSuccess struct {
	status string `validate:"oneof=fail success"`
	data   fiber.Map
}
