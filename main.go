package main

import (
	"log"

	"github.com/Neel-shetty/go-fiber-server/handlers"
	"github.com/Neel-shetty/go-fiber-server/initializers"
	"github.com/gofiber/fiber/v2"
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

	// Define a route for the GET method on the root path '/'
	app.Get("/user", handlers.GetUser)
	app.Post("/user", handlers.CreateUser)
	app.Patch("/user", handlers.UpdateUser)
	app.Delete("/user", handlers.DeleteUser)

	// Start the server on port 3000
	log.Fatal(app.Listen(":3000"))
}
