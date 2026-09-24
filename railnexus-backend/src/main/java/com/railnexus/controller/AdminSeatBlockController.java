package com.railnexus.controller;

import com.railnexus.dto.SeatBlockRequest;
import com.railnexus.dto.SeatBlockResponse;
import com.railnexus.service.SeatBlockService;
import jakarta.validation.Valid;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/admin/seat-blocks")
@RequiredArgsConstructor
public class AdminSeatBlockController {

    private final SeatBlockService seatBlockService;

    @PostMapping
    public SeatBlockResponse blockSeat(
            @Valid @RequestBody SeatBlockRequest request) {

        return seatBlockService.blockSeat(request);
    }

    @GetMapping
    public List<SeatBlockResponse> getBlocksByDate(
            @RequestParam LocalDate journeyDate) {

        return seatBlockService.getBlocksByDate(journeyDate);
    }

    @DeleteMapping("/{blockId}")
    public void unblockSeat(
            @PathVariable Long blockId) {

        seatBlockService.unblockSeat(blockId);
    }
}