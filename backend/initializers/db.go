package initializers

import (
	"fmt"
	"log"
	"os"

	"github.com/Neel-shetty/go-fiber-server/models"
	"gorm.io/driver/postgres"
	"gorm.io/gorm"
	"gorm.io/gorm/logger"
)

var DB *gorm.DB

func ConnectDB(config *Config) {
	dsn := fmt.Sprintf("host=%s user=%s password=%s dbname=%s port=%s sslmode=disable TimeZone=Asia/Kolkata", config.DBHost, config.DBUserName, config.DBUserPassword, config.DBName, config.DBPort)

	var err error
	DB, err = gorm.Open(postgres.Open(dsn), &gorm.Config{})

	if err != nil {
		log.Fatal("Failed to connect to the Database! \n", err.Error())
		os.Exit(1)
	}

	DB.Exec("CREATE EXTENSION IF NOT EXISTS \"uuid-ossp\"")
	DB.Logger = logger.Default.LogMode(logger.Info)

	log.Println("Running Migrations")
	DB.AutoMigrate(&models.User{})
	DB.AutoMigrate(&models.Score{})
	DB.AutoMigrate(&models.MonkeyTypeStats{})

	log.Println("🚀 Connected Successfully to the Database")
}
