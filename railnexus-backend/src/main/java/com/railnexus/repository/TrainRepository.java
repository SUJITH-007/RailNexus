package com.railnexus.repository;

import com.railnexus.entity.Train;
import com.railnexus.entity.TrainRoute;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TrainRepository extends JpaRepository<Train, Long> {

    Optional<Train> findByNumber(String number);

    boolean existsByNumber(String number);


}