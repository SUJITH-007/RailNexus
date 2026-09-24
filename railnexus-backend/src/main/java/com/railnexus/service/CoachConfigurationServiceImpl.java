package com.railnexus.service;

import com.railnexus.entity.CoachConfiguration;
import com.railnexus.exception.ResourceNotFoundException;
import com.railnexus.repository.CoachConfigurationRepository;
import com.railnexus.repository.TrainClassRepository;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
public class CoachConfigurationServiceImpl implements CoachConfigurationService {

    private final CoachConfigurationRepository coachConfigurationRepository;
    private final TrainClassRepository trainClassRepository;

    public CoachConfigurationServiceImpl(
            CoachConfigurationRepository coachConfigurationRepository,
            TrainClassRepository trainClassRepository
    ) {
        this.coachConfigurationRepository = coachConfigurationRepository;
        this.trainClassRepository = trainClassRepository;
    }

    @Override
    public List<CoachConfiguration> getConfigurationsByClass(Long classId) {

        if (!trainClassRepository.existsById(classId)) {
            throw new ResourceNotFoundException(
                    "Train class not found with id: " + classId
            );
        }

        return coachConfigurationRepository
                .findByTrainClassIdAndActiveTrue(classId);
    }
}