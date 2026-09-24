package com.railnexus.service;

import com.railnexus.dto.TrainRequest;
import com.railnexus.dto.TrainResponse;
import com.railnexus.dto.TrainSearchResponse;
import com.railnexus.entity.Station;
import com.railnexus.entity.Train;
import com.railnexus.entity.TrainClass;
import com.railnexus.entity.TrainRoute;
import com.railnexus.exception.ResourceNotFoundException;
import com.railnexus.repository.*;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.time.DayOfWeek;
import java.time.LocalDate;
import java.util.*;

@Service
public class TrainServiceImpl implements TrainService {

    private final TrainRepository trainRepository;
    private final TrainClassRepository trainClassRepository;
    private final StationRepository stationRepository;
    private final TrainRouteRepository trainRouteRepository;
    private final TrainScheduleRepository trainScheduleRepository;

    public TrainServiceImpl(
            TrainRepository trainRepository,
            TrainClassRepository trainClassRepository,
            StationRepository stationRepository,
            TrainRouteRepository trainRouteRepository,
            TrainScheduleRepository trainScheduleRepository
    ) {
        this.trainRepository = trainRepository;
        this.trainClassRepository = trainClassRepository;
        this.stationRepository = stationRepository;
        this.trainRouteRepository = trainRouteRepository;
        this.trainScheduleRepository = trainScheduleRepository;

    }

    @Override
    @Transactional
    public TrainResponse createTrain(TrainRequest request) {

        if (trainRepository.existsByNumber(request.number())) {
            throw new IllegalArgumentException(
                    "Train already exists with number: " + request.number()
            );
        }

        Set<Long> requestedClassIds = new LinkedHashSet<>(request.classIds());

        List<TrainClass> classes =
                trainClassRepository.findAllById(requestedClassIds);

        if (classes.size() != requestedClassIds.size()) {
            throw new ResourceNotFoundException(
                    "One or more train classes were not found"
            );
        }

        Train train = Train.builder()
                .number(request.number())
                .name(request.name())
                .type(request.type())
                .source(request.source())
                .destination(request.destination())
                .status(request.status())
                .classes(classes)
                .build();

        Train savedTrain = trainRepository.save(train);

        return mapToResponse(savedTrain);
    }

    @Override
    @Transactional(readOnly = true)
    public List<TrainResponse> getAllTrains() {

        return trainRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public TrainResponse getTrainByNumber(String number) {

        Train train = trainRepository.findByNumber(number)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Train not found with number: " + number
                        )
                );

        return mapToResponse(train);
    }

    @Override
    @Transactional
    public TrainResponse updateTrain(
            String number,
            TrainRequest request
    ) {

        Train train = trainRepository.findByNumber(number)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Train not found with number: " + number
                        )
                );

        Set<Long> requestedClassIds = new LinkedHashSet<>(request.classIds());

        List<TrainClass> classes =
                trainClassRepository.findAllById(requestedClassIds);

        if (classes.size() != requestedClassIds.size()) {
            throw new ResourceNotFoundException(
                    "One or more train classes were not found"
            );
        }

        train.setName(request.name());
        train.setType(request.type());
        train.setSource(request.source());
        train.setDestination(request.destination());
        train.setStatus(request.status());
        train.setClasses(classes);

        Train updatedTrain = trainRepository.save(train);

        return mapToResponse(updatedTrain);
    }

    @Override
    @Transactional
    public void deleteTrain(String number) {

        Train train = trainRepository.findByNumber(number)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Train not found with number: " + number
                        )
                );

        trainRepository.delete(train);
    }
    @Override
    @Transactional(readOnly = true)
    public List<TrainSearchResponse> searchTrains(
            String from,
            String to,
            LocalDate date
    ) {

        if (date == null) {
            throw new IllegalArgumentException(
                    "Journey date is required"
            );
        }

        if (date.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException(
                    "Journey date cannot be in the past"
            );
        }

        String fromInput = from.trim();
        String toInput = to.trim();

        if (fromInput.isBlank() || toInput.isBlank()) {
            throw new IllegalArgumentException(
                    "Origin and destination are required"
            );
        }

        /*
         * First try exact station code/name/city.
         */
        Station fromStation =
                findStation(fromInput, "Origin");

        Station toStation =
                findStation(toInput, "Destination");

        if (fromStation.getId().equals(toStation.getId())) {
            throw new IllegalArgumentException(
                    "Origin and destination cannot be the same station"
            );
        }

        DayOfWeek dayOfWeek = date.getDayOfWeek();

        List<Train> trains =
                trainRouteRepository.findTrainsBetweenStationsAndDate(
                        fromStation.getId(),
                        toStation.getId(),
                        date
                );

        return trains.stream()
                .map(train -> {

                    List<TrainRoute> routes =
                            trainRouteRepository
                                    .findByTrainNumberOrderByStopOrder(
                                            train.getNumber()
                                    );

                    TrainRoute fromRoute =
                            routes.stream()
                                    .filter(route ->
                                            route.getStation()
                                                    .getId()
                                                    .equals(fromStation.getId())
                                    )
                                    .findFirst()
                                    .orElseThrow();

                    TrainRoute toRoute =
                            routes.stream()
                                    .filter(route ->
                                            route.getStation()
                                                    .getId()
                                                    .equals(toStation.getId())
                                    )
                                    .findFirst()
                                    .orElseThrow();

                    Double distance =
                            toRoute.getDistance()
                                    - fromRoute.getDistance();

                    List<String> classes =
                            train.getClasses()
                                    .stream()
                                    .map(TrainClass::getCode)
                                    .toList();

                    return new TrainSearchResponse(
                            train.getId(),
                            train.getNumber(),
                            train.getName(),
                            train.getType(),

                            fromStation.getId(),
                            fromStation.getCode(),
                            fromStation.getName(),
                            fromRoute.getDepartureTime(),

                            toStation.getId(),
                            toStation.getCode(),
                            toStation.getName(),
                            toRoute.getArrivalTime(),

                            distance,

                            classes
                    );
                })
                .toList();
    }

    private Station findStation(
            String input,
            String stationType
    ) {

        Optional<Station> stationByCode =
                stationRepository.findByCodeIgnoreCase(input);

        if (stationByCode.isPresent()) {
            return stationByCode.get();
        }

        Optional<Station> stationByName =
                stationRepository.findByNameIgnoreCase(input);

        if (stationByName.isPresent()) {
            return stationByName.get();
        }

        Optional<Station> stationByCity =
                stationRepository.findByCityIgnoreCase(input);

        if (stationByCity.isPresent()) {
            return stationByCity.get();
        }

        throw new ResourceNotFoundException(
                stationType + " station not found: " + input
        );
    }


    private TrainResponse mapToResponse(Train train) {

        List<Long> classIds = train.getClasses()
                .stream()
                .map(TrainClass::getId)
                .toList();

        return new TrainResponse(
                train.getId(),
                train.getNumber(),
                train.getName(),
                train.getType(),
                train.getSource(),
                train.getDestination(),
                train.getStatus(),
                train.getCreatedAt(),
                classIds
        );
    }
}