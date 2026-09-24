package com.railnexus.repository;

import com.railnexus.entity.Station;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface StationRepository extends JpaRepository<Station, Long> {

    Optional<Station> findByCode(String code);

    Optional<Station> findByCodeIgnoreCase(String code);

    Optional<Station> findByNameIgnoreCase(String name);

    Optional<Station> findByCityIgnoreCase(String city);

    boolean existsByCode(String code);

    List<Station> findTop10ByNameContainingIgnoreCaseOrCityContainingIgnoreCaseOrCodeContainingIgnoreCase(
            String name,
            String city,
            String code
    );
}