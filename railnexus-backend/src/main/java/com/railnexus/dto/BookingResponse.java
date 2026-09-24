package com.railnexus.dto;

import com.railnexus.entity.BookingStatus;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

public record BookingResponse(
        Long id,
        String pnr,

        Long trainId,
        String trainNumber,
        String trainName,

        String fromStation,
        String toStation,

        LocalDate journeyDate,

        String classCode,

        Integer passengerCount,

        BookingStatus status,

        Double totalFare,

        LocalDateTime createdAt,

        List<BookingSeatResponse> seats
) {
}