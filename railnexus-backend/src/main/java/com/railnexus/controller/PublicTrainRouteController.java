package com.railnexus.controller;

import com.railnexus.dto.TrainDetailsResponse;
import com.railnexus.dto.TrainSearchResponse;
import com.railnexus.service.TrainRouteService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestParam;
import org.springframework.web.bind.annotation.RestController;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/train-routes")
@RequiredArgsConstructor
public class PublicTrainRouteController {

    private final TrainRouteService trainRouteService;

    @GetMapping("/search")
    public List<TrainSearchResponse> searchTrainsBetweenStations(
            @RequestParam Long fromStationId,
            @RequestParam Long toStationId,
            @RequestParam LocalDate journeyDate
    ) {
        return trainRouteService.searchTrainsBetweenStations(
                fromStationId,
                toStationId,
                journeyDate
        );
    }

    @GetMapping("/train/{trainId}")
    public TrainDetailsResponse getTrainDetailsByDate(
            @PathVariable Long trainId,
            @RequestParam LocalDate journeyDate
    ) {
        return trainRouteService.getTrainDetailsByDate(
                trainId,
                journeyDate
        );
    }
}