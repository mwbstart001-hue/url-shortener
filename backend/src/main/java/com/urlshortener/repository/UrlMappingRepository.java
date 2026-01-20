package com.urlshortener.repository;

import com.urlshortener.model.UrlMapping;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.Optional;

/**
 * URL Mapping Repository Interface
 */
@Repository
public interface UrlMappingRepository extends JpaRepository<UrlMapping, Long> {

    /**
     * Find URL mapping by short code
     * @param shortCode Short code
     * @return Optional UrlMapping
     */
    Optional<UrlMapping> findByShortCode(String shortCode);

    /**
     * Check if short code exists
     * @param shortCode Short code
     * @return Boolean
     */
    Boolean existsByShortCode(String shortCode);

}