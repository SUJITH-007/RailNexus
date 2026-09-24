package com.railnexus.dto;

import jakarta.validation.constraints.NotBlank;

public record CoachUpdateRequest(
        @NotBlank(message = "Coach number is required")
        String coachNumber
) {
}