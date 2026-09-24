package com.railnexus.service;

import com.railnexus.dto.RazorpayOrderResponse;
import com.razorpay.RazorpayClient;
import com.razorpay.RazorpayException;
import com.razorpay.Utils;
import com.railnexus.entity.Booking;
import com.railnexus.entity.BookingStatus;
import com.railnexus.exception.ResourceNotFoundException;
import com.railnexus.repository.BookingRepository;
import org.json.JSONObject;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

@Service
public class RazorpayService {

    private final RazorpayClient razorpayClient;
    private final BookingRepository bookingRepository;

    @Value("${razorpay.key.id}")
    private String keyId;

    @Value("${razorpay.key.secret}")
    private String keySecret;

    public RazorpayService(
            RazorpayClient razorpayClient,
            BookingRepository bookingRepository
    ) {
        this.razorpayClient = razorpayClient;
        this.bookingRepository = bookingRepository;
    }

    @Transactional(readOnly = true)
    public RazorpayOrderResponse createOrder(
            String pnr,
            String userEmail
    ) {

        Booking booking = bookingRepository.findByPnr(pnr)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Booking not found with PNR: " + pnr
                        )
                );

        if (!booking.getUser()
                .getEmail()
                .equals(userEmail)) {

            throw new IllegalArgumentException(
                    "You are not allowed to pay for this booking"
            );
        }

        if (booking.getStatus() != BookingStatus.LOCKED) {

            throw new IllegalArgumentException(
                    "Booking is not available for payment"
            );
        }

        if (booking.getLockExpiresAt() == null
                || booking.getLockExpiresAt()
                .isBefore(LocalDateTime.now())) {

            throw new IllegalArgumentException(
                    "Booking lock has expired"
            );
        }

        int amount = (int) Math.round(
                booking.getTotalFare() * 100
        );

        JSONObject orderRequest = new JSONObject();

        orderRequest.put(
                "amount",
                amount
        );

        orderRequest.put(
                "currency",
                "INR"
        );

        orderRequest.put(
                "receipt",
                booking.getPnr()
        );

        orderRequest.put(
                "partial_payment",
                false
        );

        try {

            com.razorpay.Order order =
                    razorpayClient.orders.create(
                            orderRequest
                    );

            return new RazorpayOrderResponse(
                    keyId,
                    order.get("id"),
                    order.get("amount"),
                    order.get("currency")
            );

        } catch (RazorpayException exception) {

            throw new IllegalStateException(
                    "Unable to create Razorpay order",
                    exception
            );
        }
    }


    public boolean verifyPayment(
            String pnr,
            String userEmail,
            String razorpayPaymentId,
            String razorpayOrderId,
            String razorpaySignature
    ) {
        Booking booking = bookingRepository.findByPnr(pnr)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Booking not found with PNR: " + pnr
                        )
                );

        if (!booking.getUser()
                .getEmail()
                .equals(userEmail)) {
            throw new IllegalArgumentException(
                    "You are not allowed to verify this booking"
            );
        }

        if (booking.getStatus() != BookingStatus.LOCKED) {
            throw new IllegalArgumentException(
                    "Booking is not available for payment verification"
            );
        }

        if (booking.getLockExpiresAt() == null
                || booking.getLockExpiresAt()
                .isBefore(LocalDateTime.now())) {
            throw new IllegalArgumentException(
                    "Booking lock has expired"
            );
        }

        JSONObject attributes = new JSONObject();

        attributes.put(
                "razorpay_order_id",
                razorpayOrderId
        );

        attributes.put(
                "razorpay_payment_id",
                razorpayPaymentId
        );

        attributes.put(
                "razorpay_signature",
                razorpaySignature
        );

        try {
            return Utils.verifyPaymentSignature(
                    attributes,
                    keySecret
            );
        } catch (RazorpayException exception) {
            throw new IllegalStateException(
                    "Unable to verify Razorpay payment",
                    exception
            );
        }
    }
}