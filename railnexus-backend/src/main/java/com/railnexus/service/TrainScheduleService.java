package com.railnexus.service;

import com.railnexus.dto.TrainScheduleRequest;
import com.railnexus.dto.TrainScheduleResponse;

import java.util.List;

public interface TrainScheduleService {

    TrainScheduleResponse createSchedule(
            TrainScheduleRequest request
    );

    List<TrainScheduleResponse> getSchedulesByTrain(
            Long trainId
    );

    TrainScheduleResponse updateSchedule(
            Long scheduleId,
            TrainScheduleRequest request
    );

    void deleteSchedule(Long scheduleId);
}