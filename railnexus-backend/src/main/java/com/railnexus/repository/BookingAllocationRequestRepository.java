package com.railnexus.repository;

import com.railnexus.entity.BookingAllocationRequest;
import com.railnexus.entity.AllocationRequestStatus;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public interface BookingAllocationRequestRepository
        extends JpaRepository<BookingAllocationRequest, Long> {

    List<BookingAllocationRequest> findByTrainIdAndFromStationAndToStationAndJourneyDateAndClassCodeAndStatusAndReceivedAtBetween(
            Long trainId,
            String fromStation,
            String toStation,
            LocalDate journeyDate,
            String classCode,
            AllocationRequestStatus status,
            LocalDateTime start,
            LocalDateTime end
    );

    List<BookingAllocationRequest> findByTrainIdAndFromStationAndToStationAndJourneyDateAndClassCodeAndStatusAndReceivedAtBetweenOrderByReceivedAtAsc(
            Long trainId,
            String fromStation,
            String toStation,
            LocalDate journeyDate,
            String classCode,
            AllocationRequestStatus status,
            LocalDateTime start,
            LocalDateTime end
    );

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        SELECT r
        FROM BookingAllocationRequest r
        WHERE r.trainId = :trainId
          AND r.fromStation = :fromStation
          AND r.toStation = :toStation
          AND r.journeyDate = :journeyDate
          AND r.classCode = :classCode
          AND r.receivedAt >= :start
          AND r.receivedAt <= :end
        ORDER BY r.receivedAt ASC
        """)
    List<BookingAllocationRequest> findCompetingRequests(
            @Param("trainId") Long trainId,
            @Param("fromStation") String fromStation,
            @Param("toStation") String toStation,
            @Param("journeyDate") LocalDate journeyDate,
            @Param("classCode") String classCode,
            @Param("start") LocalDateTime start,
            @Param("end") LocalDateTime end
    );
}