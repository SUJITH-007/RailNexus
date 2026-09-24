package com.railnexus.service;

import com.railnexus.dto.SeatAvailabilityResponse;
import com.railnexus.dto.SeatRequest;
import com.railnexus.dto.SeatResponse;
import com.railnexus.entity.BerthType;
import com.railnexus.entity.Coach;
import com.railnexus.entity.Seat;
import com.railnexus.entity.TrainRoute;
import com.railnexus.exception.ResourceNotFoundException;
import com.railnexus.repository.BookingSeatRepository;
import com.railnexus.repository.CoachRepository;
import com.railnexus.repository.SeatRepository;
import com.railnexus.repository.TrainRouteRepository;
import org.springframework.stereotype.Service;
import com.railnexus.repository.SeatBlockRepository;
import com.railnexus.dto.AdminSeatStatusResponse;
import com.railnexus.entity.SeatStatus;
import java.time.LocalDate;
import java.time.LocalDateTime;
import java.util.List;

import com.railnexus.entity.SeatBlock;

@Service
public class SeatServiceImpl implements SeatService {

    private final SeatRepository seatRepository;
    private final CoachRepository coachRepository;
    private final BookingSeatRepository bookingSeatRepository;
    private final TrainRouteRepository trainRouteRepository;
    private final SeatBlockRepository seatBlockRepository;

    public SeatServiceImpl(
            SeatRepository seatRepository,
            CoachRepository coachRepository,
            BookingSeatRepository bookingSeatRepository,
            TrainRouteRepository trainRouteRepository,
            SeatBlockRepository seatBlockRepository
    ) {
        this.seatRepository = seatRepository;
        this.coachRepository = coachRepository;
        this.bookingSeatRepository = bookingSeatRepository;
        this.trainRouteRepository = trainRouteRepository;
        this.seatBlockRepository = seatBlockRepository;
    }

    @Override
    public SeatResponse createSeat(SeatRequest request) {

        Coach coach = coachRepository.findById(request.coachId())
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Coach not found with id: " + request.coachId()
                        )
                );

        if (seatRepository.existsByCoachIdAndSeatNumber(
                request.coachId(),
                request.seatNumber()
        )) {
            throw new IllegalArgumentException(
                    "Seat already exists in this coach: "
                            + request.seatNumber()
            );
        }

        if (request.seatNumber() > coach.getConfiguration().getPhysicalCapacity()) {
            throw new IllegalArgumentException(
                    "Seat number cannot exceed coach physical capacity: "
                            + coach.getConfiguration().getPhysicalCapacity()
            );
        }

        Seat seat = Seat.builder()
                .coach(coach)
                .seatNumber(request.seatNumber())
                .berthType(request.berthType())
                .position(request.seatNumber())
                .build();

        Seat savedSeat = seatRepository.save(seat);

        return mapToResponse(savedSeat);
    }

    @Override
    public List<SeatResponse> getSeatsByCoach(Long coachId) {

        if (!coachRepository.existsById(coachId)) {
            throw new ResourceNotFoundException(
                    "Coach not found with id: " + coachId
            );
        }

        return seatRepository
                .findByCoachIdOrderBySeatNumber(coachId)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<SeatResponse> generateSeats(Long coachId) {

        Coach coach = coachRepository.findById(coachId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Coach not found with id: " + coachId
                        )
                );

        List<Seat> existingSeats =
                seatRepository.findByCoachIdOrderBySeatNumber(coachId);

        if (!existingSeats.isEmpty()) {
            throw new IllegalArgumentException(
                    "Seats already exist for coach: "
                            + coach.getCoachNumber()
            );
        }

        List<Seat> seats = new java.util.ArrayList<>();

        for (int i = 1; i <= coach.getConfiguration().getPhysicalCapacity(); i++) {

            BerthType berthType;
            int position;

            String classCode = coach.getTrainClass().getCode();

            if (classCode.equals("SL") || classCode.equals("3A")) {
                position = (i - 1) % 8 + 1;

                berthType = switch (position) {
                    case 1, 4 -> BerthType.LOWER;
                    case 2, 5 -> BerthType.MIDDLE;
                    case 3, 6 -> BerthType.UPPER;
                    case 7 -> BerthType.SIDE_LOWER;
                    case 8 -> BerthType.SIDE_UPPER;
                    default -> BerthType.LOWER;
                };

            } else if (classCode.equals("2A")) {
                position = (i - 1) % 6 + 1;

                berthType = switch (position) {
                    case 1, 3 -> BerthType.LOWER;
                    case 2, 4 -> BerthType.UPPER;
                    case 5 -> BerthType.SIDE_LOWER;
                    case 6 -> BerthType.SIDE_UPPER;
                    default -> BerthType.LOWER;
                };

            } else if (classCode.equals("1A")) {
                position = (i - 1) % 4 + 1;

                berthType = switch (position) {
                    case 1, 3 -> BerthType.LOWER;
                    case 2, 4 -> BerthType.UPPER;
                    default -> BerthType.LOWER;
                };

            } else {
                position = i;
                berthType = BerthType.LOWER;
            }

            seats.add(
                    Seat.builder()
                            .coach(coach)
                            .seatNumber(i)
                            .berthType(berthType)
                            .position(position)
                            .build()
            );
        }

        return seatRepository.saveAll(seats)
                .stream()
                .map(this::mapToResponse)
                .toList();
    }

    @Override
    public List<SeatAvailabilityResponse> getSeatAvailability(
            Long coachId,
            String journeyDate,
            String from,
            String to
    ) {

        Coach coach = coachRepository.findById(coachId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Coach not found with id: " + coachId
                        )
                );

        LocalDate date;

        try {
            date = LocalDate.parse(journeyDate);
        } catch (Exception exception) {
            throw new IllegalArgumentException(
                    "Invalid journey date. Use yyyy-MM-dd"
            );
        }

        LocalDateTime journeyDateTime = date.atStartOfDay();

        if (date.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException(
                    "Journey date cannot be in the past"
            );
        }

        if (from == null || from.isBlank() || to == null || to.isBlank()) {
            throw new IllegalArgumentException(
                    "From and to stations are required"
            );
        }

        if (from.equalsIgnoreCase(to)) {
            throw new IllegalArgumentException(
                    "From station and to station cannot be the same"
            );
        }

        List<TrainRoute> routes =
                trainRouteRepository
                        .findByTrainNumberOrderByStopOrder(
                                coach.getTrain().getNumber()
                        );

        TrainRoute fromRoute = routes.stream()
                .filter(route ->
                        route.getStation()
                                .getCode()
                                .equalsIgnoreCase(from)
                )
                .findFirst()
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Train does not operate from station: " + from
                        )
                );

        TrainRoute toRoute = routes.stream()
                .filter(route ->
                        route.getStation()
                                .getCode()
                                .equalsIgnoreCase(to)
                )
                .findFirst()
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Train does not operate to station: " + to
                        )
                );

        if (fromRoute.getStopOrder() >= toRoute.getStopOrder()) {
            throw new IllegalArgumentException(
                    "Invalid journey direction: " + from + " must come before " + to
            );
        }

        System.out.println("========== SEAT AVAILABILITY DEBUG ==========");
        System.out.println("FROM: " + from);
        System.out.println("FROM STOP ORDER: " + fromRoute.getStopOrder());
        System.out.println("TO: " + to);
        System.out.println("TO STOP ORDER: " + toRoute.getStopOrder());
        System.out.println("JOURNEY DATE: " + journeyDateTime);
        System.out.println("TRAIN ID: " + coach.getTrain().getId());
        System.out.println("==============================================");

        return seatRepository
                .findByCoachIdOrderBySeatNumber(coachId)
                .stream()
                .map(seat -> {

                    boolean booked =
                            bookingSeatRepository.isSeatBookedForSegment(
                                    seat.getId(),
                                    coach.getTrain().getId(),
                                    journeyDateTime,
                                    fromRoute.getStopOrder(),
                                    toRoute.getStopOrder()
                            );

                    boolean blocked =
                            seatBlockRepository.existsBySeatIdAndJourneyDateAndActiveTrue(
                                    seat.getId(),
                                    date
                            );

                    SeatStatus status;

                    if (blocked) {
                        status = SeatStatus.BLOCKED;
                    } else if (booked) {
                        status = SeatStatus.BOOKED;
                    } else {
                        status = SeatStatus.AVAILABLE;
                    }

                    return new SeatAvailabilityResponse(
                            seat.getId(),
                            coach.getId(),
                            coach.getCoachNumber(),
                            coach.getTrain().getId(),
                            coach.getTrain().getNumber(),
                            seat.getSeatNumber(),
                            seat.getPosition(),
                            seat.getBerthType(),
                            status
                    );
                })
                .toList();
    }

    @Override
    public List<AdminSeatStatusResponse> getAdminSeatStatus(
            Long coachId,
            String journeyDate,
            String from,
            String to
    ) {

        Coach coach = coachRepository.findById(coachId)
                .orElseThrow(() ->
                        new ResourceNotFoundException(
                                "Coach not found with id: " + coachId
                        )
                );

        LocalDate date;

        try {
            date = LocalDate.parse(journeyDate);
        } catch (Exception exception) {
            throw new IllegalArgumentException(
                    "Invalid journey date. Use yyyy-MM-dd"
            );
        }

        LocalDateTime journeyDateTime = date.atStartOfDay();

        if (date.isBefore(LocalDate.now())) {
            throw new IllegalArgumentException(
                    "Journey date cannot be in the past"
            );
        }

        if (from == null || from.isBlank() || to == null || to.isBlank()) {
            throw new IllegalArgumentException(
                    "From and to stations are required"
            );
        }

        if (from.equalsIgnoreCase(to)) {
            throw new IllegalArgumentException(
                    "From station and to station cannot be the same"
            );
        }

        List<TrainRoute> routes =
                trainRouteRepository
                        .findByTrainNumberOrderByStopOrder(
                                coach.getTrain().getNumber()
                        );

        TrainRoute fromRoute = routes.stream()
                .filter(route ->
                        route.getStation()
                                .getCode()
                                .equalsIgnoreCase(from)
                )
                .findFirst()
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Train does not operate from station: " + from
                        )
                );

        TrainRoute toRoute = routes.stream()
                .filter(route ->
                        route.getStation()
                                .getCode()
                                .equalsIgnoreCase(to)
                )
                .findFirst()
                .orElseThrow(() ->
                        new IllegalArgumentException(
                                "Train does not operate to station: " + to
                        )
                );

        if (fromRoute.getStopOrder() >= toRoute.getStopOrder()) {
            throw new IllegalArgumentException(
                    "Invalid journey direction: " + from
                            + " must come before " + to
            );
        }

        return seatRepository
                .findByCoachIdOrderBySeatNumber(coachId)
                .stream()
                .map(seat -> {

                    boolean booked =
                            bookingSeatRepository.isSeatBookedForSegment(
                                    seat.getId(),
                                    coach.getTrain().getId(),
                                    journeyDateTime,
                                    fromRoute.getStopOrder(),
                                    toRoute.getStopOrder()
                            );

                    SeatBlock activeBlock =
                            seatBlockRepository
                                    .findBySeatIdAndJourneyDateAndActiveTrue(
                                            seat.getId(),
                                            date
                                    )
                                    .stream()
                                    .findFirst()
                                    .orElse(null);

                    boolean blocked = activeBlock != null;

                    SeatStatus status;

                    if (blocked) {
                        status = SeatStatus.BLOCKED;
                    } else if (booked) {
                        status = SeatStatus.BOOKED;
                    } else {
                        status = SeatStatus.AVAILABLE;
                    }

                    return new AdminSeatStatusResponse(
                            seat.getId(),
                            coach.getId(),
                            coach.getCoachNumber(),
                            coach.getTrain().getId(),
                            coach.getTrain().getNumber(),
                            seat.getSeatNumber(),
                            seat.getPosition(),
                            seat.getBerthType(),
                            status,
                            activeBlock != null ? activeBlock.getId():null,
                            activeBlock != null ? activeBlock.getReason() : null
                    );
                })
                .toList();
    }

    private SeatResponse mapToResponse(Seat seat) {

        Coach coach = seat.getCoach();

        return new SeatResponse(
                seat.getId(),
                coach.getId(),
                coach.getCoachNumber(),
                coach.getTrain().getId(),
                coach.getTrain().getNumber(),
                seat.getSeatNumber(),
                seat.getBerthType()
        );
    }
}