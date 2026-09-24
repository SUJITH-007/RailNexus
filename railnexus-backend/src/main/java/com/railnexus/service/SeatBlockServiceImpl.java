package com.railnexus.service;

import com.railnexus.dto.SeatBlockRequest;
import com.railnexus.dto.SeatBlockResponse;
import com.railnexus.entity.Seat;
import com.railnexus.entity.SeatBlock;
import com.railnexus.repository.SeatBlockRepository;
import com.railnexus.repository.SeatRepository;
import com.railnexus.service.SeatBlockService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.util.List;

@Service
@RequiredArgsConstructor
public class SeatBlockServiceImpl implements SeatBlockService {

    private final SeatBlockRepository seatBlockRepository;
    private final SeatRepository seatRepository;

    @Override
    @Transactional
    public SeatBlockResponse blockSeat(SeatBlockRequest request) {

        Seat seat = seatRepository.findById(request.seatId())
                .orElseThrow(() ->
                        new IllegalArgumentException("Seat not found: " + request.seatId()));

        if (seatBlockRepository.existsBySeatIdAndJourneyDateAndActiveTrue(
                request.seatId(),
                request.journeyDate())) {

            throw new IllegalStateException(
                    "Seat is already blocked for " + request.journeyDate());
        }

        SeatBlock seatBlock = SeatBlock.builder()
                .seat(seat)
                .journeyDate(request.journeyDate())
                .reason(request.reason())
                .active(true)
                .build();

        return toResponse(seatBlockRepository.save(seatBlock));
    }

    @Override
    @Transactional(readOnly = true)
    public List<SeatBlockResponse> getBlocksByDate(LocalDate journeyDate) {

        return seatBlockRepository.findAll()
                .stream()
                .filter(block ->
                        block.getJourneyDate().equals(journeyDate)
                                && Boolean.TRUE.equals(block.getActive()))
                .map(this::toResponse)
                .toList();
    }

    @Override
    @Transactional
    public void unblockSeat(Long blockId) {

        SeatBlock seatBlock = seatBlockRepository.findById(blockId)
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Seat block not found: " + blockId));

        seatBlock.setActive(false);
        seatBlockRepository.save(seatBlock);
    }

    private SeatBlockResponse toResponse(SeatBlock block) {

        Seat seat = block.getSeat();

        return new SeatBlockResponse(
                block.getId(),
                seat.getId(),
                seat.getSeatNumber(),
                seat.getCoach().getCoachNumber(),
                block.getJourneyDate(),
                block.getReason(),
                block.getActive()
        );
    }
}