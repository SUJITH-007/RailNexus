package com.railnexus.repository;

import com.railnexus.entity.TrainSchedule;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface TrainScheduleRepository extends JpaRepository<TrainSchedule, Long> {

    List<TrainSchedule> findByTrainId(Long trainId);
}