package com.railnexus.dto.user;

import jakarta.validation.constraints.Email;
import jakarta.validation.constraints.NotBlank;
import jakarta.validation.constraints.Pattern;

public record UpdateProfileRequest(

        @NotBlank(message = "Name is required")
        String name,

        @NotBlank(message = "Email is required")
        @Email(message = "Invalid email address")
        String email,

        @NotBlank(message = "Phone number is required")
        @Pattern(
                regexp = "\\d{10}",
                message = "Phone number must contain 10 digits"
        )
        String phone
) {
}