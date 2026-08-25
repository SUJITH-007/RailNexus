package com.railnexus.dto;

import java.time.DayOfWeek;

public record TrainScheduleResponse(

        Long id,

        Long trainId,
        String trainNumber,

        DayOfWeek dayOfWeek

) {
}