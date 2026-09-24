package com.railnexus.repository;

import com.railnexus.entity.TrainClass;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface TrainClassRepository extends JpaRepository<TrainClass, Long> {

    Optional<TrainClass> findByCode(String code);

    boolean existsByCode(String code);
}