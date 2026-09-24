package com.railnexus.repository;

import com.railnexus.entity.Train;
import com.railnexus.entity.TrainRoute;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.time.LocalDate;
import java.util.List;
import java.util.Optional;

public interface TrainRouteRepository
        extends JpaRepository<TrainRoute, Long> {

    List<TrainRoute> findByTrainNumberOrderByStopOrder(String trainNumber);

    List<TrainRoute> findByTrainIdOrderByStopOrder(Long trainId);

    Optional<TrainRoute> findByTrainNumberAndStopOrder(
            String trainNumber,
            Integer stopOrder
    );

    boolean existsByTrainIdAndStationIdAndStopOrder(
            Long trainId,
            Long stationId,
            Integer stopOrder
    );

    boolean existsByTrainIdAndStopOrder(
            Long trainId,
            Integer stopOrder
    );

    boolean existsByTrainIdAndStationId(
            Long trainId,
            Long stationId
    );

    @Query("""
    SELECT DISTINCT fromRoute.train
    FROM TrainRoute fromRoute
    JOIN TrainRoute toRoute
        ON fromRoute.train.id = toRoute.train.id
    WHERE fromRoute.station.id = :fromStationId
      AND toRoute.station.id = :toStationId
      AND fromRoute.train.id = toRoute.train.id
      AND fromRoute.journeyDate = :journeyDate
      AND toRoute.journeyDate = :journeyDate
      AND fromRoute.stopOrder < toRoute.stopOrder
    """)
    List<Train> findTrainsBetweenStationsAndDate(
            @Param("fromStationId") Long fromStationId,
            @Param("toStationId") Long toStationId,
            @Param("journeyDate") LocalDate journeyDate
    );

    List<TrainRoute> findByTrainIdAndJourneyDateOrderByStopOrder(
            Long trainId,
            LocalDate journeyDate
    );
}