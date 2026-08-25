package com.railnexus.repository;

import com.railnexus.entity.TrainRoute;
import org.springframework.data.jpa.repository.JpaRepository;
import com.railnexus.entity.Train;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;
import java.util.List;
import java.util.Optional;

public interface TrainRouteRepository extends JpaRepository<TrainRoute, Long> {

    List<TrainRoute> findByTrainNumberOrderByStopOrder(String trainNumber);

    Optional<TrainRoute> findByTrainNumberAndStopOrder(
            String trainNumber,
            Integer stopOrder
    );

    boolean existsByTrainIdAndStationIdAndStopOrder(
            Long trainId,
            Long stationId,
            Integer stopOrder
    );

    @Query("""
        SELECT DISTINCT fromRoute.train
        FROM TrainRoute fromRoute
        JOIN TrainRoute toRoute
            ON fromRoute.train.id = toRoute.train.id
        WHERE fromRoute.station.id = :fromStationId
          AND toRoute.station.id = :toStationId
          AND fromRoute.stopOrder < toRoute.stopOrder
        """)
    List<Train> findTrainsBetweenStations(
            @Param("fromStationId") Long fromStationId,
            @Param("toStationId") Long toStationId
    );
}