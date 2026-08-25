package com.railnexus.controller;

import com.railnexus.entity.Station;
import com.railnexus.service.StationService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/stations")
public class StationController {

    private final StationService stationService;

    public StationController(StationService stationService) {
        this.stationService = stationService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public Station createStation(@RequestBody Station station) {
        return stationService.createStation(station);
    }

    @GetMapping
    public List<Station> getAllStations() {
        return stationService.getAllStations();
    }

    @GetMapping("/{code}")
    public Station getStationByCode(@PathVariable String code) {
        return stationService.getStationByCode(code);
    }
}