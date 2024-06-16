package functions

import (
	"context"
	"os"
	"time"

	"github.com/Neel-shetty/go-fiber-server/initializers"
	"github.com/gofiber/fiber/v2"
	"github.com/machinebox/graphql"
)

type Contributions struct {
    ContributionCalendar struct {
        Weeks []struct {
            ContributionDays []struct {
                Date        string `json:"date"`
                ContributionCount int `json:"contributionCount"`
            } `json:"contributionDays"`
        } `json:"weeks"`
    } `json:"contributionCalendar"`
}

func fetchUserContributions(username string) ([]string, error) {
    req :=  graphql.NewRequest(`
        query($login: String!) {
            user(login: $login) {
                contributionsCollection {
                    contributionCalendar {
                        weeks {
                            contributionDays {
                                date
                                contributionCount
                            }
                        }
                    }
                }
            }
        }
    `)
    req.Var("login", username)
    req.Header.Set("Authorization", "Bearer "+os.Getenv("GITHUB_TOKEN"))

    var resp struct {
        User struct {
            ContributionsCollection Contributions `json:"contributionsCollection"`
        } `json:"user"`
    }

    if err := initializers.GraphqlClient.Run(context.Background(), req, &resp); err != nil {
        return nil, err
    }

    var contributionDays []string
    for _, week := range resp.User.ContributionsCollection.ContributionCalendar.Weeks {
        for _, day := range week.ContributionDays {
            if day.ContributionCount > 0 {
                contributionDays = append(contributionDays, day.Date)
            }
        }
    }

    return contributionDays, nil
}

func calculateStreaks(contributionDays []string) (currentStreak, longestStreak int) {
    if len(contributionDays) == 0 {
        return 0, 0
    }

    longestStreak = 0
    currentStreak = 0
    layout := "2006-01-02"
    previousDate, _ := time.Parse(layout, contributionDays[0])

    for i := 1; i < len(contributionDays); i++ {
        currentDate, _ := time.Parse(layout, contributionDays[i])
        if currentDate.Sub(previousDate).Hours() == 24 {
            currentStreak++
        } else {
            if currentStreak > longestStreak {
                longestStreak = currentStreak
            }
            currentStreak = 1
        }
        previousDate = currentDate
    }

    if currentStreak > longestStreak {
        longestStreak = currentStreak
    }

    return currentStreak, longestStreak
}

func GetUserStreak(c *fiber.Ctx) error {
    username := c.Params("username")
    if username == "" {
        return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{
            "error": "Username is required",
        })
    }

    contributionDays, err := fetchUserContributions(username)
    if err != nil {
        return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{
            "error": err.Error(),
        })
    }

    currentStreak, longestStreak := calculateStreaks(contributionDays)

    return c.JSON(fiber.Map{
        "currentStreak": currentStreak,
        "longestStreak": longestStreak,
    })
}

