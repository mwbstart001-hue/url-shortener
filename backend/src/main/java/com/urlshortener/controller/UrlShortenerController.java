package com.urlshortener.controller;

import com.urlshortener.model.ApiResponse;
import com.urlshortener.model.ShortenRequest;
import com.urlshortener.model.UrlMapping;
import com.urlshortener.service.UrlShortenerService;
import jakarta.validation.Valid;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.view.RedirectView;

import java.util.Optional;

/**
 * URL Shortener Controller
 */
@RestController
public class UrlShortenerController {

    @Autowired
    private UrlShortenerService urlShortenerService;

    /**
     * Generate short URL
     * @param request Shorten request containing long URL
     * @return API response with short URL
     */
    @PostMapping("/api/shorten")
    public ResponseEntity<ApiResponse<Void>> generateShortUrl(@Valid @RequestBody ShortenRequest request) {
        try {
            UrlMapping urlMapping = urlShortenerService.generateShortUrl(request.getLongUrl());
            String shortUrl = urlShortenerService.getFullShortUrl(urlMapping.getShortCode());
            return ResponseEntity.ok(ApiResponse.success(urlMapping.getShortCode(), shortUrl));
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR)
                    .body(ApiResponse.error("Failed to generate short URL: " + e.getMessage()));
        }
    }

    /**
     * Redirect short URL to long URL
     * @param shortCode Short code
     * @return Redirect view to long URL
     */
    @GetMapping("/s/{shortCode}")
    public RedirectView redirectToLongUrl(@PathVariable String shortCode) {
        UrlMapping urlMapping = urlShortenerService.getUrlMappingOrThrow(shortCode);
        // Increment click count asynchronously
        new Thread(() -> urlShortenerService.incrementClickCount(urlMapping)).start();
        return new RedirectView(urlMapping.getLongUrl(), true);
    }

    /**
     * Get URL mapping information
     * @param shortCode Short code
     * @return API response with URL mapping details
     */
    @GetMapping("/api/info/{shortCode}")
    public ResponseEntity<ApiResponse<Void>> getUrlMappingInfo(@PathVariable String shortCode) {
        UrlMapping urlMapping = urlShortenerService.getUrlMappingOrThrow(shortCode);
        return ResponseEntity.ok(ApiResponse.successInfo(urlMapping.getLongUrl(), urlMapping.getCreateTime()));
    }

}