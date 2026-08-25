package com.railnexus.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalTime;

@Entity
@Table(
        name = "train_routes",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"train_id", "station_id", "stop_order"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainRoute {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "train_id", nullable = false)
    private Train train;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "station_id", nullable = false)
    private Station station;

    @Column(name = "stop_order", nullable = false)
    private Integer stopOrder;

    @Column(name = "arrival_time")
    private LocalTime arrivalTime;

    @Column(name = "departure_time")
    private LocalTime departureTime;

    @Column(nullable = false)
    private Double distance;
}