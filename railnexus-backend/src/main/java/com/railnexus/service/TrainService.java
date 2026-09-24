package com.railnexus.service;

import com.railnexus.dto.TrainRequest;
import com.railnexus.dto.TrainResponse;
import com.railnexus.dto.TrainSearchResponse;

import java.time.LocalDate;
import java.util.List;

public interface TrainService {

    TrainResponse createTrain(TrainRequest request);

    List<TrainResponse> getAllTrains();

    TrainResponse getTrainByNumber(String number);

    TrainResponse updateTrain(
            String number,
            TrainRequest request
    );

    void deleteTrain(String number);

    List<TrainSearchResponse> searchTrains(
            String from,
            String to,
            LocalDate date
    );
}