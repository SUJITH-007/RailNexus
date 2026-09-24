package com.railnexus.controller;

import com.railnexus.entity.TrainClass;
import com.railnexus.service.TrainClassService;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/train-classes")
public class TrainClassController {

    private final TrainClassService trainClassService;

    public TrainClassController(TrainClassService trainClassService) {
        this.trainClassService = trainClassService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public TrainClass createClass(@RequestBody TrainClass trainClass) {
        return trainClassService.createClass(trainClass);
    }

    @GetMapping
    public List<TrainClass> getAllClasses() {
        return trainClassService.getAllClasses();
    }

    @GetMapping("/{code}")
    public TrainClass getClassByCode(@PathVariable String code) {
        return trainClassService.getClassByCode(code);
    }
}