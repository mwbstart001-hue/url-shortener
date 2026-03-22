package utils

import (
	"crypto/sha256"
	"encoding/base64"
	"math/rand"
	"time"
)

const (
	alphabet = "abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789"
	base     = 62
	codeLength = 6
)

func init() {
	rand.Seed(time.Now().UnixNano())
}

func GenerateShortCode(url string) string {
	hash := sha256.Sum256([]byte(url + time.Now().String()))
	encoded := base64.URLEncoding.EncodeToString(hash[:])
	
	code := make([]byte, codeLength)
	for i := 0; i < codeLength; i++ {
		idx := int(encoded[i]) % base
		code[i] = alphabet[idx]
	}
	
	return string(code)
}

func GenerateRandomCode(length int) string {
	code := make([]byte, length)
	for i := 0; i < length; i++ {
		code[i] = alphabet[rand.Intn(base)]
	}
	return string(code)
}
