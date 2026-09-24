package com.railnexus.controller;

import com.railnexus.dto.SeatAvailabilityResponse;
import com.railnexus.service.SeatService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/seats")
public class SeatController {

    private final SeatService seatService;

    public SeatController(SeatService seatService) {
        this.seatService = seatService;
    }

    @GetMapping("/coach/{coachId}/availability")
    public List<SeatAvailabilityResponse> getSeatAvailability(
            @PathVariable Long coachId,
            @RequestParam String journeyDate,
            @RequestParam String from,
            @RequestParam(required = true) String to
    ) {
        return seatService.getSeatAvailability(
                coachId,
                journeyDate,
                from,
                to
        );
    }
}