package utils

import (
	"testing"

	"github.com/stretchr/testify/assert"
)

func TestGenerateShortCode(t *testing.T) {
	tests := []struct {
		name string
		url  string
	}{
		{
			name: "Simple URL",
			url:  "https://example.com",
		},
		{
			name: "Long URL with path",
			url:  "https://example.com/very/long/path/to/something",
		},
		{
			name: "URL with query params",
			url:  "https://example.com?foo=bar&baz=qux",
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			code := GenerateShortCode(tt.url)
			
			// 验证生成的短码长度为6
			assert.Equal(t, 6, len(code))
			
			// 验证短码只包含允许的字符
			for _, c := range code {
				assert.Contains(t, alphabet, string(c))
			}
		})
	}
}

func TestGenerateShortCodeUniqueness(t *testing.T) {
	// 测试多次生成不同的短码
	codes := make(map[string]bool)
	for i := 0; i < 100; i++ {
		code := GenerateShortCode("https://example.com/" + string(rune(i)))
		codes[code] = true
	}
	
	// 由于使用了时间戳，应该生成不同的短码
	assert.Greater(t, len(codes), 90)
}

func TestGenerateRandomCode(t *testing.T) {
	tests := []struct {
		name   string
		length int
	}{
		{
			name:   "Length 4",
			length: 4,
		},
		{
			name:   "Length 6",
			length: 6,
		},
		{
			name:   "Length 8",
			length: 8,
		},
	}

	for _, tt := range tests {
		t.Run(tt.name, func(t *testing.T) {
			code := GenerateRandomCode(tt.length)
			
			// 验证长度
			assert.Equal(t, tt.length, len(code))
			
			// 验证只包含允许的字符
			for _, c := range code {
				assert.Contains(t, alphabet, string(c))
			}
		})
	}
}

func BenchmarkGenerateShortCode(b *testing.B) {
	for i := 0; i < b.N; i++ {
		GenerateShortCode("https://example.com/benchmark")
	}
}

func BenchmarkGenerateRandomCode(b *testing.B) {
	for i := 0; i < b.N; i++ {
		GenerateRandomCode(6)
	}
}
