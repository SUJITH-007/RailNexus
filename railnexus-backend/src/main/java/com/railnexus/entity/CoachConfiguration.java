package com.railnexus.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(
        name = "coach_configurations",
        uniqueConstraints = {
                @UniqueConstraint(
                        columnNames = {"class_id", "configuration_code"}
                )
        }
)
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class CoachConfiguration {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @ManyToOne(fetch = FetchType.LAZY, optional = false)
    @JoinColumn(name = "class_id", nullable = false)
    private TrainClass trainClass;

    @Column(name = "configuration_code", nullable = false, length = 30)
    private String configurationCode;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private Integer physicalCapacity;

    @Column(nullable = false)
    private Boolean active = true;
}