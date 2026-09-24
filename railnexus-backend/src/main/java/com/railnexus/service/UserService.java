package com.railnexus.service;

import com.railnexus.dto.auth.LoginRequest;
import com.railnexus.dto.auth.LoginResponse;
import com.railnexus.dto.auth.RegisterRequest;
import com.railnexus.dto.user.UpdateProfileRequest;

public interface UserService {

    void register(RegisterRequest request);

    LoginResponse login(LoginRequest request);

    LoginResponse updateProfile(
            String currentEmail,
            UpdateProfileRequest request
    );


}