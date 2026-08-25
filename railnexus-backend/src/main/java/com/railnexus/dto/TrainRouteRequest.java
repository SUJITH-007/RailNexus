package com.railnexus.dto;

import jakarta.validation.constraints.NotNull;
import jakarta.validation.constraints.Positive;
import jakarta.validation.constraints.PositiveOrZero;

import java.time.LocalTime;

public record TrainRouteRequest(

        @NotNull
        Long trainId,

        @NotNull
        Long stationId,

        @NotNull
        @Positive
        Integer stopOrder,

        LocalTime arrivalTime,

        LocalTime departureTime,

        @NotNull
        @PositiveOrZero
        Double distance
) {
}