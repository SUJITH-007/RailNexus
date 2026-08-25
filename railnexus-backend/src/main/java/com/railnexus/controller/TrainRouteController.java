package com.railnexus.controller;

import com.railnexus.dto.TrainRouteRequest;
import com.railnexus.dto.TrainRouteResponse;
import com.railnexus.service.TrainRouteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.railnexus.dto.TrainSearchResponse;

import java.util.List;

@RestController
@RequestMapping("/api/train-routes")
public class TrainRouteController {

    private final TrainRouteService trainRouteService;

    public TrainRouteController(TrainRouteService trainRouteService) {
        this.trainRouteService = trainRouteService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TrainRouteResponse createRoute(
            @Valid @RequestBody TrainRouteRequest request
    ) {
        return trainRouteService.createRoute(request);
    }

    @GetMapping("/train/{trainId}")
    public List<TrainRouteResponse> getRoutesByTrain(
            @PathVariable Long trainId
    ) {
        return trainRouteService.getRoutesByTrain(trainId);
    }

    @GetMapping("/search")
    public List<TrainSearchResponse> searchTrainsBetweenStations(
            @RequestParam Long fromStationId,
            @RequestParam Long toStationId
    ) {
        return trainRouteService.searchTrainsBetweenStations(
                fromStationId,
                toStationId
        );
    }
}