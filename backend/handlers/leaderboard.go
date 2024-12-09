package handlers

import (
	"github.com/Neel-shetty/go-fiber-server/initializers"
	"github.com/Neel-shetty/go-fiber-server/models"
	"github.com/gofiber/fiber/v2"
	"gorm.io/gorm"
)

func Leaderboard(c *fiber.Ctx) error {
	var leaderboard []models.MTPersonalBestsDB
	result := initializers.DB.Preload("User", func(db *gorm.DB) *gorm.DB {
		return db.Select("id, name")
	}).Order("Words_Per_Min desc").Find(&leaderboard)

	if result.Error != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "failed", "message": result.Error.Error()})
	}

	var response []models.Leaderboard
	for _, entry := range leaderboard {
		response = append(response, models.Leaderboard{
			Accuracy:    entry.Accuracy,
			Consistency: entry.Consistency,
			Difficulty:  entry.Difficulty,
			LazyMode:    entry.LazyMode,
			Language:    entry.Language,
			Punctuation: entry.Punctuation,
			Raw:         entry.Raw,
			Hash:        entry.Hash,
			WordsPerMin: entry.WordsPerMin,
			Timestamp:   entry.Timestamp,
			UserName:    entry.User.Name, // Only the name is included here
			UserID:      entry.UserID,
		})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"status": "success", "data": response})

}
