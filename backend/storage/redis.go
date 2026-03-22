package storage

import (
	"context"
	"time"

	"github.com/redis/go-redis/v9"
)

type RedisClient struct {
	client *redis.Client
	ctx    context.Context
}

func NewRedisClient(addr, password string) *RedisClient {
	client := redis.NewClient(&redis.Options{
		Addr:     addr,
		Password: password,
		DB:       0,
	})

	ctx := context.Background()

	if err := client.Ping(ctx).Err(); err != nil {
		panic(err)
	}

	return &RedisClient{
		client: client,
		ctx:    ctx,
	}
}

func (r *RedisClient) Get(key string) (string, error) {
	return r.client.Get(r.ctx, key).Result()
}

func (r *RedisClient) Set(key, value string, expiration time.Duration) error {
	return r.client.Set(r.ctx, key, value, expiration).Err()
}

func (r *RedisClient) Incr(key string) (int64, error) {
	return r.client.Incr(r.ctx, key).Result()
}

func (r *RedisClient) Expire(key string, expiration time.Duration) error {
	return r.client.Expire(r.ctx, key, expiration).Err()
}

func (r *RedisClient) Exists(keys ...string) (int64, error) {
	return r.client.Exists(r.ctx, keys...).Result()
}

func (r *RedisClient) Close() error {
	return r.client.Close()
}
