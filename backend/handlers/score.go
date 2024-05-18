package handlers

import (
	"github.com/Neel-shetty/go-fiber-server/handlers/functions"
	"github.com/Neel-shetty/go-fiber-server/models"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func PostMTPersonalBests(c *fiber.Ctx) error {
	personalBests, err := functions.GetMTPersonalBestsFromApi("nice")
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"": ""})
	}
	uid  := c.Locals("userId").(uuid.UUID)
	err = functions.InsertPersonalBestsIntoDb(personalBests, uid)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "fail", "message": "failed to insert into db"})
	}
	// userPersonalBest := new(models.MonkeyTypeStats)
	// errors := models.ValidateStruct(userPersonalBest)
	// if errors != nil {
	// 	return c.Status(fiber.StatusBadRequest).JSON(errors)
	// }
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"data": personalBests})

}

func GetMTPersonalBests(c *fiber.Ctx) error {
	uid := c.Locals("userId").(uuid.UUID)
	personalBests, err := functions.GetMTPersonalBestsFromDb(uid)
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
