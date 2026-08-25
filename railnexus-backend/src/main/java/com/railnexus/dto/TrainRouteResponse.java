package com.railnexus.dto;

import java.time.LocalTime;

public record TrainRouteResponse(

        Long id,

        Long trainId,
        String trainNumber,

        Long stationId,
        String stationCode,
        String stationName,

        Integer stopOrder,

        LocalTime arrivalTime,
        LocalTime departureTime,

        Double distance
) {
}