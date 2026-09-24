package com.railnexus.dto;

import com.railnexus.entity.BerthType;

public record SeatResponse(

        Long id,

        Long coachId,
        String coachNumber,

        Long trainId,
        String trainNumber,

        Integer seatNumber,
        BerthType berthType

) {
}