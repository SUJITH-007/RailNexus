package com.railnexus.dto;

import com.railnexus.entity.BerthType;
import com.railnexus.entity.SeatStatus;

public record AdminSeatStatusResponse(
        Long id,
        Long coachId,
        String coachNumber,
        Long trainId,
        String trainNumber,
        Integer seatNumber,
        Integer position,
        BerthType berthType,
        SeatStatus status,
        Long blockId,
        String blockReason
) {
}