package com.railnexus.dto;

import jakarta.validation.constraints.NotBlank;

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
        String destination
) {
}