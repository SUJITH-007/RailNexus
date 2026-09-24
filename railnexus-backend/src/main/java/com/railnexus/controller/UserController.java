package com.railnexus.controller;

import com.railnexus.dto.auth.LoginResponse;
import com.railnexus.dto.user.UpdateProfileRequest;
import com.railnexus.dto.user.UserResponse;
import com.railnexus.entity.User;
import com.railnexus.service.UserService;
import jakarta.validation.Valid;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;

@RestController
@RequestMapping("/api/users")
public class UserController {

    private final UserService userService;

    public UserController(UserService userService) {
        this.userService = userService;
    }

    @GetMapping("/me")
    public UserResponse getCurrentUser(
            Authentication authentication
    ) {

        User user = (User) authentication.getPrincipal();

        return new UserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getStatus(),
                user.getCreatedAt()
        );
    }

    @PutMapping("/me")
    public LoginResponse updateCurrentUser(
            @Valid @RequestBody UpdateProfileRequest request,
            Authentication authentication
    ) {

        User user = (User) authentication.getPrincipal();

        return userService.updateProfile(
                user.getEmail(),
                request
        );
    }
}