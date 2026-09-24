package com.railnexus.service;

import com.railnexus.dto.admin.AdminUserResponse;

import java.util.List;

public interface AdminUserService {

    List<AdminUserResponse> getAllUsers();

    AdminUserResponse updateUserStatus(
            Long userId,
            String status
    );
}