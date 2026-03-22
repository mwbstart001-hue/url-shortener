package main

import (
	"log"
	"os"
	"url-shortener/config"
	"url-shortener/handlers"
	"url-shortener/models"
	"url-shortener/storage"

	"github.com/gin-contrib/cors"
	"github.com/gin-gonic/gin"
)

func main() {
	cfg := config.Load()

	redisClient := storage.NewRedisClient(cfg.RedisAddr, cfg.RedisPassword)
	db := storage.NewSQLiteDB(cfg.DBPath)

	if err := db.AutoMigrate(&models.URL{}); err != nil {
		log.Fatalf("Failed to migrate database: %v", err)
	}

	r := gin.Default()

	corsConfig := cors.DefaultConfig()
	corsConfig.AllowOrigins = []string{"*"}
	corsConfig.AllowMethods = []string{"GET", "POST", "PUT", "DELETE", "OPTIONS"}
	corsConfig.AllowHeaders = []string{"Origin", "Content-Type", "Accept"}
	r.Use(cors.New(corsConfig))

	handler := handlers.NewHandler(db, redisClient)

	api := r.Group("/api")
	{
		api.POST("/shorten", handler.CreateShortURL)
		api.GET("/stats", handler.GetStats)
		api.GET("/urls", handler.GetURLs)
	}

	r.GET("/:shortCode", handler.RedirectURL)

	port := cfg.ServerPort
	if port == "" {
		port = "8080"
	}

	log.Printf("Server starting on port %s", port)
	if err := r.Run(":" + port); err != nil {
		log.Fatalf("Failed to start server: %v", err)
	}
}
