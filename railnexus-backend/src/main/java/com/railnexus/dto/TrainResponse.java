package com.railnexus.dto;

import java.time.LocalDateTime;
import java.util.List;
import com.railnexus.entity.TrainStatus;

public record TrainResponse(

        Long id,
        String number,
        String name,
        String type,
        String source,
        String destination,
        TrainStatus status,
        LocalDateTime createdAt,
        List<Long> classIds

) {
}