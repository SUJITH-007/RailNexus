package com.railnexus.dto;

import jakarta.validation.constraints.NotNull;

import java.time.DayOfWeek;

public record TrainScheduleRequest(

        @NotNull
        Long trainId,

        @NotNull
        DayOfWeek dayOfWeek

) {
}