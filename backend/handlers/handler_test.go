package handlers

import (
	"bytes"
	"encoding/json"
	"net/http"
	"net/http/httptest"
	"testing"
	"url-shortener/models"
	"url-shortener/storage"

	"github.com/gin-gonic/gin"
	"github.com/stretchr/testify/assert"
	"gorm.io/driver/sqlite"
	"gorm.io/gorm"
)

func setupTestDB() *gorm.DB {
	db, _ := gorm.Open(sqlite.Open("file::memory:?cache=shared"), &gorm.Config{})
	db.AutoMigrate(&models.URL{})
	return db
}

func TestCreateShortURL(t *testing.T) {
	gin.SetMode(gin.TestMode)
	db := setupTestDB()
	redisClient := &storage.RedisClient{}
	handler := NewHandler(db, redisClient)

	router := gin.Default()
	router.POST("/api/shorten", handler.CreateShortURL)

	tests := []struct {
		name       string
		body       map[string]string
		wantStatus int
		wantCode   int
	}{
		{
			name:       "Valid URL",
			body:       map[string]string{"url": "https://example.com/very/long/url"},
			wantStatus: http.StatusOK,
			wantCode:   200,
		},
		{
			name:       "Empty URL",
			body:       map[string]string{"url": ""},
			wantStatus: http.StatusBadRequest,
			wantCode:   400,
		},
		{
			name:       "Invalid URL",
			body:       map[string]string{"url": "not-a-valid-url"},
			wantStatus: http.StatusBadRequest,
			wantCode:   400,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			body, _ := json.Marshal(tt.body)
			req, _ := http.NewRequest("POST", "/api/shorten", bytes.NewBuffer(body))
			req.Header.Set("Content-Type", "application/json")
			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			assert.Equal(t, tt.wantStatus, w.Code)

			var response models.APIResponse
			json.Unmarshal(w.Body.Bytes(), &response)
			assert.Equal(t, tt.wantCode, response.Code)
		})
	}
}

func TestRedirectURL(t *testing.T) {
	gin.SetMode(gin.TestMode)
	db := setupTestDB()
	redisClient := &storage.RedisClient{}
	handler := NewHandler(db, redisClient)

	// 先创建一个短链
	url := models.URL{
		ShortCode:   "abc123",
		OriginalURL: "https://example.com",
		VisitCount:  0,
	}
	db.Create(&url)

	router := gin.Default()
	router.GET("/:shortCode", handler.RedirectURL)

	tests := []struct {
		name       string
		shortCode  string
		wantStatus int
	}{
		{
			name:       "Existing Short Code",
			shortCode:  "abc123",
			wantStatus: http.StatusFound,
		},
		{
			name:       "Non-existing Short Code",
			shortCode:  "xyz789",
			wantStatus: http.StatusNotFound,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			req, _ := http.NewRequest("GET", "/"+tt.shortCode, nil)
			w := httptest.NewRecorder()
			router.ServeHTTP(w, req)

			assert.Equal(t, tt.wantStatus, w.Code)
		})
	}
}

func TestGetStats(t *testing.T) {
	gin.SetMode(gin.TestMode)
	db := setupTestDB()
	redisClient := &storage.RedisClient{}
	handler := NewHandler(db, redisClient)

	// 创建一些测试数据
	urls := []models.URL{
		{ShortCode: "abc123", OriginalURL: "https://example1.com", VisitCount: 10},
		{ShortCode: "def456", OriginalURL: "https://example2.com", VisitCount: 20},
		{ShortCode: "ghi789", OriginalURL: "https://example3.com", VisitCount: 30},
	}
	for _, url := range urls {
		db.Create(&url)
	}

	router := gin.Default()
	router.GET("/api/stats", handler.GetStats)

	req, _ := http.NewRequest("GET", "/api/stats", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.APIResponse
	json.Unmarshal(w.Body.Bytes(), &response)
	assert.Equal(t, 200, response.Code)

	stats, ok := response.Data.(map[string]interface{})
	assert.True(t, ok)
	assert.Equal(t, float64(3), stats["total_urls"])
	assert.Equal(t, float64(60), stats["total_visits"])
}

func TestGetURLs(t *testing.T) {
	gin.SetMode(gin.TestMode)
	db := setupTestDB()
	redisClient := &storage.RedisClient{}
	handler := NewHandler(db, redisClient)

	// 创建测试数据
	url := models.URL{
		ShortCode:   "test12",
		OriginalURL: "https://test.com",
		VisitCount:  5,
	}
	db.Create(&url)

	router := gin.Default()
	router.GET("/api/urls", handler.GetURLs)

	req, _ := http.NewRequest("GET", "/api/urls", nil)
	w := httptest.NewRecorder()
	router.ServeHTTP(w, req)

	assert.Equal(t, http.StatusOK, w.Code)

	var response models.APIResponse
	json.Unmarshal(w.Body.Bytes(), &response)
	assert.Equal(t, 200, response.Code)
}
