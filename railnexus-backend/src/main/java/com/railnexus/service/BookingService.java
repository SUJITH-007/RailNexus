package com.railnexus.service;

import com.railnexus.dto.BookingRequest;
import com.railnexus.dto.BookingResponse;
import com.railnexus.dto.SeatRecommendationResponse;
import com.railnexus.entity.BerthType;
import com.railnexus.entity.SeatPreference;

import java.time.LocalDate;
import java.util.List;

public interface BookingService {

    BookingResponse lockBooking(
            BookingRequest request,
            String userEmail
    );

    BookingResponse confirmBooking(
            String pnr,
            String userEmail
    );

    BookingResponse createBooking(
            BookingRequest request,
            String userEmail
    );

    BookingResponse getBookingByPnr(
            String pnr,
            String userEmail
    );

    List<BookingResponse> getMyBookings(String userEmail);

    void cancelBooking(
            String pnr,
            String userEmail
    );

    List<SeatRecommendationResponse> findSeatsForBooking(
            Long trainId,
            LocalDate journeyDate,
            String fromStation,
            String toStation,
            String classCode,
            int passengerCount,
            SeatPreference preference,
            BerthType berthPreference
    );
}