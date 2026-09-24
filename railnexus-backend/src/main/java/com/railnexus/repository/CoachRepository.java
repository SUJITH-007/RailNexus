package com.railnexus.repository;

import com.railnexus.entity.Coach;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CoachRepository extends JpaRepository<Coach, Long> {

    List<Coach> findByTrainId(Long trainId);

    List<Coach> findByTrainIdAndActiveTrue(Long trainId);

    boolean existsByTrainIdAndCoachNumber(
            Long trainId,
            String coachNumber
    );


}
