package com.railnexus.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalDate;
import java.time.LocalTime;

public record TrainRouteRequest(

        @NotNull
        Long trainId,

        @NotNull
        Long stationId,

        @NotNull
        @Positive
        Integer stopOrder,

        @NotNull
        LocalDate journeyDate,

        LocalTime arrivalTime,

        LocalTime departureTime,

        @NotNull
        @PositiveOrZero
        Double distance
) {
}