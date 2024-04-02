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

type Response struct {
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

type MTLeaderBoard struct {
	Rank  int    `json:"rank"`
	Name  string `json:"name"`
	Score int    `json:"score"`
}
