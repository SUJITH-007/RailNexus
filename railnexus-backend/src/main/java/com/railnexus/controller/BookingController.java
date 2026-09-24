package com.railnexus.controller;

import com.railnexus.dto.*;
import com.railnexus.entity.BerthType;
import com.railnexus.service.BookingService;
import com.railnexus.service.RazorpayService;
import jakarta.validation.Valid;
import org.springframework.http.HttpStatus;
import org.springframework.security.core.Authentication;
import org.springframework.web.bind.annotation.*;
import com.railnexus.entity.User;
import com.railnexus.entity.SeatPreference;
import com.railnexus.entity.Coach;
import com.railnexus.service.CoachService;
import com.railnexus.service.SeatService;
import java.time.LocalDate;
import java.util.List;

@RestController
@RequestMapping("/api/bookings")
public class BookingController {

    private final BookingService bookingService;
    private final CoachService coachService;
    private final SeatService seatService;
    private final RazorpayService razorpayService;

    public BookingController(
            BookingService bookingService,
            CoachService coachService,
            SeatService seatService,
            RazorpayService razorpayService
    ) {
        this.bookingService = bookingService;
        this.coachService = coachService;
        this.seatService = seatService;
        this.razorpayService = razorpayService;
    }

    @PostMapping("/lock")
    @ResponseStatus(HttpStatus.CREATED)
    public BookingResponse lockBooking(
            @Valid @RequestBody BookingRequest request,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        return bookingService.lockBooking(
                request,
                user.getEmail()
        );
    }

    @PostMapping("/{pnr}/confirm")
    public BookingResponse confirmBooking(
            @PathVariable String pnr,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        return bookingService.confirmBooking(
                pnr,
                user.getEmail()
        );
    }

    @PostMapping
    @ResponseStatus(HttpStatus.CREATED)
    public BookingResponse createBooking(
            @Valid @RequestBody BookingRequest request,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        return bookingService.createBooking(
                request,
                user.getEmail()
        );
    }

    @GetMapping("/{pnr}")
    public BookingResponse getBookingByPnr(
            @PathVariable String pnr,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        return bookingService.getBookingByPnr(
                pnr,
                user.getEmail()
        );
    }

    @GetMapping("/my-bookings")
    public List<BookingResponse> getMyBookings(
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();
        return bookingService.getMyBookings(user.getEmail());
    }


    @PutMapping("/{pnr}/cancel")
    @ResponseStatus(HttpStatus.NO_CONTENT)
    public void cancelBooking(
            @PathVariable String pnr,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        bookingService.cancelBooking(
                pnr,
                user.getEmail()
        );
    }

    @PostMapping("/seat-recommendations")
    public List<SeatRecommendationResponse> findSeatsForBooking(
            @RequestParam Long trainId,
            @RequestParam LocalDate journeyDate,
            @RequestParam String fromStation,
            @RequestParam String toStation,
            @RequestParam String classCode,
            @RequestParam int passengerCount,
            @RequestParam SeatPreference preference,
            @RequestParam(required = false) BerthType berthPreference
    ) {
        return bookingService.findSeatsForBooking(
                trainId,
                journeyDate,
                fromStation,
                toStation,
                classCode,
                passengerCount,
                preference,
                berthPreference
        );
    }

    @GetMapping("/class-availability")
    public List<ClassAvailabilityResponse> getClassAvailability(
            @RequestParam Long trainId,
            @RequestParam LocalDate journeyDate,
            @RequestParam String from,
            @RequestParam String to
    ) {
        List<CoachResponse> coaches = coachService.getCoachesByTrain(trainId);

        return coaches.stream()
                .collect(java.util.stream.Collectors.groupingBy(
                        coach -> coach.classCode(),
                        java.util.LinkedHashMap::new,
                        java.util.stream.Collectors.toList()
                ))
                .entrySet()
                .stream()
                .map(entry -> {
                    String classCode = entry.getKey();
                    List<CoachResponse> classCoaches = entry.getValue();

                    int availableSeats = classCoaches.stream()
                            .mapToInt(coach ->
                                    seatService.getSeatAvailability(
                                                    coach.id(),
                                                    journeyDate.toString(),
                                                    from,
                                                    to
                                            )
                                            .stream()
                                            .mapToInt(seat -> seat.status() == com.railnexus.entity.SeatStatus.AVAILABLE ? 1 : 0)
                                            .sum()
                            )
                            .sum();

                    CoachResponse firstCoach = classCoaches.get(0);

                    return new ClassAvailabilityResponse(
                            classCode,
                            firstCoach.className(),
                            availableSeats
                    );
                })
                .toList();
    }

    @PostMapping("/payment-order/{pnr}")
    public RazorpayOrderResponse createPaymentOrder(
            @PathVariable String pnr,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        return razorpayService.createOrder(
                pnr,
                user.getEmail()
        );
    }

    @PostMapping("/payment/verify")
    public BookingResponse verifyPayment(
            @Valid @RequestBody RazorpayPaymentVerificationRequest request,
            Authentication authentication
    ) {
        User user = (User) authentication.getPrincipal();

        boolean verified = razorpayService.verifyPayment(
                request.pnr(),
                user.getEmail(),
                request.razorpayPaymentId(),
                request.razorpayOrderId(),
                request.razorpaySignature()
        );

        if (!verified) {
            throw new IllegalArgumentException(
                    "Razorpay payment verification failed"
            );
        }

        return bookingService.confirmBooking(
                request.pnr(),
                user.getEmail()
        );
    }
}