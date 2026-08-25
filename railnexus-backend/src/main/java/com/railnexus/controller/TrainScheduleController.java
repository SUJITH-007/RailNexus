package com.railnexus.controller;

import com.railnexus.dto.TrainScheduleRequest;
import com.railnexus.dto.TrainScheduleResponse;
import com.railnexus.service.TrainScheduleService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/train-schedules")
public class TrainScheduleController {

    private final TrainScheduleService trainScheduleService;

    public TrainScheduleController(
            TrainScheduleService trainScheduleService
    ) {
        this.trainScheduleService = trainScheduleService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TrainScheduleResponse createSchedule(
            @Valid @RequestBody TrainScheduleRequest request
    ) {
        return trainScheduleService.createSchedule(request);
    }

    @GetMapping("/train/{trainId}")
    public List<TrainScheduleResponse> getSchedulesByTrain(
            @PathVariable Long trainId
    ) {
        return trainScheduleService.getSchedulesByTrain(trainId);
    }
}