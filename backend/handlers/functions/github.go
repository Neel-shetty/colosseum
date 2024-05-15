package functions

import (
	// "fmt"
	//
	// "github.com/gofiber/fiber/v2"
)

// func GetStreakFromGithub(githubKey string) error {
// 	agent := fiber.Get("https://api.monkeytype.com/users/personalBests")
// 	apiKey := fmt.Sprintf("Bearer %s", githubKey)
// 	fmt.Println(apiKey)
// 	agent.Set("Authorization", apiKey)
// 	agent.QueryString("mode=time")
// 	// agent.Debug()
// 	statusCode, body, errs := agent.Bytes()
// 	if len(errs) > 0 {
// 		return models.MTPersonalBestResponse{}, &fiber.Error{Code: statusCode, Message: "request to api failed"}
// 	}
//
// 	return nil
// }
