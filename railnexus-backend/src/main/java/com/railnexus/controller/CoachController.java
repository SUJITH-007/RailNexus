package com.railnexus.controller;

import com.railnexus.dto.CoachRequest;
import com.railnexus.dto.CoachResponse;
import com.railnexus.dto.CoachUpdateRequest;
import com.railnexus.service.CoachService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/coaches")
public class CoachController {

    private final CoachService coachService;

    public CoachController(CoachService coachService) {

        this.coachService = coachService;
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public CoachResponse createCoach(
            @Valid @RequestBody CoachRequest request
    ) {
        return coachService.createCoach(request);
    }

    @GetMapping("/train/{trainId}")
    public List<CoachResponse> getCoachesByTrain(
            @PathVariable Long trainId
    ) {
        return coachService.getCoachesByTrain(trainId);
    }

    @DeleteMapping("/{coachId}")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void deleteCoach(
            @PathVariable Long coachId
    ) {
        coachService.deleteCoach(coachId);
    }

    @PutMapping("/{coachId}")
    public CoachResponse updateCoach(
            @PathVariable Long coachId,
            @Valid @RequestBody CoachUpdateRequest request
    ) {
        return coachService.updateCoach(coachId, request);
    }
}