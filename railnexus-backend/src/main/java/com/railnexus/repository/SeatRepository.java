package com.railnexus.repository;

import com.railnexus.entity.Seat;
import jakarta.persistence.LockModeType;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Lock;
import org.springframework.data.jpa.repository.Query;
import org.springframework.data.repository.query.Param;

import java.util.List;

public interface SeatRepository extends JpaRepository<Seat, Long> {

    boolean existsByCoachIdAndSeatNumber(Long coachId, Integer seatNumber);

    List<Seat> findByCoachIdOrderBySeatNumber(Long coachId);

    void deleteByCoachId(Long coachId);

    @Lock(LockModeType.PESSIMISTIC_WRITE)
    @Query("""
        SELECT s
        FROM Seat s
        JOIN FETCH s.coach c
        JOIN FETCH c.trainClass tc
        WHERE c.train.id = :trainId
          AND c.active = true
          AND c.trainClass.code = :classCode
        ORDER BY c.coachNumber, s.seatNumber
        """)
    List<Seat> findSeatsForAllocation(
            @Param("trainId") Long trainId,
            @Param("classCode") String classCode
    );
}