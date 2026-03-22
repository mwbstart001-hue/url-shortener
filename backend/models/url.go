package models

import (
	"time"
)

type URL struct {
	ID          uint      `json:"id" gorm:"primaryKey"`
	ShortCode   string    `json:"short_code" gorm:"uniqueIndex;size:10"`
	OriginalURL string    `json:"original_url" gorm:"size:2048"`
	VisitCount  int64     `json:"visit_count" gorm:"default:0"`
	CreatedAt   time.Time `json:"created_at"`
	UpdatedAt   time.Time `json:"updated_at"`
}

type URLResponse struct {
	ShortCode   string    `json:"short_code"`
	OriginalURL string    `json:"original_url"`
	ShortURL    string    `json:"short_url"`
	VisitCount  int64     `json:"visit_count"`
	CreatedAt   time.Time `json:"created_at"`
}

type CreateURLRequest struct {
	URL string `json:"url" binding:"required,url"`
}

type APIResponse struct {
	Code    int         `json:"code"`
	Message string      `json:"message"`
	Data    interface{} `json:"data,omitempty"`
}

type StatsResponse struct {
	TotalURLs      int64 `json:"total_urls"`
	TotalVisits    int64 `json:"total_visits"`
	TodayNewURLs   int64 `json:"today_new_urls"`
	TodayTotalVisits int64 `json:"today_total_visits"`
}
