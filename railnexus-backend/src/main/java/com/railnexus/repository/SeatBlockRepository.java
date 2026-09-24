package com.railnexus.repository;

import com.railnexus.entity.SeatBlock;
import org.springframework.data.jpa.repository.JpaRepository;

import java.time.LocalDate;
import java.util.List;

public interface SeatBlockRepository extends JpaRepository<SeatBlock, Long> {

    List<SeatBlock> findBySeatIdAndJourneyDateAndActiveTrue(
            Long seatId,
            LocalDate journeyDate
    );

    boolean existsBySeatIdAndJourneyDateAndActiveTrue(
            Long seatId,
            LocalDate journeyDate
    );

    void deleteBySeatCoachId(Long coachId);
}