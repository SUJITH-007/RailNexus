package com.railnexus.service;

import com.railnexus.dto.CoachRequest;
import com.railnexus.dto.CoachResponse;
import com.railnexus.dto.CoachUpdateRequest;
import com.railnexus.entity.Coach;
import com.railnexus.entity.CoachConfiguration;
import com.railnexus.entity.Train;
import com.railnexus.entity.TrainClass;
import com.railnexus.exception.ResourceNotFoundException;
import com.railnexus.repository.CoachConfigurationRepository;
import com.railnexus.repository.CoachRepository;
import com.railnexus.repository.TrainClassRepository;
import com.railnexus.repository.TrainRepository;
import org.springframework.stereotype.Service;
import com.railnexus.repository.BookingSeatRepository;
import com.railnexus.repository.SeatBlockRepository;
import com.railnexus.repository.SeatRepository;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class CoachServiceImpl implements CoachService {

    private final CoachRepository coachRepository;
    private final TrainRepository trainRepository;
    private final TrainClassRepository trainClassRepository;
    private final CoachConfigurationRepository coachConfigurationRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final SeatBlockRepository seatBlockRepository;
    private final SeatRepository seatRepository;

    public CoachServiceImpl(
            CoachRepository coachRepository,
            TrainRepository trainRepository,
            TrainClassRepository trainClassRepository,
            CoachConfigurationRepository coachConfigurationRepository,
            BookingSeatRepository bookingSeatRepository,
            SeatBlockRepository seatBlockRepository,
            SeatRepository seatRepository
    ) {
        this.coachRepository = coachRepository;
        this.trainRepository = trainRepository;
        this.trainClassRepository = trainClassRepository;
        this.coachConfigurationRepository = coachConfigurationRepository;
        this.bookingSeatRepository = bookingSeatRepository;
        this.seatBlockRepository = seatBlockRepository;
        this.seatRepository = seatRepository;
    }

    @Override
    public CoachResponse createCoach(CoachRequest request) {

        Train train = trainRepository.findById(request.trainId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Train not found with id: " + request.trainId()
                        )
                );

        TrainClass trainClass = trainClassRepository.findById(request.classId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Train class not found with id: " + request.classId()
                        )
                );

        CoachConfiguration configuration =
                coachConfigurationRepository.findById(request.configurationId())
                        .orElseThrow(() ->
                                new ResourceNotFoundException(
                                        "Coach configuration not found with id: "
                                                + request.configurationId()
                                )
                        );

        if (!configuration.getTrainClass().getId().equals(trainClass.getId())) {
            throw new IllegalArgumentException(
                    "Coach configuration does not belong to selected class"
            );
        }

        if (coachRepository.existsByTrainIdAndCoachNumber(
                request.trainId(),
                request.coachNumber()
        )) {
            throw new IllegalArgumentException(
                    "Coach already exists for this train: "
                            + request.coachNumber()
            );
        }
        boolean classAvailable = train.getClasses()
                .stream()
                .anyMatch(trainClassFromTrain ->
                        trainClassFromTrain.getId().equals(trainClass.getId())
                );

        if (!classAvailable) {
            throw new IllegalArgumentException(
                    "Train does not support class: " + trainClass.getCode()
            );
        }
        Coach coach = Coach.builder()
                .train(train)
                .trainClass(trainClass)
                .configuration(configuration)
                .coachNumber(request.coachNumber())
                .active(true)
                .build();

        Coach savedCoach = coachRepository.save(coach);

        return mapToResponse(savedCoach);
    }

    @Override
    @Transactional
    public CoachResponse updateCoach(
            Long coachId,
            CoachUpdateRequest request
    ) {

        Coach coach = coachRepository.findById(coachId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Coach not found with id: " + coachId
                        )
                );

        String newCoachNumber = request.coachNumber().trim();

        if (!coach.getCoachNumber().equals(newCoachNumber)
                && coachRepository.existsByTrainIdAndCoachNumber(
                coach.getTrain().getId(),
                newCoachNumber
        )) {
            throw new IllegalArgumentException(
                    "Coach number already exists in this train: "
                            + newCoachNumber
            );
        }

        coach.setCoachNumber(newCoachNumber);

        Coach savedCoach = coachRepository.save(coach);

        return mapToResponse(savedCoach);
    }

    @Override
    public List<CoachResponse> getCoachesByTrain(Long trainId) {

        if (!trainRepository.existsById(trainId)) {
            throw new ResourceNotFoundException(
                    "Train not found with id: " + trainId
            );
        }

        return coachRepository.findByTrainIdAndActiveTrue(trainId)
                .stream()
                .sorted((coach1, coach2) -> {

                    String number1 = coach1.getCoachNumber();
                    String number2 = coach2.getCoachNumber();

                    String prefix1 = number1.replaceAll("\\d+$", "");
                    String prefix2 = number2.replaceAll("\\d+$", "");

                    int prefixComparison = prefix1.compareTo(prefix2);

                    if (prefixComparison != 0) {
                        return prefixComparison;
                    }

                    int numeric1 = Integer.parseInt(
                            number1.substring(prefix1.length())
                    );

                    int numeric2 = Integer.parseInt(
                            number2.substring(prefix2.length())
                    );

                    return Integer.compare(numeric1, numeric2);
                })
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional
    public void deleteCoach(Long coachId) {

        Coach coach = coachRepository.findById(coachId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Coach not found with id: " + coachId
                        )
                );

        if (bookingSeatRepository.existsByCoachId(coachId)) {
            coach.setActive(false);
            coachRepository.save(coach);
            return;
        }

        seatBlockRepository.deleteBySeatCoachId(coachId);
        seatRepository.deleteByCoachId(coachId);
        coachRepository.delete(coach);
    }

    private CoachResponse mapToResponse(Coach coach) {

        return new CoachResponse(
                coach.getId(),
                coach.getTrain().getId(),
                coach.getTrain().getNumber(),
                coach.getTrainClass().getId(),
                coach.getTrainClass().getCode(),
                coach.getTrainClass().getName(),
                coach.getConfiguration().getId(),
                coach.getConfiguration().getConfigurationCode(),
                coach.getConfiguration().getName(),
                coach.getConfiguration().getPhysicalCapacity(),
                coach.getCoachNumber()
        );
    }
}