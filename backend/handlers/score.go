package handlers

import (
	"github.com/Neel-shetty/go-fiber-server/handlers/functions"
	"github.com/Neel-shetty/go-fiber-server/models"
	"github.com/gofiber/fiber/v2"
)

func PostMTPersonalBests(c *fiber.Ctx) error {
	personalBests, err := functions.GetMTPersonalBestsFromApi("nice")
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"": ""})
	}
	userPersonalBest := new(models.MonkeyTypeStats)
	errors := models.ValidateStruct(userPersonalBest)
	if errors != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errors)
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"data": personalBests})

}

func GetMTPersonalBests(c *fiber.Ctx) error {
	personalBests, err := functions.GetMTPersonalBestsFromApi("nice")
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"": ""})
	}
	userPersonalBest := new(models.MonkeyTypeStats)
	errors := models.ValidateStruct(userPersonalBest)
	if errors != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errors)
	}
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"data": personalBests})

}
