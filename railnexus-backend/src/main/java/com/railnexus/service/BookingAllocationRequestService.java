package com.railnexus.service;

import com.railnexus.dto.BookingRequest;
import com.railnexus.entity.AllocationRequestStatus;
import com.railnexus.entity.BookingAllocationRequest;
import com.railnexus.repository.BookingAllocationRequestRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Propagation;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;
import java.util.UUID;

@Service
public class BookingAllocationRequestService {

    private final BookingAllocationRequestRepository repository;

    public BookingAllocationRequestService(
            BookingAllocationRequestRepository repository
    ) {
        this.repository = repository;
    }

    @Transactional(propagation = Propagation.REQUIRES_NEW)
    public BookingAllocationRequest register(
            BookingRequest request,
            int seniorCount
    ) {

        int berthPreferenceCount = (int) request.passengers()
                .stream()
                .filter(passenger -> passenger.berthPreference() != null)
                .count();

        BookingAllocationRequest allocationRequest =
                BookingAllocationRequest.builder()
                        .requestId(UUID.randomUUID())
                        .trainId(request.trainId())
                        .fromStation(request.fromStation())
                        .toStation(request.toStation())
                        .journeyDate(request.journeyDate())
                        .classCode(request.classCode())
                        .passengerCount(request.passengers().size())
                        .seniorCount(seniorCount)
                        .berthPreferenceCount(berthPreferenceCount)
                        .seatPreference(request.seatPreference())
                        .receivedAt(LocalDateTime.now())
                        .status(AllocationRequestStatus.PENDING)
                        .build();

        return repository.saveAndFlush(allocationRequest);
    }
}