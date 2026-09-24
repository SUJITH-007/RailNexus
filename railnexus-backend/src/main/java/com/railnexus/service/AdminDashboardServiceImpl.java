package com.railnexus.service;

import com.railnexus.dto.admin.DashboardResponse;
import com.railnexus.repository.BookingRepository;
import com.railnexus.repository.TrainRepository;
import com.railnexus.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDate;
import java.time.LocalDateTime;

@Service
public class AdminDashboardServiceImpl implements AdminDashboardService {

    private final UserRepository userRepository;
    private final TrainRepository trainRepository;
    private final BookingRepository bookingRepository;

    public AdminDashboardServiceImpl(
            UserRepository userRepository,
            TrainRepository trainRepository,
            BookingRepository bookingRepository
    ) {
        this.userRepository = userRepository;
        this.trainRepository = trainRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public DashboardResponse getDashboard() {

        long totalUsers = userRepository.count();

        long totalTrains = trainRepository.count();

        LocalDate today = LocalDate.now();

        LocalDateTime startOfDay = today.atStartOfDay();

        LocalDateTime startOfTomorrow = today
                .plusDays(1)
                .atStartOfDay();

        long todayBookings =
                bookingRepository.countByCreatedAtBetween(
                        startOfDay,
                        startOfTomorrow
                );

        double totalRevenue =
                bookingRepository.getTotalRevenue();

        return new DashboardResponse(
                totalUsers,
                totalTrains,
                todayBookings,
                totalRevenue,
                bookingRepository.findTop5ByOrderByCreatedAtDesc()
                        .stream()
                        .map(booking -> {
                            return new com.railnexus.dto.BookingResponse(
                                    booking.getId(),
                                    booking.getPnr(),
                                    booking.getTrain().getId(),
                                    booking.getTrain().getNumber(),
                                    booking.getTrain().getName(),
                                    booking.getFromStation(),
                                    booking.getToStation(),
                                    booking.getJourneyDate().toLocalDate(),
                                    null,
                                    booking.getPassengerCount(),
                                    booking.getStatus(),
                                    booking.getTotalFare(),
                                    booking.getCreatedAt(),
                                    java.util.List.of()
                            );
                        })
                        .toList()
        );
    }
}