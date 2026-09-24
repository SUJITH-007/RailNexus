package com.railnexus.repository;

import com.railnexus.entity.TrainSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.DayOfWeek;
import java.util.List;
import java.util.Optional;

public interface TrainScheduleRepository
        extends JpaRepository<TrainSchedule, Long> {

    List<TrainSchedule> findByTrainIdOrderByDayOfWeek(Long trainId);

    Optional<TrainSchedule> findByTrainIdAndDayOfWeek(
            Long trainId,
            DayOfWeek dayOfWeek
    );

    boolean existsByTrainIdAndDayOfWeek(
            Long trainId,
            DayOfWeek dayOfWeek
    );
}