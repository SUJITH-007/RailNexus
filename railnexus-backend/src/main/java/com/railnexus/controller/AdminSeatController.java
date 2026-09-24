package com.railnexus.controller;

import com.railnexus.dto.SeatRequest;
import com.railnexus.dto.SeatResponse;
import com.railnexus.service.SeatService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;
import com.railnexus.dto.AdminSeatStatusResponse;

import java.util.List;

@RestController
@RequestMapping("/api/admin/seats")
public class AdminSeatController {

    private final SeatService seatService;

    public AdminSeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public SeatResponse createSeat(
            @Valid @RequestBody SeatRequest request
    ) {
        return seatService.createSeat(request);
    }

    @GetMapping("/coach/{coachId}")
    public List<SeatResponse> getSeatsByCoach(
            @PathVariable Long coachId
    ) {
        return seatService.getSeatsByCoach(coachId);
    }

    @GetMapping("/coach/{coachId}/status")
    public List<AdminSeatStatusResponse> getAdminSeatStatus(
            @PathVariable Long coachId,
            @RequestParam String journeyDate,
            @RequestParam String from,
            @RequestParam String to
    ) {
        return seatService.getAdminSeatStatus(
                coachId,
                journeyDate,
                from,
                to
        );
    }

    @PostMapping("/generate/coach/{coachId}")
    public List<SeatResponse> generateSeats(
            @PathVariable Long coachId
    ) {
        return seatService.generateSeats(coachId);
    }
}