package com.railnexus.dto;

import com.railnexus.entity.SeatPreference;
import jakarta.validation.Valid;
import jakarta.validation.constraints.FutureOrPresent;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import jakarta.validation.constraints.NotNull;

import java.time.LocalDate;
import java.util.List;

public record BookingRequest(

        @NotNull
        Long trainId,

        @NotBlank
        String fromStation,

        @NotBlank
        String toStation,

        @NotNull
        @FutureOrPresent
        LocalDate journeyDate,

        @NotBlank
        String classCode,

        @NotNull
        SeatPreference seatPreference,

        @NotEmpty
        List<@Valid PassengerRequest> passengers
) {
}