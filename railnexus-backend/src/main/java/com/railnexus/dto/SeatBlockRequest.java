package com.railnexus.dto;

import jakarta.validation.constraints.Future;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;

public record SeatBlockRequest(
        @NotNull Long seatId,

        @NotNull
        @FutureOrPresent
        LocalDate journeyDate,

        @NotBlank
        String reason
) {}