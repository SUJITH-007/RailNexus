package com.railnexus.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDate;

@Entity
@Table(name = "seat_blocks")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SeatBlock {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "seat_id", nullable = false)
    private Seat seat;

    @Column(name = "journey_date", nullable = false)
    private LocalDate journeyDate;

    @Column(nullable = false, length = 255)
    private String reason;

    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;
}