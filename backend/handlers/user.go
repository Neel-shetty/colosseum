package handlers

import (
	// "fmt"
	"fmt"
	"strings"
	"time"

	"github.com/Neel-shetty/go-fiber-server/initializers"
	"github.com/Neel-shetty/go-fiber-server/models"
	"github.com/Neel-shetty/go-fiber-server/utils"
	"github.com/gofiber/fiber/v2"
	"github.com/lib/pq"
	"gorm.io/gorm"
)

// @Schema
type HTTPError struct {
	// The HTTP status code of the error
	Status int `json:"status"`
	// The error message
	Message string `json:"message"`
}

// CreateUser godoc
// @Summary Create a new user
// @Description Create a new user with the provided details
// @Tags User
// @Accept json
// @Produce json
// @Param user body models.CreateUserSchema true "User details"
// @Success 201 {object} models.User
// @Failure 400 {object} HTTPError
// @Failure 409 {object} HTTPError "A user with this email already exists"
// @Failure 500 {object} HTTPError
// @Router /user [post]
func CreateUser(c *fiber.Ctx) error {
	user := new(models.CreateUserSchema)

	if err := c.BodyParser(user); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "failed", "message": err.Error()})
	}

	errors := models.ValidateStruct(user)
	if errors != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errors)
	}

	hashedPassword, err := utils.HashPassword(user.Password)
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "failed", "message": "failed hashing password"})
	}

	newUser := models.User{
		Name:        user.Name,
		Email:       user.Email,
		Password:    hashedPassword,
		PhoneNumber: user.PhoneNumber,
		Year:        user.Year,
		Skills:      user.Skills,
		Branch:      user.Branch,
		About:       user.About,
	}

	result := initializers.DB.Create(&newUser)

	if result.Error != nil && strings.Contains(result.Error.Error(), "duplicate key value violates unique") {
		return c.Status(fiber.StatusConflict).JSON(fiber.Map{"status": "fail", "message": "A user with this email already exists"})
	} else if result.Error != nil {
		return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{"status": "error", "message": result.Error.Error()})
	}

	return c.Status(fiber.StatusCreated).JSON(fiber.Map{"status": "success", "message": "user has been created"})
}

func GetUser(c *fiber.Ctx) error {
	userId := c.Locals("userId")

	var user models.GetUserSchema
	result := initializers.DB.Table("users").
		Select("name, email, phone_number, created_at, skills, branch, year, about").
		Where("id = ?", userId).
		First(&user)

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"status": "fail", "message": "User not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "fail", "message": result.Error.Error()})
	}

	// Ensure `skills` is never null
	if user.Skills == nil {
		user.Skills = pq.StringArray{}
	}

	var leaderboard []models.MTPersonalBestsDB
	err := initializers.DB.Order("Words_Per_Min desc").Find(&leaderboard).Error
	if err != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "fail", "message": "Error fetching leaderboard"})
	}
	fmt.Printf("Leaderboard: %v %v\n", userId, leaderboard[1].UserID.String())

	userIdStr := fmt.Sprintf("%v", userId)
	userRank := 0
	for i, entry := range leaderboard {
		if entry.UserID.String() == userIdStr {
			fmt.Printf("User found at index %v\n", i)
			userRank = i + 1
			break
		}
	}
	response := fiber.Map{
		"status": "success",
		"user":   user,
		"rank":   userRank,
	}

	// return c.Status(fiber.StatusOK).JSON(fiber.Map{"status": "success", "user": user})
	// return c.Status(fiber.StatusOK).JSON(fiber.Map{"status": "success", "user": user})
	return c.Status(fiber.StatusOK).JSON(response)
}

//func GetUser(c *fiber.Ctx) error {
//	userId := c.Locals("userId")
//	// userPersonalBests, err := MTLastResult("NjYwYTc1MWRhODM0MzBhYTFhYjlmOTcwLnZoWnpxMUdPX1pxZG1tZTEwTnJfbzF3b3Y5bWRRd0dh")
//	// if err != nil {
//	// 	return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "fail", "message": "internal server error"})
//	// }
//	// fmt.Println(time.Unix(userPersonalBests.Data.Timestamp/1000, 0).Date())
//	// fmt.Println(time.Now().Date())
//
//	var user models.GetUserSchema
//	//result := initializers.DB.Table("users").First(&user, "id = ?", userId)
//	result := initializers.DB.Table("users").
//		Select("name, email, phone_number, created_at, skills, branch, year, about").
//		Where("id = ?", userId).
//		First(&user)
//	fmt.Printf("Queried User: %+v\n", user)
//
//	if result.Error != nil {
//		if result.Error == gorm.ErrRecordNotFound {
//			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"status": "fail", "message": "User not found"})
//		} else if strings.Contains(result.Error.Error(), "invalid input syntax") {
//			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"status": "fail", "message": "invalid user id"})
//		}
//		return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{"status": "fail", "message": result.Error.Error()})
//	}
//
//	return c.Status(fiber.StatusOK).JSON(fiber.Map{"status": "success", "user": user})
//}

func DeleteUser(c *fiber.Ctx) error {
	userId := c.Locals("userId")
	result := initializers.DB.Delete(models.User{}, "id = ?", userId)

	if result.RowsAffected == 0 {
		return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"status": "fail", "message": "No note with that Id exists"})
	} else if result.Error != nil {
		return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{"status": "error", "message": result.Error})
	}

	return c.SendStatus(fiber.StatusNoContent)
}

func UpdateUser(c *fiber.Ctx) error {
	userId := c.Locals("userId")

	payload := new(models.UpdateUserSchema)
	if err := c.BodyParser(payload); err != nil {
		return c.Status(fiber.StatusBadRequest).JSON(fiber.Map{"status": "failed", "message": err.Error()})
	}

	errors := models.ValidateStruct(payload)
	if errors != nil {
		return c.Status(fiber.StatusBadRequest).JSON(errors)
	}

	var user models.User
	result := initializers.DB.First(&user, "id = ?", userId)
	if err := result.Error; err != nil {
		if err == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"status": "fail", "message": "user not found"})
		} else if strings.Contains(result.Error.Error(), "invalid input syntax") {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"status": "fail", "message": "invalid user id"})
		}
		return c.Status(fiber.StatusBadGateway).JSON(fiber.Map{"status": "fail", "message": err.Error()})
	}

	// Ensure the column exists before attempting to update
	if !initializers.DB.Migrator().HasColumn(&models.User{}, "monkey_type_api_key") {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "failed", "message": "monkeyTypeApiKey column does not exist"})
	}

	updates := make(map[string]interface{})
	fmt.Printf("Skills payload: %v\n", payload.Skills)

	if payload.Name != "" {
		updates["name"] = payload.Name
	}
	if payload.PhoneNumber != 0 {
		updates["phoneNumber"] = payload.PhoneNumber
	}
	if payload.Email != "" {
		updates["email"] = payload.Email
	}
	if payload.MonkeyTypeApiKey != "" {
		updates["monkey_type_api_key"] = payload.MonkeyTypeApiKey
	}
	if len(payload.Skills) > 0 {
		updates["skills"] = pq.StringArray(payload.Skills)
	}
	if payload.Branch != "" {
		updates["branch"] = payload.Branch
	}
	if payload.Year > 0 {
		updates["year"] = payload.Year
	}
	if payload.About != "" {
		updates["about"] = payload.About
	}
	if payload.Password != "" {
		hashedPassword, err := utils.HashPassword(payload.Password)
		if err != nil {
			return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "failed", "message": "failed updating user"})
		}
		updates["password"] = hashedPassword
	}

	updates["updated_at"] = time.Now()
	initializers.DB.Model(&user).Updates(updates)

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"status": "success", "message": "user has been updated"})
}

func CheckOnBoarding(c *fiber.Ctx) error {
	userId := c.Locals("userId")

	var user models.User
	// just fetch the `showOnBoarding` field
	result := initializers.DB.Table("users").
		Select("show_on_boarding").
		Where("id = ?", userId).
		First(&user)	

	if result.Error != nil {
		if result.Error == gorm.ErrRecordNotFound {
			return c.Status(fiber.StatusNotFound).JSON(fiber.Map{"status": "fail", "message": "User not found"})
		}
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "fail", "message": result.Error.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"status": "success", "showOnBoarding": user.ShowOnBoarding})
}

func SetOnBoardingFalse(c *fiber.Ctx) error {
	userId := c.Locals("userId")

	result := initializers.DB.Model(&models.User{}).Where("id = ?", userId).Update("show_on_boarding", false)
	if result.Error != nil {
		return c.Status(fiber.StatusInternalServerError).JSON(fiber.Map{"status": "fail", "message": result.Error.Error()})
	}

	return c.Status(fiber.StatusOK).JSON(fiber.Map{"status": "success", "message": "showOnBoarding has been set to false"})
}