package com.railnexus.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.UUID;

@Entity
@Table(name = "booking_allocation_requests")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class BookingAllocationRequest {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(name = "request_id", nullable = false, unique = true)
    private UUID requestId;

    @Column(name = "train_id", nullable = false)
    private Long trainId;

    @Column(name = "from_station", nullable = false, length = 10)
    private String fromStation;

    @Column(name = "to_station", nullable = false, length = 10)
    private String toStation;

    @Column(name = "journey_date", nullable = false)
    private LocalDate journeyDate;

    @Column(name = "class_code", nullable = false, length = 10)
    private String classCode;

    @Column(name = "passenger_count", nullable = false)
    private Integer passengerCount;

    @Column(name = "senior_count", nullable = false)
    private Integer seniorCount;

    @Column(name = "berth_preference_count", nullable = false)
    private Integer berthPreferenceCount;

    @Enumerated(EnumType.STRING)
    @Column(name = "seat_preference", nullable = false, length = 20)
    private SeatPreference seatPreference;

    @Column(name = "received_at", nullable = false)
    private LocalDateTime receivedAt;

    @Enumerated(EnumType.STRING)
    @Column(nullable = false, length = 20)
    private AllocationRequestStatus status;
}