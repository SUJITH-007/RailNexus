package com.railnexus.dto;

import com.railnexus.entity.BerthType;
import com.railnexus.entity.PassengerGender;
import jakarta.validation.constraints.Min;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.NotNull;

public record PassengerRequest(
        @NotBlank
        String name,

        @NotNull
        @Min(1)
        Integer age,

        @NotNull
        PassengerGender gender,

        BerthType berthPreference
) {
}