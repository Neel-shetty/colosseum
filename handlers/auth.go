package handlers

import (
	"github.com/Neel-shetty/go-fiber-server/initializers"
	"github.com/Neel-shetty/go-fiber-server/models"
	"github.com/Neel-shetty/go-fiber-server/utils"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func Login(c *fiber.Ctx) error {
	payload := new(models.LoginUserSchema)

	if err := c.BodyParser(payload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "failed", "message": err.Error()})
	}

	errors := models.ValidateStruct(payload)
	if errors != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errors)
	}

	var user models.User
	result := initializers.DB.Select("password").First(&user, "email = ?", payload.Email)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"status": "fail", "message": "email or password is wrong"})
		}
		return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{"status": "fail", "message": result.Error.Error()})
	}

	passwordCorrect := utils.CheckPasswordHash(payload.Password, user.Password)

	if passwordCorrect == false {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"status": "fail", "message": "email or password is wrong"})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"status": "success", "message": "logged in"})
}
