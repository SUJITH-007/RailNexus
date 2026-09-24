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

        validateStation(station);

        String code = station.getCode().trim().toUpperCase();

        if (stationRepository.existsByCode(code)) {
            throw new IllegalArgumentException(
                    "Station code already exists: " + code
            );
        }

        station.setCode(code);
        station.setName(station.getName().trim());
        station.setCity(station.getCity().trim());
        station.setState(station.getState().trim());

        return stationRepository.save(station);
    }

    public List<Station> getAllStations() {
        return stationRepository.findAll();
    }

    public Station getStationByCode(String code) {

        String normalizedCode = code.trim().toUpperCase();

        return stationRepository.findByCode(normalizedCode)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Station not found with code: " + normalizedCode
                        )
                );
    }

    public List<Station> searchStations(String query) {

        if (query == null || query.isBlank()) {
            return List.of();
        }

        String searchQuery = query.trim();

        return stationRepository
                .findTop10ByNameContainingIgnoreCaseOrCityContainingIgnoreCaseOrCodeContainingIgnoreCase(
                        searchQuery,
                        searchQuery,
                        searchQuery
                );
    }

    public Station updateStation(String code, Station station) {

        validateStation(station);

        String existingCode = code.trim().toUpperCase();
        String newCode = station.getCode().trim().toUpperCase();

        Station existingStation = stationRepository.findByCode(existingCode)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Station not found with code: " + existingCode
                        )
                );

        if (!existingCode.equals(newCode)
                && stationRepository.existsByCode(newCode)) {

            throw new IllegalArgumentException(
                    "Station code already exists: " + newCode
            );
        }

        existingStation.setCode(newCode);
        existingStation.setName(station.getName().trim());
        existingStation.setCity(station.getCity().trim());
        existingStation.setState(station.getState().trim());

        return stationRepository.save(existingStation);
    }

    public void deleteStation(String code) {

        String normalizedCode = code.trim().toUpperCase();

        Station station = stationRepository.findByCode(normalizedCode)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Station not found with code: " + normalizedCode
                        )
                );

        stationRepository.delete(station);
    }

    private void validateStation(Station station) {

        if (station == null) {
            throw new IllegalArgumentException(
                    "Station data is required"
            );
        }

        if (station.getName() == null || station.getName().isBlank()) {
            throw new IllegalArgumentException(
                    "Station name is required"
            );
        }

        if (station.getCode() == null || station.getCode().isBlank()) {
            throw new IllegalArgumentException(
                    "Station code is required"
            );
        }

        if (station.getCity() == null || station.getCity().isBlank()) {
            throw new IllegalArgumentException(
                    "Station city is required"
            );
        }

        if (station.getState() == null || station.getState().isBlank()) {
            throw new IllegalArgumentException(
                    "Station state is required"
            );
        }
    }
}