package com.railnexus.service;

import com.railnexus.entity.Station;
import com.railnexus.exception.ResourceNotFoundException;
import com.railnexus.repository.StationRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class StationService {

    private final StationRepository stationRepository;

    public StationService(StationRepository stationRepository) {
        this.stationRepository = stationRepository;
    }

    public Station createStation(Station station) {

        if (stationRepository.existsByCode(station.getCode())) {
            throw new RuntimeException("Station code already exists");
        }

        return stationRepository.save(station);
    }

    public List<Station> getAllStations() {
        return stationRepository.findAll();
    }

    public Station getStationByCode(String code) {
        return stationRepository.findByCode(code)
                .orElseThrow(() ->
                        new ResourceNotFoundException("Station not found with code: " + code)
                );
    }
}