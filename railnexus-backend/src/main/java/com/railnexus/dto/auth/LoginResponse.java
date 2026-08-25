package com.railnexus.dto.auth;

public record LoginResponse(
        String token,
        String tokenType
) {
}