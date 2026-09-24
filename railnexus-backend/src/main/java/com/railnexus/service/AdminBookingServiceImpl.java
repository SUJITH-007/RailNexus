package com.railnexus.service;

import com.railnexus.dto.BookingSeatResponse;
import com.railnexus.dto.admin.AdminBookingResponse;
import com.railnexus.entity.Booking;
import com.railnexus.entity.BookingSeat;
import com.railnexus.exception.ResourceNotFoundException;
import com.railnexus.repository.BookingRepository;
import com.railnexus.repository.BookingSeatRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminBookingServiceImpl implements AdminBookingService {

    private final BookingRepository bookingRepository;
    private final BookingSeatRepository bookingSeatRepository;

    public AdminBookingServiceImpl(
            BookingRepository bookingRepository,
            BookingSeatRepository bookingSeatRepository
    ) {
        this.bookingRepository = bookingRepository;
        this.bookingSeatRepository = bookingSeatRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdminBookingResponse> getAllBookings() {
        return bookingRepository
                .findAllByOrderByCreatedAtDesc()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional(readOnly = true)
    public AdminBookingResponse getBookingByPnr(String pnr) {
        Booking booking = bookingRepository
                .findByPnr(pnr)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Booking not found with PNR: " + pnr
                        )
                );

        return mapToResponse(booking);
    }

    private AdminBookingResponse mapToResponse(Booking booking) {

        List<BookingSeat> bookingSeats =
                bookingSeatRepository.findByBookingId(booking.getId());

        List<BookingSeatResponse> seats =
                bookingSeats
                        .stream()
                        .map(this::mapSeat)
                        .toList();

        String classCode = bookingSeats.isEmpty()
                ? null
                : bookingSeats.get(0)
                .getSeat()
                .getCoach()
                .getTrainClass()
                .getCode();

        return new AdminBookingResponse(
                booking.getId(),
                booking.getPnr(),
                booking.getUser().getName(),
                booking.getUser().getEmail(),
                booking.getTrain().getId(),
                booking.getTrain().getNumber(),
                booking.getTrain().getName(),
                booking.getFromStation(),
                booking.getToStation(),
                booking.getJourneyDate().toLocalDate(),
                booking.getPassengerCount(),
                classCode,
                booking.getTotalFare(),
                booking.getStatus(),
                booking.getCreatedAt(),
                seats
        );
    }

    private BookingSeatResponse mapSeat(BookingSeat bookingSeat) {

        return new BookingSeatResponse(
                bookingSeat.getSeat().getId(),
                bookingSeat.getSeat().getSeatNumber(),
                bookingSeat.getSeat().getCoach().getCoachNumber(),
                bookingSeat.getSeat().getBerthType().toString(),
                bookingSeat.getPassengerName(),
                bookingSeat.getPassengerAge(),
                bookingSeat.getPassengerGender()
        );
    }
}