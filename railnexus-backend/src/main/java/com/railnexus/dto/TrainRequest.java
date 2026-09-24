package com.railnexus.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotEmpty;
import com.railnexus.entity.TrainStatus;
import jakarta.validation.constraints.NotNull;

import java.util.List;

public record TrainRequest(

        @NotBlank(message = "Train number is required")
        String number,

        @NotBlank(message = "Train name is required")
        String name,

        @NotBlank(message = "Train type is required")
        String type,

        @NotBlank(message = "Source is required")
        String source,

        @NotBlank(message = "Destination is required")
        String destination,

        @NotNull(message = "Train status is required")
        TrainStatus status,

        @NotEmpty(message = "At least one train class is required")
        List<Long> classIds

) {
}