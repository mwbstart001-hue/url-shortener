package config

import "os"

type Config struct {
	RedisAddr     string
	RedisPassword string
	DBPath        string
	ServerPort    string
}

func Load() *Config {
	return &Config{
		RedisAddr:     getEnv("REDIS_ADDR", "localhost:6379"),
		RedisPassword: getEnv("REDIS_PASSWORD", ""),
		DBPath:        getEnv("DB_PATH", "./urls.db"),
		ServerPort:    getEnv("SERVER_PORT", "8080"),
	}
}

func getEnv(key, defaultValue string) string {
	if value := os.Getenv(key); value != "" {
		return value
	}
	return defaultValue
}
