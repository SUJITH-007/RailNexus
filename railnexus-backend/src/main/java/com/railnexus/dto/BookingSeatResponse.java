package com.railnexus.dto;

import com.railnexus.entity.PassengerGender;

public record BookingSeatResponse(

        Long seatId,
        Integer seatNumber,
        String coachNumber,
        String berthType,

        String passengerName,
        Integer passengerAge,
        PassengerGender passengerGender

) {
}