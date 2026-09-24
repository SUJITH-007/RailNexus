package com.railnexus.dto;

public record RazorpayOrderResponse(
        String keyId,
        String orderId,
        Integer amount,
        String currency
) {
}