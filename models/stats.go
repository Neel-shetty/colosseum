package models

import (
	"time"

	"github.com/google/uuid"
)

type ScoreType string

const (
	TypingScore   ScoreType = "Typing"
	LeetcodeScore ScoreType = "Leetcode"
	GithubScore   ScoreType = "GitHub"
)

type Score struct {
	ID        int
	UserID    uuid.UUID `gorm:"foreignKey:UserID,references:User(ID)"`
	Score     int
	CreatedAt time.Time
	Type      ScoreType
}

type MTPersonalBestResponse struct {
	Message string                       `json:"message"`
	Data    map[string][]MTPersonalBests `json:"data"`
}

type MTPersonalBests struct {
	Accuracy    float64 `json:"acc"`
	Consistency float64 `json:"consistency"`
	Difficulty  string  `json:"difficulty"`
	LazyMode    bool    `json:"lazyMode"`
	Language    string  `json:"language"`
	Punctuation bool    `json:"punctuation"`
	Raw         float64 `json:"raw"`
	WordsPerMin float64 `json:"wpm"`
	Timestamp   int64   `json:"timestamp"`
	Numbers     bool    `json:"numbers,omitempty"`
}

type MTLastResultResponse struct {
	Message string `json:"message"`
	Data    struct {
		ID             string  `json:"_id"`
		WPM            float64 `json:"wpm"`
		RawWPM         float64 `json:"rawWpm"`
		CharStats      []int   `json:"charStats"`
		Accuracy       float64 `json:"acc"`
		Mode           string  `json:"mode"`
		Mode2          string  `json:"mode2"`
		Timestamp      int64   `json:"timestamp"`
		TestDuration   float64 `json:"testDuration"`
		Consistency    float64 `json:"consistency"`
		KeyConsistency float64 `json:"keyConsistency"`
		ChartData      struct {
			WPM []int `json:"wpm"`
			Raw []int `json:"raw"`
			Err []int `json:"err"`
		} `json:"chartData"`
		KeySpacingStats struct {
			Average float64 `json:"average"`
			SD      float64 `json:"sd"`
		} `json:"keySpacingStats"`
		KeyDurationStats struct {
			Average float64 `json:"average"`
			SD      float64 `json:"sd"`
		} `json:"keyDurationStats"`
		Name string `json:"name"`
	} `json:"data"`
}

type MTLeaderBoard struct {
	Rank  int    `json:"rank"`
	Name  string `json:"name"`
	Score int    `json:"score"`
}
