package com.railnexus.dto;

import com.railnexus.entity.BerthType;
import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;

public record SeatRequest(

        @NotNull
        Long coachId,

        @NotNull
        @Positive
        Integer seatNumber,

        @NotNull
        BerthType berthType

) {
}