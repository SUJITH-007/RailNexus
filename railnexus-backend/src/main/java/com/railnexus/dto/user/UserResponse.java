package com.railnexus.dto.user;

import com.railnexus.entity.UserRole;
import com.railnexus.entity.UserStatus;

import java.time.LocalDateTime;

public record UserResponse(
        Long id,
        String name,
        String email,
        String phone,
        UserRole role,
        UserStatus status,
        LocalDateTime createdAt
) {
}