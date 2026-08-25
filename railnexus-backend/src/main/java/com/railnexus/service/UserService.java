package com.railnexus.service;

import com.railnexus.dto.auth.LoginRequest;
import com.railnexus.dto.auth.LoginResponse;
import com.railnexus.dto.auth.RegisterRequest;

public interface UserService {

    void register(RegisterRequest request);

    LoginResponse login(LoginRequest request);
}