package functions

import (
	"encoding/json"
	"fmt"

	// "time"

	"github.com/Neel-shetty/go-fiber-server/initializers"
	"github.com/Neel-shetty/go-fiber-server/models"
	"github.com/gofiber/fiber/v2"
)

func InsertPersonalBestsIntoDb(personalBests models.MTPersonalBestResponse) error {
	for interval, pbList := range personalBests.Data {
		for _, pb := range pbList {
			// Insert each personal best record into the database
			err := InsertPersonalBestRecord(pb, interval)
			if err != nil {
				return err
			}
		}
	}
	return nil
}

func InsertPersonalBestRecord(pb models.MTPersonalBests, interval string) error {
	pbModel := models.MTPersonalBests{
		Accuracy:    pb.Accuracy,
		Consistency: pb.Consistency,
		Difficulty:  pb.Difficulty,
		LazyMode:    pb.LazyMode,
		Language:    pb.Language,
		Punctuation: pb.Punctuation,
		Raw:         pb.Raw,
		WordsPerMin: pb.WordsPerMin,
		// Timestamp:   time.Unix(0, pb.Timestamp*time.Millisecond),
		Numbers: pb.Numbers,
		// Timestamp: time.Now(),
	}

	result := initializers.DB.Create(&pbModel)
	if result.Error != nil {
		return result.Error
	}
	return nil
}

func GetMTPersonalBestsFromApi(apeKey string) (models.MTPersonalBestResponse, error) {
	agent := fiber.Get("https://api.monkeytype.com/users/personalBests")
	apiKey := fmt.Sprintf("ApeKey %s", apeKey)
	fmt.Println(apiKey)
	agent.Set("Authorization", "ApeKey NjYwYTc1MWRhODM0MzBhYTFhYjlmOTcwLnZoWnpxMUdPX1pxZG1tZTEwTnJfbzF3b3Y5bWRRd0dh")
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
