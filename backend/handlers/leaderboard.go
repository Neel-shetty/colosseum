package handlers

import (
	"github.com/Neel-shetty/go-fiber-server/initializers"
	"github.com/Neel-shetty/go-fiber-server/models"
	"github.com/gofiber/fiber/v2"
)

func Leaderboard(c *fiber.Ctx) error {
	var leaderboard []models.MTPersonalBestsDB
	result := initializers.DB.Order("Words_Per_Min desc").Find(&leaderboard)

	if result.Error != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "failed", "message": result.Error.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"status": "success", "data": leaderboard})
}
