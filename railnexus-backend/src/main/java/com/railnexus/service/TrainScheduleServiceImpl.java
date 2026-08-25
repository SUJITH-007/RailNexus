package com.railnexus.service;

import com.railnexus.dto.TrainScheduleRequest;
import com.railnexus.dto.TrainScheduleResponse;
import com.railnexus.entity.Train;
import com.railnexus.entity.TrainSchedule;
import com.railnexus.exception.ResourceNotFoundException;
import com.railnexus.repository.TrainRepository;
import com.railnexus.repository.TrainScheduleRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainScheduleServiceImpl implements TrainScheduleService {

    private final TrainScheduleRepository trainScheduleRepository;
    private final TrainRepository trainRepository;

    public TrainScheduleServiceImpl(
            TrainScheduleRepository trainScheduleRepository,
            TrainRepository trainRepository
    ) {
        this.trainScheduleRepository = trainScheduleRepository;
        this.trainRepository = trainRepository;
    }

    @Override
    public TrainScheduleResponse createSchedule(TrainScheduleRequest request) {

        Train train = trainRepository.findById(request.trainId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Train not found with id: " + request.trainId()
                        )
                );

        TrainSchedule schedule = TrainSchedule.builder()
                .train(train)
                .dayOfWeek(request.dayOfWeek())
                .build();

        TrainSchedule savedSchedule =
                trainScheduleRepository.save(schedule);

        return mapToResponse(savedSchedule);
    }

    @Override
    public List<TrainScheduleResponse> getSchedulesByTrain(Long trainId) {

        trainRepository.findById(trainId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Train not found with id: " + trainId
                        )
                );

        return trainScheduleRepository.findByTrainId(trainId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    private TrainScheduleResponse mapToResponse(
            TrainSchedule schedule
    ) {

        return new TrainScheduleResponse(
                schedule.getId(),
                schedule.getTrain().getId(),
                schedule.getTrain().getNumber(),
                schedule.getDayOfWeek()
        );
    }
}