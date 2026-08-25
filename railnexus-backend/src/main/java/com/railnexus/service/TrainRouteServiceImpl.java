package com.railnexus.service;

import com.railnexus.dto.TrainRouteRequest;
import com.railnexus.dto.TrainRouteResponse;
import com.railnexus.entity.Station;
import com.railnexus.entity.Train;
import com.railnexus.entity.TrainRoute;
import com.railnexus.exception.ResourceNotFoundException;
import com.railnexus.repository.StationRepository;
import com.railnexus.repository.TrainRepository;
import com.railnexus.repository.TrainRouteRepository;
import org.springframework.stereotype.Service;
import com.railnexus.dto.TrainSearchResponse;

import java.util.List;

@Service
public class TrainRouteServiceImpl implements TrainRouteService {

    private final TrainRouteRepository trainRouteRepository;
    private final TrainRepository trainRepository;
    private final StationRepository stationRepository;

    public TrainRouteServiceImpl(
            TrainRouteRepository trainRouteRepository,
            TrainRepository trainRepository,
            StationRepository stationRepository
    ) {
        this.trainRouteRepository = trainRouteRepository;
        this.trainRepository = trainRepository;
        this.stationRepository = stationRepository;
    }

    @Override
    public TrainRouteResponse createRoute(TrainRouteRequest request) {

        Train train = trainRepository.findById(request.trainId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Train not found with id: " + request.trainId()
                        )
                );

        Station station = stationRepository.findById(request.stationId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Station not found with id: " + request.stationId()
                        )
                );

        TrainRoute route = TrainRoute.builder()
                .train(train)
                .station(station)
                .stopOrder(request.stopOrder())
                .arrivalTime(request.arrivalTime())
                .departureTime(request.departureTime())
                .distance(request.distance())
                .build();

        TrainRoute savedRoute = trainRouteRepository.save(route);

        return mapToResponse(savedRoute);
    }

    @Override
    public List<TrainRouteResponse> getRoutesByTrain(Long trainId) {

        Train train = trainRepository.findById(trainId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Train not found with id: " + trainId
                        )
                );

        return train.getRoutes()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<TrainSearchResponse> searchTrainsBetweenStations(
            Long fromStationId,
            Long toStationId
    ) {
        return trainRouteRepository
                .findTrainsBetweenStations(fromStationId, toStationId)
                .stream()
                .map(train -> {

                    TrainRoute fromRoute = train.getRoutes()
                            .stream()
                            .filter(route ->
                                    route.getStation().getId().equals(fromStationId)
                            )
                            .findFirst()
                            .orElseThrow();

                    TrainRoute toRoute = train.getRoutes()
                            .stream()
                            .filter(route ->
                                    route.getStation().getId().equals(toStationId)
                            )
                            .findFirst()
                            .orElseThrow();

                    double distance =
                            toRoute.getDistance() - fromRoute.getDistance();

                    return new TrainSearchResponse(
                            train.getId(),
                            train.getNumber(),
                            train.getName(),
                            train.getType(),

                            fromRoute.getStation().getId(),
                            fromRoute.getStation().getCode(),
                            fromRoute.getStation().getName(),
                            fromRoute.getDepartureTime(),

                            toRoute.getStation().getId(),
                            toRoute.getStation().getCode(),
                            toRoute.getStation().getName(),
                            toRoute.getArrivalTime(),

                            distance
                    );
                })
                .toList();
    }

    private TrainRouteResponse mapToResponse(TrainRoute route) {

        return new TrainRouteResponse(
                route.getId(),
                route.getTrain().getId(),
                route.getTrain().getNumber(),
                route.getStation().getId(),
                route.getStation().getCode(),
                route.getStation().getName(),
                route.getStopOrder(),
                route.getArrivalTime(),
                route.getDepartureTime(),
                route.getDistance()
        );
    }
}