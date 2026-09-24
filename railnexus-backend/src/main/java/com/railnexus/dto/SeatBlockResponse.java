package com.railnexus.dto;

import java.time.LocalDate;

public record SeatBlockResponse(
        Long id,
        Long seatId,
        Integer seatNumber,
        String coachNumber,
        LocalDate journeyDate,
        String reason,
        Boolean active
) {}
