package main

import (
	"fmt"

	_ "github.com/Neel-shetty/go-fiber-server/docs"
	"github.com/Neel-shetty/go-fiber-server/handlers"
	"github.com/Neel-shetty/go-fiber-server/handlers/functions"
	"github.com/Neel-shetty/go-fiber-server/initializers"
	"github.com/Neel-shetty/go-fiber-server/middlerwares"

	"log"

	"github.com/gofiber/contrib/swagger"

	"github.com/gofiber/fiber/v2"
	"github.com/gofiber/fiber/v2/middleware/cors"
	"github.com/gofiber/fiber/v2/middleware/encryptcookie"
	"github.com/gofiber/fiber/v2/middleware/logger"
)

func init() {
	config, err := initializers.LoadConfig(".")
	fmt.Println(config)
	if err != nil {
		log.Fatalln("Failed to load environment variables! \n", err.Error())
	}
	initializers.ConnectDB(&config)
	initializers.InitGraphql()
}

// @title cynergy
// @version		1.0
// @description	This is a simple rest server with user auth
// @contact.name	Neel Narayan Shetty
// @contact.email	neelnarayanshetty@protonmail.com
// @license.name	GPLv3
// @license.url	https://www.gnu.org/licenses/gpl-3.0.en.html
// @host			localhost:3000
// @BasePath		/
func main() {
	// Initialize a new Fiber app
	// nice
	app := fiber.New(fiber.Config{
		AppName: "Go Fiber Server",
	})
	app.Use(logger.New())
	app.Use(cors.New())

	config, err := initializers.LoadConfig(".")
	if err != nil {
		log.Fatal("Failed to load environment variables! \n", err.Error())
	}
	encryptKey := config.CookieSecret
	cfg := swagger.Config{
		BasePath: "/",
		FilePath: "./docs/swagger.json",
		Path:     "swagger",
		Title:    "Cynergy api",
		CacheAge: 60,
	}
	app.Use(swagger.New(cfg))
	app.Use(encryptcookie.New(encryptcookie.Config{Key: encryptKey}))

	// unauthorized routes
	app.Post("/user", handlers.CreateUser)
	app.Post("/login", handlers.Login)
	// app.Get("/streak/:username", functions.GetUserStreak)
	app.Get("/streak/:username", functions.FetchStats)
	app.Get("/leaderboard", handlers.Leaderboard)

	app.Use(middlerwares.AuthMiddleware)
	// authorized routes
	app.Get("/user", handlers.GetUser)
	app.Patch("/user", handlers.UpdateUser)
	app.Delete("/user", handlers.DeleteUser)
	app.Post("/logout", handlers.Logout)
	app.Post("/mt-personal-best", handlers.PostMTPersonalBests)
	app.Get("/mt-personal-best", handlers.GetMTPersonalBests)

	// Start the server on port 3000
	app.Listen(":3000")
}
