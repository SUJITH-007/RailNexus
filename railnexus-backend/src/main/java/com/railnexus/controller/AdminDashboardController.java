package com.railnexus.controller;

import com.railnexus.dto.admin.DashboardResponse;
import com.railnexus.service.AdminDashboardService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

@RestController
@RequestMapping("/api/admin/dashboard")
public class AdminDashboardController {

    private final AdminDashboardService adminDashboardService;

    public AdminDashboardController(
            AdminDashboardService adminDashboardService
    ) {
        this.adminDashboardService = adminDashboardService;
    }

    @GetMapping
    @PreAuthorize("hasRole('ADMIN')")
    public DashboardResponse getDashboard() {
        return adminDashboardService.getDashboard();
    }
}