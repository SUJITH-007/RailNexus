package com.railnexus.service;

import com.railnexus.dto.auth.RegisterRequest;
import com.railnexus.entity.User;
import com.railnexus.entity.UserRole;
import com.railnexus.entity.UserStatus;
import com.railnexus.exception.EmailAlreadyExistsException;
import com.railnexus.repository.UserRepository;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import com.railnexus.dto.auth.LoginRequest;
import com.railnexus.exception.BlockedUserException;
import com.railnexus.exception.InvalidCredentialsException;
import com.railnexus.dto.auth.LoginResponse;
import com.railnexus.security.JwtService;
import com.railnexus.dto.user.UpdateProfileRequest;

@Service
public class UserServiceImpl implements UserService {

    private final UserRepository userRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtService jwtService;

    public UserServiceImpl(
            UserRepository userRepository,
            PasswordEncoder passwordEncoder,
            JwtService jwtService
    ) {
        this.userRepository = userRepository;
        this.passwordEncoder = passwordEncoder;
        this.jwtService = jwtService;
    }

    @Override
    public void register(RegisterRequest request) {

        if (userRepository.existsByEmail(request.getEmail())) {
            throw new EmailAlreadyExistsException("Email is already registered");
        }

        User user = User.builder()
                .name(request.getName())
                .email(request.getEmail())
                .password(passwordEncoder.encode(request.getPassword()))
                .phone(request.getPhone())
                .role(UserRole.USER)
                .status(UserStatus.ACTIVE)
                .build();

        userRepository.save(user);
    }

    @Override
    public LoginResponse login(LoginRequest request) {

        User user = userRepository.findByEmail(request.email())
                .orElseThrow(() ->
                        new InvalidCredentialsException("Invalid email or password")
                );

        if (user.getStatus() == UserStatus.BLOCKED) {
            throw new BlockedUserException("User account is blocked");
        }

        if (!passwordEncoder.matches(request.password(), user.getPassword())) {
            throw new InvalidCredentialsException("Invalid email or password");
        }

        String token = jwtService.generateToken(user);

        return new LoginResponse(token, "Bearer");
    }


    @Override
    public LoginResponse updateProfile(
            String currentEmail,
            UpdateProfileRequest request
    ) {

        User user = userRepository.findByEmail(currentEmail)
                .orElseThrow(() ->
                        new InvalidCredentialsException(
                                "Authenticated user not found"
                        )
                );

        String newEmail = request.email().trim();

        if (!newEmail.equalsIgnoreCase(user.getEmail())
                && userRepository.existsByEmail(newEmail)) {

            throw new EmailAlreadyExistsException(
                    "Email is already registered"
            );
        }

        user.setName(request.name().trim());
        user.setEmail(newEmail);
        user.setPhone(request.phone().trim());

        User savedUser = userRepository.save(user);

        String token = jwtService.generateToken(savedUser);

        return new LoginResponse(token, "Bearer");
    }



}