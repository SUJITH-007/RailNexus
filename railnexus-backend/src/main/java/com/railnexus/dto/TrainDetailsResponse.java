package com.railnexus.dto;

import java.util.List;

public record TrainDetailsResponse(
        Long trainId,
        String trainNumber,
        String trainName,
        String trainType,
        List<TrainRouteResponse> routes,
        List<TrainClassResponse> classes
) {
}