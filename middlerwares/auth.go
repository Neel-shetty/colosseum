package middlerwares

import (
	"log"

	"github.com/Neel-shetty/go-fiber-server/initializers"
	"github.com/Neel-shetty/go-fiber-server/models"
	"github.com/gofiber/fiber/v2"
	"github.com/golang-jwt/jwt/v5"
)

func AuthMiddleware(c *fiber.Ctx) error {
	token := c.Cookies("accessToken", "")
	if token == "" {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"status": "fail", "message": "User not authorized"})
	}

	claims := &models.Claims{}

	config, err := initializers.LoadConfig(".")
	if err != nil {
		log.Fatal("Failed to load environment variables! \n", err.Error())
	}
	jwtKey := []byte(config.JwtSecret)
	tkn, err := jwt.ParseWithClaims(token, claims, func(token *jwt.Token) (any, error) {
		return jwtKey, nil
	})

	if err != nil {
		if err == jwt.ErrSignatureInvalid {
			return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"status": "fail", "message": "User not authorized"})
		}
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "fail", "message": "Bad Request"})
	}
	if !tkn.Valid {
		return c.Status(fiber.StatusUnauthorized).JSON(fiber.Map{"status": "fail", "message": "User not authorized"})
	}

	c.Locals("userId", claims.Id)

	return c.Next()
}
