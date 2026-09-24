package com.railnexus.controller;

import com.railnexus.dto.TrainRouteRequest;
import com.railnexus.dto.TrainRouteResponse;
import com.railnexus.dto.TrainSearchResponse;
import com.railnexus.service.TrainRouteService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin/train-routes")
public class TrainRouteController {

    private final TrainRouteService trainRouteService;

    public TrainRouteController(
            TrainRouteService trainRouteService
    ) {
        this.trainRouteService = trainRouteService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TrainRouteResponse createRoute(
            @Valid @RequestBody TrainRouteRequest request
    ) {
        return trainRouteService.createRoute(request);
    }

    @PutMapping("/{routeId}")
    public TrainRouteResponse updateRoute(
            @PathVariable Long routeId,
            @Valid @RequestBody TrainRouteRequest request
    ) {
        return trainRouteService.updateRoute(
                routeId,
                request
        );
    }

    @PutMapping("/train/{trainId}/journey-date")
    public void updateTrainJourneyDate(
            @PathVariable Long trainId,
            @RequestParam LocalDate journeyDate
    ) {
        trainRouteService.updateTrainJourneyDate(
                trainId,
                journeyDate
        );
    }

    @DeleteMapping("/{routeId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteRoute(
            @PathVariable Long routeId
    ) {
        trainRouteService.deleteRoute(routeId);
    }

    @GetMapping("/train/{trainId}")
    public List<TrainRouteResponse> getRoutesByTrain(
            @PathVariable Long trainId
    ) {
        return trainRouteService.getRoutesByTrain(trainId);
    }

}