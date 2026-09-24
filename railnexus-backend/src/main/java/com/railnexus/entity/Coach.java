package com.railnexus.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "coaches",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"train_id", "coach_number"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Coach {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "train_id", nullable = false)
    private Train train;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "class_id", nullable = false)
    private TrainClass trainClass;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "configuration_id", nullable = false)
    private CoachConfiguration configuration;

    @Column(name = "coach_number", nullable = false, length = 10)
    private String coachNumber;

    @Builder.Default
    @Column(nullable = false)
    private Boolean active = true;
}