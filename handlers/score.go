package handlers

import (
	"encoding/json"

	"github.com/Neel-shetty/go-fiber-server/models"
	"github.com/gofiber/fiber/v2"
)

func MTPersonalBests(c *fiber.Ctx) (models.Response, error) {
	agent := fiber.Get("https://api.monkeytype.com/users/personalBests")
	agent.Set("Authorization", "ApeKey NjYwYTc1MWRhODM0MzBhYTFhYjlmOTcwLnZoWnpxMUdPX1pxZG1tZTEwTnJfbzF3b3Y5bWRRd0dh")
	agent.QueryString("mode=time")
	// agent.Debug()
	statusCode, body, errs := agent.Bytes()
	if len(errs) > 0 {
		return models.Response{}, &fiber.Error{Code: statusCode, Message: "request to api failed"}
	}

	var personalBests models.Response
	err := json.Unmarshal(body, &personalBests)
	if err != nil {
		return models.Response{}, &fiber.Error{Code: statusCode, Message: "Failed to Unmarshal json returned by api"}
	}

	return personalBests, nil
}
