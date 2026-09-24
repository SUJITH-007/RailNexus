package com.railnexus.service;

import com.railnexus.dto.SeatBlockRequest;
import com.railnexus.dto.SeatBlockResponse;

import java.time.LocalDate;
import java.util.List;

public interface SeatBlockService {

    SeatBlockResponse blockSeat(SeatBlockRequest request);

    List<SeatBlockResponse> getBlocksByDate(LocalDate journeyDate);

    void unblockSeat(Long blockId);
}