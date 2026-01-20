package com.urlshortener.service;

import com.urlshortener.exception.UrlNotFoundException;
import com.urlshortener.model.UrlMapping;
import com.urlshortener.repository.UrlMappingRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.cache.annotation.CachePut;
import org.springframework.stereotype.Service;

import java.util.Optional;

/**
 * URL Shortener Service
 */
@Service
public class UrlShortenerService {

    @Autowired
    private UrlMappingRepository urlMappingRepository;

    @Autowired
    private ShortCodeGenerator shortCodeGenerator;

    @Value("${urlshortener.base-url}")
    private String baseUrl;

    /**
     * Generate a short URL for the given long URL
     * @param longUrl Original long URL
     * @return Generated short URL
     */
    public UrlMapping generateShortUrl(String longUrl) {
        String shortCode;
        boolean isUnique;

        // Generate unique short code
        do {
            shortCode = shortCodeGenerator.generateShortCode();
            isUnique = !urlMappingRepository.existsByShortCode(shortCode);
        } while (!isUnique);

        // Create and save URL mapping
        UrlMapping urlMapping = new UrlMapping();
        urlMapping.setShortCode(shortCode);
        urlMapping.setLongUrl(longUrl);

        return urlMappingRepository.save(urlMapping);
    }

    /**
     * Get long URL by short code
     * @param shortCode Short code
     * @return Optional UrlMapping
     */
    @Cacheable(value = "urlMappings", key = "#shortCode", unless = "#result == null")
    public Optional<UrlMapping> getUrlMappingByShortCode(String shortCode) {
        return urlMappingRepository.findByShortCode(shortCode);
    }

    /**
     * Increment click count for a short URL
     * @param urlMapping URL mapping
     * @return Updated URL mapping
     */
    @CachePut(value = "urlMappings", key = "#urlMapping.shortCode")
    public UrlMapping incrementClickCount(UrlMapping urlMapping) {
        urlMapping.setClickCount(urlMapping.getClickCount() + 1);
        return urlMappingRepository.save(urlMapping);
    }

    /**
     * Get full short URL
     * @param shortCode Short code
     * @return Full short URL
     */
    public String getFullShortUrl(String shortCode) {
        return baseUrl + "/s/" + shortCode;
    }

    /**
     * Get URL mapping by short code or throw exception if not found
     * @param shortCode Short code
     * @return UrlMapping object
     * @throws UrlNotFoundException if short code not found
     */
    public UrlMapping getUrlMappingOrThrow(String shortCode) {
        return getUrlMappingByShortCode(shortCode)
                .orElseThrow(() -> new UrlNotFoundException("Short URL not found for code: " + shortCode));
    }

}