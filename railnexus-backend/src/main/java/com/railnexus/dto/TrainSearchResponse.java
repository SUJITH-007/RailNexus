package com.railnexus.dto;

import java.time.LocalTime;
import java.util.List;

public record TrainSearchResponse(

        Long trainId,
        String trainNumber,
        String trainName,
        String trainType,

        Long fromStationId,
        String fromStationCode,
        String fromStationName,
        LocalTime departureTime,

        Long toStationId,
        String toStationCode,
        String toStationName,
        LocalTime arrivalTime,

        Double distance,

        List<String> classes

) {
}