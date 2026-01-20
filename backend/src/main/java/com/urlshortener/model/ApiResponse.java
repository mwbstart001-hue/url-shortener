package com.urlshortener.model;

import com.fasterxml.jackson.annotation.JsonInclude;
import lombok.Data;

import java.time.LocalDateTime;
import java.time.format.DateTimeFormatter;

/**
 * API Response Model
 */
@Data
@JsonInclude(JsonInclude.Include.NON_NULL)
public class ApiResponse<T> {

    private boolean success;
    private String shortCode;
    private String shortUrl;
    private String longUrl;
    private String createTime;
    private String message;
    private T data;

    // Success response for short URL generation
    public static ApiResponse<Void> success(String shortCode, String shortUrl) {
        ApiResponse<Void> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setShortCode(shortCode);
        response.setShortUrl(shortUrl);
        return response;
    }

    // Success response for URL mapping info
    public static ApiResponse<Void> successInfo(String longUrl, LocalDateTime createTime) {
        ApiResponse<Void> response = new ApiResponse<>();
        response.setSuccess(true);
        response.setLongUrl(longUrl);
        response.setCreateTime(createTime.format(DateTimeFormatter.ofPattern("yyyy-MM-dd HH:mm:ss")));
        return response;
    }

    // Error response
    public static <T> ApiResponse<T> error(String message) {
        ApiResponse<T> response = new ApiResponse<>();
        response.setSuccess(false);
        response.setMessage(message);
        return response;
    }

}