package com.railnexus.dto;

import com.railnexus.entity.BerthType;

public record SeatRecommendationResponse(
        Long seatId,
        Integer seatNumber,
        Integer position,
        String coachNumber,
        Long coachId,
        Long trainId,
        String trainNumber,
        BerthType berthType
) {
}