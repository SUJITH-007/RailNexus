package com.railnexus.service;

import com.railnexus.dto.CoachRequest;
import com.railnexus.dto.CoachResponse;
import com.railnexus.dto.CoachUpdateRequest;

import java.util.List;

public interface CoachService {

    CoachResponse createCoach(CoachRequest request);

    List<CoachResponse> getCoachesByTrain(Long trainId);

    void deleteCoach(Long coachId);

    CoachResponse updateCoach(Long coachId, CoachUpdateRequest request);
}