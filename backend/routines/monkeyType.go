package routines

import (
	"fmt"
	"time"

	"github.com/Neel-shetty/go-fiber-server/handlers/functions"
	"github.com/Neel-shetty/go-fiber-server/initializers"
	"github.com/Neel-shetty/go-fiber-server/models"
)

// PollMTPersonalBests starts polling user personal bests at a given interval
func PollMTPersonalBests(interval time.Duration) {
	// Set up a ticker to run the function periodically
	ticker := time.NewTicker(interval)
	defer ticker.Stop()

	for {
		select {
		case <-ticker.C:
			UpdateAllUserPersonalBests()
		}
	}
}

// UpdateAllUserPersonalBests fetches users and updates their personal bests
func UpdateAllUserPersonalBests() {
	var users []models.User
	if err := initializers.DB.Find(&users).Error; err != nil {
		fmt.Println("Error fetching users:", err)
		return
	}

	for _, user := range users {
		if user.MonkeyTypeApiKey.Valid {
			personalBests, err := functions.GetMTPersonalBestsFromApi(user.MonkeyTypeApiKey.String)
			if err != nil {
				fmt.Printf("Error fetching personal bests for user %s: %v\n", user.ID, err)
				continue
			}
			err = functions.InsertPersonalBestsIntoDb(personalBests, user.ID)
			if err != nil {
				fmt.Printf("Error updating personal bests for user %s: %v\n", user.ID, err)
			} else {
				fmt.Printf("Successfully updated personal bests for user %s\n", user.ID)
			}
		}
	}
}
