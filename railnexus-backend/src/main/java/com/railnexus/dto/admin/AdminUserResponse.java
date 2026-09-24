package com.railnexus.dto.admin;

import com.railnexus.entity.UserRole;
import com.railnexus.entity.UserStatus;

import java.time.LocalDateTime;

public record AdminUserResponse(
        Long id,
        String name,
        String email,
        String phone,
        UserRole role,
        UserStatus status,
        LocalDateTime createdAt,
        long totalBookings
) {
}