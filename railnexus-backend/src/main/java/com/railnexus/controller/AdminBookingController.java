package com.railnexus.controller;

import com.railnexus.dto.admin.AdminBookingResponse;
import com.railnexus.service.AdminBookingService;
import org.springframework.security.access.prepost.PreAuthorize;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/bookings")
@PreAuthorize("hasRole('ADMIN')")
public class AdminBookingController {

    private final AdminBookingService adminBookingService;

    public AdminBookingController(
            AdminBookingService adminBookingService
    ) {
        this.adminBookingService = adminBookingService;
    }

    @GetMapping
    public List<AdminBookingResponse> getAllBookings() {
        return adminBookingService.getAllBookings();
    }

    @GetMapping("/{pnr}")
    public AdminBookingResponse getBookingByPnr(
            @PathVariable String pnr
    ) {
        return adminBookingService.getBookingByPnr(pnr);
    }
}