package com.urlshortener.service;

import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Component;

import java.security.SecureRandom;
import java.util.Random;

/**
 * Short Code Generator
 */
@Component
public class ShortCodeGenerator {

    @Value("${urlshortener.shortcode.length}")
    private int shortCodeLength;

    @Value("${urlshortener.shortcode.charset}")
    private String charset;

    private final Random random;

    public ShortCodeGenerator() {
        this.random = new SecureRandom();
    }

    /**
     * Generate a random short code
     * @return Generated short code
     */
    public String generateShortCode() {
        StringBuilder sb = new StringBuilder(shortCodeLength);
        int charsetLength = charset.length();

        for (int i = 0; i < shortCodeLength; i++) {
            int randomIndex = random.nextInt(charsetLength);
            sb.append(charset.charAt(randomIndex));
        }

        return sb.toString();
    }

}