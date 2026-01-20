package com.urlshortener.model;

import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Pattern;
import lombok.Data;

/**
 * Shorten Request Model
 */
@Data
public class ShortenRequest {

    @NotNull(message = "Long URL cannot be null")
    @NotEmpty(message = "Long URL cannot be empty")
    @Pattern(regexp = "^(https?:\\/\\/).*")
    private String longUrl;

}