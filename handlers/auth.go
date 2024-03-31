package handlers

import (
	"log"
	"time"

	"github.com/Neel-shetty/go-fiber-server/initializers"
	"github.com/Neel-shetty/go-fiber-server/models"
	"github.com/Neel-shetty/go-fiber-server/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
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
	result := initializers.DB.Select("password", "id").First(&user, "email = ?", payload.Email)
	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"status": "fail", "message": "email or password is wrong"})
		}
		return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{"status": "fail", "message": result.Error.Error()})
	}

	passwordCorrect := utils.CheckPasswordHash(payload.Password, user.Password)

	if passwordCorrect == false {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"status": "fail", "message": "email or password is wrong"})
	} else {
		config, err := initializers.LoadConfig(".")
		if err != nil {
			log.Fatal("Failed to load environment variables! \n", err.Error())
		}
		jwtKey := []byte(config.JwtSecret)
		expirationTime := time.Now().Add(time.Hour.Abs() * 24)
		claims := &models.Claims{
			Id: user.ID,
			RegisteredClaims: jwt.RegisteredClaims{
				ExpiresAt: jwt.NewNumericDate(expirationTime),
			},
		}
		t := jwt.NewWithClaims(jwt.SigningMethodHS256, claims)
		token, err := t.SignedString(jwtKey)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "fail", "message": "Error creating token"})
		}
		c.Cookie(&fiber.Cookie{Name: "accessToken", Expires: expirationTime, Value: token, HTTPOnly: true, SameSite: "Strict", Secure: true})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"status": "success", "message": "logged in"})
}

func Logout(c *fiber.Ctx) error {
	c.Cookie(&fiber.Cookie{Name: "accessToken", Value: "", HTTPOnly: true, Expires: time.Now().Add(-time.Hour), SameSite: "Strict", Secure: true})
	return c.Status(fiber.StatusOK).JSON(fiber.Map{"status": "success", "message": "User logged out"})
}
