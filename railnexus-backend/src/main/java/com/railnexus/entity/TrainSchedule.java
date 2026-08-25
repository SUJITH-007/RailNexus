package com.railnexus.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.DayOfWeek;

@Entity
@Table(
        name = "train_schedules",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"train_id", "day_of_week"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainSchedule {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "train_id", nullable = false)
    private Train train;

    @Enumerated(EnumType.STRING)
    @Column(name = "day_of_week", nullable = false)
    private DayOfWeek dayOfWeek;
}