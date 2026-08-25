package com.railnexus.service;

import com.railnexus.dto.TrainRequest;
import com.railnexus.dto.TrainResponse;

import java.util.List;

public interface TrainService {

    TrainResponse createTrain(TrainRequest request);

    List<TrainResponse> getAllTrains();

    TrainResponse getTrainByNumber(String number);

    TrainResponse updateTrain(String number, TrainRequest request);

    void deleteTrain(String number);
}
