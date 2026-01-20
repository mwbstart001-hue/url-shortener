package com.urlshortener.exception;

public class UrlNotFoundException extends RuntimeException {
    public UrlNotFoundException(String message) {
        super(message);
    }
    
    public UrlNotFoundException() {
        super("URL not found");
    }
}