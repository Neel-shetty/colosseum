package functions

import (
	"crypto/sha256"
	"encoding/hex"
	"encoding/json"
	"fmt"
	"time"

	"github.com/Neel-shetty/go-fiber-server/initializers"
	"github.com/Neel-shetty/go-fiber-server/models"
	"github.com/gofiber/fiber/v2"
	"github.com/google/uuid"
)

func InsertPersonalBestsIntoDb(personalBests models.MTPersonalBestResponse, uid uuid.UUID) error {
	for interval, pbList := range personalBests.Data {
		for _, pb := range pbList {
			// Insert each personal best record into the database
			err := InsertPersonalBestRecord(pb, interval, uid)
			if err != nil {
				return err
			}
		}
	}
	return nil
}

func InsertPersonalBestRecord(pb models.MTPersonalBests, interval string, uid uuid.UUID) error {
	hash := calculateHash(pb)

	// Check if an entry with the same UserID and Hash already exists in the database
	var existingRecord models.MTPersonalBestsDB
	err := initializers.DB.Where("user_id = ? AND hash = ?", uid, hash).First(&existingRecord).Error
	if err == nil {
		// If a record with the same hash exists, skip insertion
		return nil
	}

	pbModel := models.MTPersonalBestsDB{
		Accuracy:    pb.Accuracy,
		Consistency: pb.Consistency,
		Difficulty:  pb.Difficulty,
		LazyMode:    pb.LazyMode,
		Language:    pb.Language,
		Punctuation: pb.Punctuation,
		Raw:         pb.Raw,
		WordsPerMin: pb.WordsPerMin,
		Timestamp:   convertUnixMillisecondsToTime(pb.Timestamp),
		Numbers:     pb.Numbers,
		Hash:        hash,
		UserID:      uid,
	}

	result := initializers.DB.Create(&pbModel)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func calculateHash(pb models.MTPersonalBests) string {
	data := fmt.Sprintf("%v%v%v%v%v%v%v%v%v%v", pb.Accuracy, pb.Consistency, pb.Difficulty, pb.LazyMode, pb.Language, pb.Punctuation, pb.Raw, pb.WordsPerMin, pb.Timestamp, pb.Numbers)
	hash := sha256.Sum256([]byte(data))
	return hex.EncodeToString(hash[:])
}

func GetMTPersonalBestsFromApi(apeKey string) (models.MTPersonalBestResponse, error) {
	agent := fiber.Get("https://api.monkeytype.com/users/personalBests")
	apiKey := fmt.Sprintf("ApeKey %s", apeKey)
	fmt.Println(apiKey)
	agent.Set("Authorization", apiKey)
	agent.QueryString("mode=time")
	// agent.Debug()
	statusCode, body, errs := agent.Bytes()
	if len(errs) > 0 {
		return models.MTPersonalBestResponse{}, &fiber.Error{Code: statusCode, Message: "request to api failed"}
	}

	var personalBests models.MTPersonalBestResponse
	err := json.Unmarshal(body, &personalBests)
	if err != nil {
		return models.MTPersonalBestResponse{}, &fiber.Error{Code: statusCode, Message: "Failed to Unmarshal json returned by api"}
	}

	return personalBests, nil
}

func GetMTPersonalBestsFromDb(uid uuid.UUID) ([]models.MTPersonalBestsDB, error) {
	var personalBests []models.MTPersonalBestsDB
	result := initializers.DB.Where("user_id = ?", uid).Find(&personalBests)
	if result.Error != nil {
		return nil, result.Error
	}
	return personalBests, nil
}

func GetMTLastResult(apeKey string) (models.MTLastResultResponse, error) {
	agent := fiber.Get("https://api.monkeytype.com/results/last")
	apiKey := fmt.Sprintf("ApeKey %s", apeKey)
	// agent.Set("Authorization", "ApeKey NjYwYTc1MWRhODM0MzBhYTFhYjlmOTcwLnZoWnpxMUdPX1pxZG1tZTEwTnJfbzF3b3Y5bWRRd0dh")
	agent.Set("Authorization", apiKey)
	// agent.Debug()

	statusCode, body, errs := agent.Bytes()
	if len(errs) > 0 {
		return models.MTLastResultResponse{}, &fiber.Error{Code: statusCode, Message: "request to api failed"}
	}

	var personalBests models.MTLastResultResponse
	err := json.Unmarshal(body, &personalBests)
	if err != nil {
		return models.MTLastResultResponse{}, &fiber.Error{Code: statusCode, Message: "Failed to Unmarshal json returned by api"}
	}
	// to output
	// fmt.Println(time.Unix(userPersonalBests.Data.Timestamp/1000, 0).Date())
	// fmt.Println(time.Now().Date())

	return personalBests, nil
}

func convertUnixMillisecondsToTime(ms int64) time.Time {
	// Your Unix timestamp in milliseconds
	timestamp := int64(ms)

	// Convert milliseconds to seconds and nanoseconds
	seconds := timestamp / 1000
	nanoseconds := (timestamp % 1000) * 1000000

	// Create a time.Time object
	t := time.Unix(seconds, nanoseconds)
	return t
}
