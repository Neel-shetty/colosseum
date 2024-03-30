package handlers

import (
	// "github.com/Neel-shetty/go-fiber-server/models"
	"fmt"

	"github.com/Neel-shetty/go-fiber-server/models"
	"github.com/gofiber/fiber/v2"
)

func CreateUser(c *fiber.Ctx) error {
	user := new(models.User)

	if err := c.BodyParser(user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "failed", "message": err.Error()})
	}

	fmt.Println(user.Name, user.Email)

	errors := models.ValidateStruct(user)
	if errors != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errors)
	}

	if err := c.BodyParser(&user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "fail", "message": err.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"status": "success", "user": user})
}

func GetUser(c *fiber.Ctx) error {
	c.SendString("received user - neel")
	return nil
}

func DeleteUser(c *fiber.Ctx) error {
	c.SendString("deleted user - neel")
	return nil
}

func UpdateUser(c *fiber.Ctx) error {
	c.SendString("updated user - neel")
	return nil
}
