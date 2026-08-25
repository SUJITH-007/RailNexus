package com.railnexus.service;

import com.railnexus.dto.TrainRouteRequest;
import com.railnexus.dto.TrainRouteResponse;
import com.railnexus.dto.TrainSearchResponse;

import java.util.List;

public interface TrainRouteService {

    TrainRouteResponse createRoute(TrainRouteRequest request);

    List<TrainRouteResponse> getRoutesByTrain(Long trainId);

    List<TrainSearchResponse> searchTrainsBetweenStations(
            Long fromStationId,
            Long toStationId
    );
}