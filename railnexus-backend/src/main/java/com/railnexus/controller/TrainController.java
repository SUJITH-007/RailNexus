package com.railnexus.controller;

import com.railnexus.dto.TrainRequest;
import com.railnexus.dto.TrainResponse;
import com.railnexus.dto.TrainSearchResponse;
import com.railnexus.service.TrainService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/trains")
public class TrainController {

    private final TrainService trainService;

    public TrainController(TrainService trainService) {
        this.trainService = trainService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TrainResponse createTrain(
            @Valid @RequestBody TrainRequest request
    ) {
        return trainService.createTrain(request);
    }

    @GetMapping
    public List<TrainResponse> getAllTrains() {
        return trainService.getAllTrains();
    }

    @GetMapping("/{number}")
    public TrainResponse getTrainByNumber(
            @PathVariable String number
    ) {
        return trainService.getTrainByNumber(number);
    }

    @PutMapping("/{number}")
    public TrainResponse updateTrain(
            @PathVariable String number,
            @Valid @RequestBody TrainRequest request
    ) {
        return trainService.updateTrain(number, request);
    }

    @DeleteMapping("/{number}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteTrain(
            @PathVariable String number
    ) {
        trainService.deleteTrain(number);
    }

    @GetMapping("/search")
    public List<TrainSearchResponse> searchTrains(
            @RequestParam String from,
            @RequestParam String to,
            @RequestParam java.time.LocalDate date
    ) {
        return trainService.searchTrains(from, to, date);
    }
}