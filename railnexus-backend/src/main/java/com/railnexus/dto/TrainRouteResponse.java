package com.railnexus.dto;

import java.time.LocalDate;
import java.time.LocalTime;

public record TrainRouteResponse(

        Long id,

        Long trainId,
        String trainNumber,

        Long stationId,
        String stationCode,
        String stationName,

        Integer stopOrder,

        LocalDate journeyDate,

        LocalTime arrivalTime,
        LocalTime departureTime,

        Double distance
) {
}