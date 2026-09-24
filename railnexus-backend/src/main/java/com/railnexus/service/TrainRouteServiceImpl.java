package com.railnexus.service;

import com.railnexus.dto.*;
import com.railnexus.entity.Station;
import com.railnexus.entity.Train;
import com.railnexus.entity.TrainClass;
import com.railnexus.entity.TrainRoute;
import com.railnexus.exception.ResourceNotFoundException;
import com.railnexus.repository.StationRepository;
import com.railnexus.repository.TrainRepository;
import com.railnexus.repository.TrainRouteRepository;
import org.springframework.stereotype.Service;

import java.time.LocalDate;
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

        if (trainRouteRepository.existsByTrainIdAndStationIdAndStopOrder(
                request.trainId(),
                request.stationId(),
                request.stopOrder()
        )) {
            throw new IllegalArgumentException(
                    "Route already exists for this train, station and stop order"
            );
        }

        TrainRoute route = TrainRoute.builder()
                .train(train)
                .station(station)
                .stopOrder(request.stopOrder())
                .journeyDate(request.journeyDate())
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

        return trainRouteRepository.findByTrainIdOrderByStopOrder(trainId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<TrainSearchResponse> searchTrainsBetweenStations(
            Long fromStationId,
            Long toStationId,
            LocalDate journeyDate
    ) {
        return trainRouteRepository
                .findTrainsBetweenStationsAndDate(
                        fromStationId,
                        toStationId,
                        journeyDate
                )
                .stream()
                .map(train -> {

                    List<TrainRoute> routes =
                            trainRouteRepository.findByTrainIdOrderByStopOrder(
                                    train.getId()
                            );

                    TrainRoute fromRoute = routes.stream()
                            .filter(route ->
                                    route.getStation().getId().equals(fromStationId)
                            )
                            .findFirst()
                            .orElseThrow();

                    TrainRoute toRoute = routes.stream()
                            .filter(route ->
                                    route.getStation().getId().equals(toStationId)
                            )
                            .findFirst()
                            .orElseThrow();

                    double distance =
                            toRoute.getDistance() - fromRoute.getDistance();

                    List<String> classes = train.getClasses()
                            .stream()
                            .map(TrainClass::getCode)
                            .toList();

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

                            distance,
                            classes
                    );
                })
                .toList();
    }

    @Override
    public TrainRouteResponse updateRoute(
            Long routeId,
            TrainRouteRequest request
    ) {

        TrainRoute route = trainRouteRepository.findById(routeId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Route not found with id: " + routeId
                        )
                );

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

        boolean stopOrderChanged =
                !route.getStopOrder().equals(request.stopOrder());

        boolean trainChanged =
                !route.getTrain().getId().equals(request.trainId());

        if ((stopOrderChanged || trainChanged)
                && trainRouteRepository.existsByTrainIdAndStopOrder(
                request.trainId(),
                request.stopOrder()
        )) {

            throw new IllegalArgumentException(
                    "A route already exists at stop order "
                            + request.stopOrder()
            );
        }

        boolean stationChanged =
                !route.getStation().getId().equals(request.stationId());

        if ((stationChanged || trainChanged)
                && trainRouteRepository.existsByTrainIdAndStationId(
                request.trainId(),
                request.stationId()
        )) {

            throw new IllegalArgumentException(
                    "This station already exists in the train route"
            );
        }

        route.setTrain(train);
        route.setStation(station);
        route.setStopOrder(request.stopOrder());
        route.setJourneyDate(request.journeyDate());
        route.setArrivalTime(request.arrivalTime());
        route.setDepartureTime(request.departureTime());
        route.setDistance(request.distance());

        TrainRoute updatedRoute =
                trainRouteRepository.save(route);

        return mapToResponse(updatedRoute);
    }

    @Override
    public void updateTrainJourneyDate(
            Long trainId,
            LocalDate journeyDate
    ) {
        trainRepository.findById(trainId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Train not found with id: " + trainId
                        )
                );

        List<TrainRoute> routes =
                trainRouteRepository.findByTrainIdOrderByStopOrder(trainId);

        if (routes.isEmpty()) {
            throw new IllegalArgumentException(
                    "No route stops found for train: " + trainId
            );
        }

        routes.forEach(route ->
                route.setJourneyDate(journeyDate)
        );

        trainRouteRepository.saveAll(routes);
    }

    @Override
    public void deleteRoute(Long routeId) {

        TrainRoute route = trainRouteRepository.findById(routeId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Route not found with id: " + routeId
                        )
                );

        trainRouteRepository.delete(route);
    }

    @Override
    public TrainDetailsResponse getTrainDetailsByDate(
            Long trainId,
            LocalDate journeyDate
    ) {
        Train train = trainRepository.findById(trainId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Train not found with id: " + trainId
                        )
                );

        List<TrainRouteResponse> routes =
                trainRouteRepository
                        .findByTrainIdAndJourneyDateOrderByStopOrder(
                                trainId,
                                journeyDate
                        )
                        .stream()
                        .map(this::mapToResponse)
                        .toList();

        List<TrainClassResponse> classes =
                train.getClasses()
                        .stream()
                        .map(trainClass ->
                                new TrainClassResponse(
                                        trainClass.getId(),
                                        trainClass.getCode(),
                                        trainClass.getName(),
                                        trainClass.isAc()
                                )
                        )
                        .toList();

        return new TrainDetailsResponse(
                train.getId(),
                train.getNumber(),
                train.getName(),
                train.getType(),
                routes,
                classes
        );
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
                route.getJourneyDate(),
                route.getArrivalTime(),
                route.getDepartureTime(),
                route.getDistance()
        );
    }
}