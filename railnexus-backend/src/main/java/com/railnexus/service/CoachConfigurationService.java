package com.railnexus.service;

import com.railnexus.entity.CoachConfiguration;

import java.util.List;

public interface CoachConfigurationService {

    List<CoachConfiguration> getConfigurationsByClass(Long classId);
}