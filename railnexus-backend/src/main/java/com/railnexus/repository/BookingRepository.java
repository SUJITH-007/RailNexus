package com.railnexus.repository;

import com.railnexus.entity.Booking;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.data.jpa.repository.Query;

import java.time.LocalDateTime;
import java.util.List;
import java.util.Optional;

public interface BookingRepository extends JpaRepository<Booking, Long> {

    Optional<Booking> findByPnr(String pnr);

    boolean existsByPnr(String pnr);

    long countByCreatedAtBetween(
            LocalDateTime start,
            LocalDateTime end
    );

    @Query("""
            SELECT COALESCE(SUM(b.totalFare), 0)
            FROM Booking b
            WHERE b.status = com.railnexus.entity.BookingStatus.CONFIRMED
            """)
    double getTotalRevenue();

    List<Booking> findTop5ByOrderByCreatedAtDesc();

    long countByUserId(Long userId);

    List<Booking> findByUserIdOrderByJourneyDateDesc(Long userId);

    List<Booking> findAllByOrderByCreatedAtDesc();
}