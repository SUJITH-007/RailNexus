package com.railnexus.dto;

public record CoachResponse(
        Long id,

        Long trainId,
        String trainNumber,

        Long classId,
        String classCode,
        String className,

        Long configurationId,
        String configurationCode,
        String configurationName,
        Integer physicalCapacity,

        String coachNumber
) {
}