package com.railnexus.dto;

public record TrainClassResponse(
        Long id,
        String code,
        String name,
        boolean ac
) {
}