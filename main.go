package main

import (
	"log"

	"github.com/Neel-shetty/go-fiber-server/handlers"
	"github.com/gofiber/fiber/v2"
)

func main() {
	// Initialize a new Fiber app
	app := fiber.New(fiber.Config{
		AppName: "Go Fiber Server",
	})

	// Define a route for the GET method on the root path '/'
	app.Get("/user", handlers.GetUser)
	app.Post("/user", handlers.CreateUser)
	app.Put("/user", handlers.UpdateUser)
	app.Delete("/user", handlers.DeleteUser)

	// Start the server on port 3000
	log.Fatal(app.Listen(":3000"))
}
