package com.railnexus.dto;

public record ClassAvailabilityResponse(
        String classCode,
        String className,
        int availableSeats
) {
}