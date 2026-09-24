package com.railnexus.dto;

public record RazorpayPaymentVerificationRequest(
        String pnr,
        String razorpayPaymentId,
        String razorpayOrderId,
        String razorpaySignature
) {
}