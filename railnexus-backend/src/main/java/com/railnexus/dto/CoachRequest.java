package com.railnexus.dto;

import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record CoachRequest(
        @NotNull(message = "Train ID is required")
        Long trainId,

        @NotNull(message = "Train class ID is required")
        Long classId,

        @NotNull(message = "Coach configuration ID is required")
        Long configurationId,

        @NotBlank(message = "Coach number is required")
        String coachNumber
) {
}