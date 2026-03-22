package handlers

import (
	"fmt"
	"net/http"
	"time"
	"url-shortener/models"
	"url-shortener/storage"
	"url-shortener/utils"

	"github.com/gin-gonic/gin"
	"gorm.io/gorm"
)

type Handler struct {
	db    *gorm.DB
	redis *storage.RedisClient
}

func NewHandler(db *gorm.DB, redis *storage.RedisClient) *Handler {
	return &Handler{
		db:    db,
		redis: redis,
	}
}

func (h *Handler) CreateShortURL(c *gin.Context) {
	var req models.CreateURLRequest
	if err := c.ShouldBindJSON(&req); err != nil {
		c.JSON(http.StatusBadRequest, models.APIResponse{
			Code:    400,
			Message: "Invalid request: " + err.Error(),
		})
		return
	}

	shortCode := utils.GenerateShortCode(req.URL)

	var existingURL models.URL
	if err := h.db.Where("short_code = ?", shortCode).First(&existingURL).Error; err == nil {
		c.JSON(http.StatusOK, models.APIResponse{
			Code:    200,
			Message: "Short URL already exists",
			Data: models.URLResponse{
				ShortCode:   existingURL.ShortCode,
				OriginalURL: existingURL.OriginalURL,
				ShortURL:    fmt.Sprintf("%s/%s", c.Request.Host, existingURL.ShortCode),
				VisitCount:  existingURL.VisitCount,
				CreatedAt:   existingURL.CreatedAt,
			},
		})
		return
	}

	url := models.URL{
		ShortCode:   shortCode,
		OriginalURL: req.URL,
		VisitCount:  0,
	}

	if err := h.db.Create(&url).Error; err != nil {
		c.JSON(http.StatusInternalServerError, models.APIResponse{
			Code:    500,
			Message: "Failed to create short URL: " + err.Error(),
		})
		return
	}

	h.redis.Set("url:"+shortCode, req.URL, 24*time.Hour)

	c.JSON(http.StatusOK, models.APIResponse{
		Code:    200,
		Message: "Short URL created successfully",
		Data: models.URLResponse{
			ShortCode:   url.ShortCode,
			OriginalURL: url.OriginalURL,
			ShortURL:    fmt.Sprintf("%s/%s", c.Request.Host, url.ShortCode),
			VisitCount:  url.VisitCount,
			CreatedAt:   url.CreatedAt,
		},
	})
}

func (h *Handler) RedirectURL(c *gin.Context) {
	shortCode := c.Param("shortCode")

	cachedURL, err := h.redis.Get("url:" + shortCode)
	if err == nil && cachedURL != "" {
		h.redis.Incr("visits:" + shortCode)
		h.redis.Incr("visits:today")
		c.Redirect(http.StatusFound, cachedURL)
		return
	}

	var url models.URL
	if err := h.db.Where("short_code = ?", shortCode).First(&url).Error; err != nil {
		c.JSON(http.StatusNotFound, models.APIResponse{
			Code:    404,
			Message: "Short URL not found",
		})
		return
	}

	h.redis.Set("url:"+shortCode, url.OriginalURL, 24*time.Hour)
	h.redis.Incr("visits:" + shortCode)
	h.redis.Incr("visits:today")

	h.db.Model(&url).UpdateColumn("visit_count", gorm.Expr("visit_count + ?", 1))

	c.Redirect(http.StatusFound, url.OriginalURL)
}

func (h *Handler) GetStats(c *gin.Context) {
	var totalURLs int64
	h.db.Model(&models.URL{}).Count(&totalURLs)

	var totalVisits int64
	h.db.Model(&models.URL{}).Select("COALESCE(SUM(visit_count), 0)").Scan(&totalVisits)

	today := time.Now().Format("2006-01-02")
	var todayNewURLs int64
	h.db.Model(&models.URL{}).Where("DATE(created_at) = ?", today).Count(&todayNewURLs)

	todayVisitsStr, _ := h.redis.Get("visits:today")
	var todayVisits int64
	if todayVisitsStr != "" {
		fmt.Sscanf(todayVisitsStr, "%d", &todayVisits)
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Code:    200,
		Message: "Stats retrieved successfully",
		Data: models.StatsResponse{
			TotalURLs:        totalURLs,
			TotalVisits:      totalVisits,
			TodayNewURLs:     todayNewURLs,
			TodayTotalVisits: todayVisits,
		},
	})
}

func (h *Handler) GetURLs(c *gin.Context) {
	var urls []models.URL
	h.db.Order("created_at DESC").Limit(10).Find(&urls)

	var responses []models.URLResponse
	for _, url := range urls {
		responses = append(responses, models.URLResponse{
			ShortCode:   url.ShortCode,
			OriginalURL: url.OriginalURL,
			ShortURL:    fmt.Sprintf("%s/%s", c.Request.Host, url.ShortCode),
			VisitCount:  url.VisitCount,
			CreatedAt:   url.CreatedAt,
		})
	}

	c.JSON(http.StatusOK, models.APIResponse{
		Code:    200,
		Message: "URLs retrieved successfully",
		Data:    responses,
	})
}
