package com.railnexus.service;

import com.railnexus.entity.TrainClass;

import java.util.List;

public interface TrainClassService {

    TrainClass createClass(TrainClass trainClass);

    List<TrainClass> getAllClasses();

    TrainClass getClassByCode(String code);
}