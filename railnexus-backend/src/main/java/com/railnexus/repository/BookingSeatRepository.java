    package com.railnexus.repository;
    
    import com.railnexus.entity.BookingSeat;
    import org.springframework.data.jpa.repository.JpaRepository;
    import org.springframework.data.jpa.repository.Query;
    import org.springframework.data.repository.query.Param;
    
    import java.time.LocalDateTime;
    import java.util.List;
    
    public interface BookingSeatRepository extends JpaRepository<BookingSeat, Long> {
    
        List<BookingSeat> findByBookingId(Long bookingId);
    
        @Query("""
        SELECT CASE WHEN COUNT(bs) > 0 THEN true ELSE false END
        FROM BookingSeat bs
        WHERE bs.seat.coach.id = :coachId
        """)
        boolean existsByCoachId(@Param("coachId") Long coachId);

        @Query("""
    SELECT CASE WHEN COUNT(bs) > 0 THEN true ELSE false END
    FROM BookingSeat bs
    JOIN bs.booking b
    WHERE bs.seat.id = :seatId
      AND b.train.id = :trainId
      AND b.journeyDate = :journeyDate
      AND (
          b.status = com.railnexus.entity.BookingStatus.CONFIRMED
          OR (
              b.status = com.railnexus.entity.BookingStatus.LOCKED
              AND b.lockExpiresAt > CURRENT_TIMESTAMP
          )
      )
      AND EXISTS (
          SELECT 1
          FROM TrainRoute bookedFrom
          WHERE bookedFrom.train.id = :trainId
            AND bookedFrom.station.code = b.fromStation
            AND bookedFrom.stopOrder < :toStopOrder
      )
      AND EXISTS (
          SELECT 1
          FROM TrainRoute bookedTo
          WHERE bookedTo.train.id = :trainId
            AND bookedTo.station.code = b.toStation
            AND bookedTo.stopOrder > :fromStopOrder
      )
    """)
        boolean isSeatBookedForSegment(
                @Param("seatId") Long seatId,
                @Param("trainId") Long trainId,
                @Param("journeyDate") LocalDateTime journeyDate,
                @Param("fromStopOrder") Integer fromStopOrder,
                @Param("toStopOrder") Integer toStopOrder
        );
    }