package models

import "github.com/gofiber/fiber/v2"

type HttpError struct {
	status  string
	message string
}

type HttpSuccess struct {
	status string
	data   fiber.Map
}
