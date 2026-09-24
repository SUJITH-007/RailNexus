package com.railnexus.controller;

import com.railnexus.dto.admin.AdminUserResponse;
import com.railnexus.service.AdminUserService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/users")
@PreAuthorize("hasRole('ADMIN')")
public class AdminUserController {

    private final AdminUserService adminUserService;

    public AdminUserController(
            AdminUserService adminUserService
    ) {
        this.adminUserService = adminUserService;
    }

    @GetMapping
    public List<AdminUserResponse> getAllUsers() {
        return adminUserService.getAllUsers();
    }

    @PutMapping("/{userId}/status")
    public AdminUserResponse updateUserStatus(
            @PathVariable Long userId,
            @RequestParam String status
    ) {
        return adminUserService.updateUserStatus(
                userId,
                status
        );
    }
}