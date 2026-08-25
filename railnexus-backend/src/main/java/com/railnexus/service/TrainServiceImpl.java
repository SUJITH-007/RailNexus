package com.railnexus.service;

import com.railnexus.dto.TrainRequest;
import com.railnexus.dto.TrainResponse;
import com.railnexus.entity.Train;
import com.railnexus.exception.ResourceNotFoundException;
import com.railnexus.repository.TrainRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainServiceImpl implements TrainService {

    private final TrainRepository trainRepository;

    public TrainServiceImpl(TrainRepository trainRepository) {
        this.trainRepository = trainRepository;
    }

    @Override
    public TrainResponse createTrain(TrainRequest request) {

        if (trainRepository.existsByNumber(request.number())) {
            throw new IllegalArgumentException(
                    "Train already exists with number: " + request.number()
            );
        }

        Train train = Train.builder()
                .number(request.number())
                .name(request.name())
                .type(request.type())
                .source(request.source())
                .destination(request.destination())
                .build();

        Train savedTrain = trainRepository.save(train);

        return mapToResponse(savedTrain);
    }

    @Override
    public List<TrainResponse> getAllTrains() {

        return trainRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
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
    public TrainResponse updateTrain(String number, TrainRequest request) {

        Train train = trainRepository.findByNumber(number)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Train not found with number: " + number
                        )
                );

        train.setName(request.name());
        train.setType(request.type());
        train.setSource(request.source());
        train.setDestination(request.destination());

        Train updatedTrain = trainRepository.save(train);

        return mapToResponse(updatedTrain);
    }

    @Override
    public void deleteTrain(String number) {

        Train train = trainRepository.findByNumber(number)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Train not found with number: " + number
                        )
                );

        trainRepository.delete(train);
    }

    private TrainResponse mapToResponse(Train train) {

        return new TrainResponse(
                train.getId(),
                train.getNumber(),
                train.getName(),
                train.getType(),
                train.getSource(),
                train.getDestination(),
                train.getCreatedAt()
        );
    }
}