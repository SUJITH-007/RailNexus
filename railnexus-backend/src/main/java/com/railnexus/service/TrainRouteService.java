package com.railnexus.service;

import com.railnexus.dto.TrainDetailsResponse;
import com.railnexus.dto.TrainRouteRequest;
import com.railnexus.dto.TrainRouteResponse;
import com.railnexus.dto.TrainSearchResponse;
import java.time.LocalDate;
import java.util.List;

public interface TrainRouteService {

    TrainRouteResponse createRoute(TrainRouteRequest request);

    TrainRouteResponse updateRoute(
            Long routeId,
            TrainRouteRequest request
    );

    void updateTrainJourneyDate(
            Long trainId,
            LocalDate journeyDate
    );

    void deleteRoute(Long routeId);

    List<TrainRouteResponse> getRoutesByTrain(Long trainId);

    List<TrainSearchResponse> searchTrainsBetweenStations(
            Long fromStationId,
            Long toStationId,
            LocalDate journeyDate
    );

    TrainDetailsResponse getTrainDetailsByDate(
            Long trainId,
            LocalDate journeyDate
    );
}