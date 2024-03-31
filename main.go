package main

import (
	"github.com/Neel-shetty/go-fiber-server/handlers"
	"github.com/Neel-shetty/go-fiber-server/initializers"
	"github.com/Neel-shetty/go-fiber-server/middlerwares"

	// "github.com/gofiber/contrib/swagger"
	"log"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/encryptcookie"
)

func init() {
	config, err := initializers.LoadConfig(".")
	if err != nil {
		log.Fatalln("Failed to load environment variables! \n", err.Error())
	}
	initializers.ConnectDB(&config)
}

func main() {
	// Initialize a new Fiber app
	app := fiber.New(fiber.Config{
		AppName: "Go Fiber Server",
	})

	config, err := initializers.LoadConfig(".")
	if err != nil {
		log.Fatal("Failed to load environment variables! \n", err.Error())
	}
	encryptKey := config.CookieSecret
	app.Use(encryptcookie.New(encryptcookie.Config{Key: encryptKey}))
	// app.Use(swagger.New())

	// unauthorized routes
	app.Post("/user", handlers.CreateUser)
	app.Post("/login", handlers.Login)

	app.Use(middlerwares.AuthMiddleware)
	// authorized routes
	app.Get("/user", handlers.GetUser)
	app.Patch("/user", handlers.UpdateUser)
	app.Delete("/user", handlers.DeleteUser)
	app.Post("/logout", handlers.Logout)

	// Start the server on port 3000
	app.Listen(":3000")
}
