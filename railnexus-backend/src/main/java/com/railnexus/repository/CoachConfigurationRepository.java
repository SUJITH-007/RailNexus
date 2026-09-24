package com.railnexus.repository;

import com.railnexus.entity.CoachConfiguration;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface CoachConfigurationRepository extends JpaRepository<CoachConfiguration, Long> {

    List<CoachConfiguration> findByTrainClassIdAndActiveTrue(Long classId);
}