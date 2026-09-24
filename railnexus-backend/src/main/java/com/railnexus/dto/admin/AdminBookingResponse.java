package com.railnexus.dto.admin;

import com.railnexus.dto.BookingSeatResponse;
import com.railnexus.entity.BookingStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record AdminBookingResponse(
        Long id,
        String pnr,
        String passengerName,
        String passengerEmail,
        Long trainId,
        String trainNumber,
        String trainName,
        String fromStation,
        String toStation,
        LocalDate journeyDate,
        Integer passengerCount,
        String classCode,
        Double totalFare,
        BookingStatus status,
        LocalDateTime createdAt,
        List<BookingSeatResponse> seats
) {
}