package com.railnexus.dto;

import com.railnexus.entity.BerthType;
import com.railnexus.entity.SeatStatus;

public record SeatAvailabilityResponse(
        Long id,
        Long coachId,
        String coachNumber,
        Long trainId,
        String trainNumber,
        Integer seatNumber,
        Integer position,
        BerthType berthType,
        SeatStatus status
) {
}