package com.railnexus.dto;

import java.time.LocalDateTime;

public record TrainResponse(
        Long id,
        String number,
        String name,
        String type,
        String source,
        String destination,
        LocalDateTime createdAt
) {
}