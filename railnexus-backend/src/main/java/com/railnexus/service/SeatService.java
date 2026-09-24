package com.railnexus.service;

import com.railnexus.dto.SeatAvailabilityResponse;
import com.railnexus.dto.SeatRequest;
import com.railnexus.dto.SeatResponse;
import com.railnexus.dto.AdminSeatStatusResponse;

import java.util.List;

public interface SeatService {

    SeatResponse createSeat(SeatRequest request);

    List<SeatResponse> getSeatsByCoach(Long coachId);

    List<SeatResponse> generateSeats(Long coachId);

    List<SeatAvailabilityResponse> getSeatAvailability(
            Long coachId,
            String journeyDate,
            String from,
            String to
    );

    List<AdminSeatStatusResponse> getAdminSeatStatus(
            Long coachId,
            String journeyDate,
            String from,
            String to
    );
}