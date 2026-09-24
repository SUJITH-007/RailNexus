package com.railnexus.service;

import com.railnexus.dto.admin.AdminUserResponse;
import com.railnexus.entity.User;
import com.railnexus.entity.UserStatus;
import com.railnexus.exception.ResourceNotFoundException;
import com.railnexus.repository.BookingRepository;
import com.railnexus.repository.UserRepository;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

@Service
public class AdminUserServiceImpl implements AdminUserService {

    private final UserRepository userRepository;
    private final BookingRepository bookingRepository;

    public AdminUserServiceImpl(
            UserRepository userRepository,
            BookingRepository bookingRepository
    ) {
        this.userRepository = userRepository;
        this.bookingRepository = bookingRepository;
    }

    @Override
    @Transactional(readOnly = true)
    public List<AdminUserResponse> getAllUsers() {

        return userRepository.findAll()
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    @Transactional
    public AdminUserResponse updateUserStatus(
            Long userId,
            String status
    ) {

        User user = userRepository.findById(userId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "User not found with id: " + userId
                        )
                );

        UserStatus userStatus;

        try {
            userStatus = UserStatus.valueOf(
                    status.toUpperCase()
            );
        } catch (IllegalArgumentException exception) {
            throw new IllegalArgumentException(
                    "Invalid user status: " + status
            );
        }

        user.setStatus(userStatus);

        User updatedUser = userRepository.save(user);

        return mapToResponse(updatedUser);
    }

    private AdminUserResponse mapToResponse(User user) {

        return new AdminUserResponse(
                user.getId(),
                user.getName(),
                user.getEmail(),
                user.getPhone(),
                user.getRole(),
                user.getStatus(),
                user.getCreatedAt(),
                bookingRepository.countByUserId(user.getId())
        );
    }
}