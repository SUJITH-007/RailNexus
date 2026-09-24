package com.railnexus.controller;

import com.railnexus.entity.CoachConfiguration;
import com.railnexus.service.CoachConfigurationService;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/admin/coach-configurations")
public class CoachConfigurationController {

    private final CoachConfigurationService coachConfigurationService;

    public CoachConfigurationController(
            CoachConfigurationService coachConfigurationService
    ) {
        this.coachConfigurationService = coachConfigurationService;
    }

    @GetMapping("/class/{classId}")
    public List<CoachConfiguration> getConfigurationsByClass(
            @PathVariable Long classId
    ) {
        return coachConfigurationService
                .getConfigurationsByClass(classId);
    }
}