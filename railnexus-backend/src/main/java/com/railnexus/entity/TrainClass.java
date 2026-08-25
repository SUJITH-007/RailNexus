package com.railnexus.entity;

import jakarta.persistence.*;
import lombok.*;

@Entity
@Table(name = "train_classes")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class TrainClass {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 10)
    private String code;

    @Column(nullable = false)
    private String name;

    @Column(nullable = false)
    private boolean ac;
}