package com.railnexus.service;

import com.railnexus.entity.TrainClass;
import com.railnexus.exception.ResourceNotFoundException;
import com.railnexus.repository.TrainClassRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class TrainClassServiceImpl implements TrainClassService {

    private final TrainClassRepository trainClassRepository;

    public TrainClassServiceImpl(TrainClassRepository trainClassRepository) {
        this.trainClassRepository = trainClassRepository;
    }

    @Override
    public TrainClass createClass(TrainClass trainClass) {

        if (trainClassRepository.existsByCode(trainClass.getCode())) {
            throw new IllegalArgumentException(
                    "Train class already exists with code: " + trainClass.getCode()
            );
        }

        return trainClassRepository.save(trainClass);
    }

    @Override
    public List<TrainClass> getAllClasses() {
        return trainClassRepository.findAll();
    }

    @Override
    public TrainClass getClassByCode(String code) {
        return trainClassRepository.findByCode(code)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Train class not found with code: " + code
                        )
                );
    }
}