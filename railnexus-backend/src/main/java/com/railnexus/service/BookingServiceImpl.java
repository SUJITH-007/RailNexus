    package com.railnexus.service;
    
    import com.railnexus.dto.*;
    import com.railnexus.entity.*;
    import com.railnexus.exception.ResourceNotFoundException;
    import com.railnexus.repository.*;
    import org.springframework.stereotype.Service;
    import org.springframework.transaction.annotation.Transactional;
    import com.railnexus.entity.SeatPreference;
    import org.springframework.beans.factory.annotation.Value;
    import java.time.LocalDate;
    import java.time.LocalDateTime;
    import java.util.ArrayList;
    import java.util.Comparator;
    import java.util.List;
    import java.util.Set;
    import java.util.UUID;
    import java.time.DayOfWeek;
    
    import static com.railnexus.entity.SeatPreference.*;
    
    
    @Service
    public class BookingServiceImpl implements BookingService {
    
        private final BookingRepository bookingRepository;
        private final BookingSeatRepository bookingSeatRepository;
        private final TrainRepository trainRepository;
        private final SeatRepository seatRepository;
        private final UserRepository userRepository;
        private final TrainRouteRepository trainRouteRepository;
        private final TrainScheduleRepository trainScheduleRepository;
        private final SeatBlockRepository seatBlockRepository;
        @Value("${booking.seat-lock-minutes}")
        private long seatLockMinutes;
        private final BookingAllocationRequestService bookingAllocationRequestService;
        private final BookingAllocationRequestRepository bookingAllocationRequestRepository;
    
    
        public BookingServiceImpl(
                BookingRepository bookingRepository,
                BookingSeatRepository bookingSeatRepository,
                TrainRepository trainRepository,
                SeatRepository seatRepository,
                UserRepository userRepository,
                TrainRouteRepository trainRouteRepository,
                TrainScheduleRepository trainScheduleRepository,
                SeatBlockRepository seatBlockRepository,
                BookingAllocationRequestService bookingAllocationRequestService,
                BookingAllocationRequestRepository bookingAllocationRequestRepository
    
        ) {
            this.bookingRepository = bookingRepository;
            this.bookingSeatRepository = bookingSeatRepository;
            this.trainRepository = trainRepository;
            this.seatRepository = seatRepository;
            this.userRepository = userRepository;
            this.trainRouteRepository = trainRouteRepository;
            this.trainScheduleRepository = trainScheduleRepository;
            this.seatBlockRepository = seatBlockRepository;
            this.bookingAllocationRequestService = bookingAllocationRequestService;
            this.bookingAllocationRequestRepository = bookingAllocationRequestRepository;
        }
    
        @Override
        @Transactional(readOnly = true)
        public List<SeatRecommendationResponse> findSeatsForBooking(
                Long trainId,
                LocalDate journeyDate,
                String fromStation,
                String toStation,
                String classCode,
                int passengerCount,
                SeatPreference preference,
                BerthType berthPreference
        ) {
    
            if (passengerCount < 1 || passengerCount > 6) {
                throw new IllegalArgumentException(
                        "Passenger count must be between 1 and 6"
                );
            }
    
            Train train = trainRepository.findById(trainId)
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Train not found with id: " + trainId
                            )
                    );
    
            if (fromStation.equalsIgnoreCase(toStation)) {
                throw new IllegalArgumentException(
                        "From station and to station cannot be the same"
                );
            }
    
            TrainRoute fromRoute =
                    trainRouteRepository.findByTrainNumberOrderByStopOrder(
                                    train.getNumber()
                            )
                            .stream()
                            .filter(route ->
                                    route.getStation().getCode()
                                            .equalsIgnoreCase(fromStation))
                            .findFirst()
                            .orElseThrow(() ->
                                    new IllegalArgumentException(
                                            "Train does not operate from station: "
                                                    + fromStation
                                    )
                            );
    
            TrainRoute toRoute =
                    trainRouteRepository.findByTrainNumberOrderByStopOrder(
                                    train.getNumber()
                            )
                            .stream()
                            .filter(route ->
                                    route.getStation().getCode()
                                            .equalsIgnoreCase(toStation))
                            .findFirst()
                            .orElseThrow(() ->
                                    new IllegalArgumentException(
                                            "Train does not operate to station: "
                                                    + toStation
                                    )
                            );
    
            if (fromRoute.getStopOrder() >= toRoute.getStopOrder()) {
                throw new IllegalArgumentException(
                        "Invalid journey direction"
                );
            }
    
    
            List<Seat> availableSeats = seatRepository.findAll()
                    .stream()
                    .filter(seat ->
                            seat.getCoach().getTrain().getId().equals(trainId))
                    .filter(seat ->
                            Boolean.TRUE.equals(seat.getCoach().getActive()))
                    .filter(seat ->
                            seat.getCoach()
                                    .getTrainClass()
                                    .getCode()
                                    .equalsIgnoreCase(classCode))
                    .filter(seat ->
                            berthPreference == null ||
                            seat.getBerthType() == berthPreference)
                    .filter(seat ->
                            !seatBlockRepository
                                    .existsBySeatIdAndJourneyDateAndActiveTrue(
                                            seat.getId(),
                                            journeyDate
                                    ))
                    .filter(seat ->
                            !bookingSeatRepository.isSeatBookedForSegment(
                                    seat.getId(),
                                    trainId,
                                    journeyDate.atStartOfDay(),
                                    fromRoute.getStopOrder(),
                                    toRoute.getStopOrder()
                            ))
                    .sorted((a, b) -> {
    
                        int coachCompare = a.getCoach()
                                .getCoachNumber()
                                .compareTo(
                                        b.getCoach().getCoachNumber()
                                );
    
                        if (coachCompare != 0) {
                            return coachCompare;
                        }
    
                        return Integer.compare(
                                a.getSeatNumber(),
                                b.getSeatNumber()
                        );
                    })
                    .toList();
    
            if (availableSeats.size() < passengerCount) {
                throw new IllegalArgumentException(
                        "Not enough seats available for "
                                + passengerCount
                                + " passengers"
                );
            }
    
            if (preference == CONSECUTIVE) {
    
                var seatsByBay = availableSeats.stream()
                        .collect(java.util.stream.Collectors.groupingBy(
                                seat -> {
                                    String seatClassCode = seat.getCoach()
                                            .getTrainClass()
                                            .getCode();
    
                                    int baySize;
    
                                    if (seatClassCode.equals("SL") || seatClassCode.equals("3A")) {
                                        baySize = 8;
                                    } else if (seatClassCode.equals("2A")) {
                                        baySize = 6;
                                    } else if (seatClassCode.equals("1A")) {
                                        baySize = 4;
                                    } else {
                                        baySize = passengerCount;
                                    }
    
                                    return seat.getCoach().getId()
                                            + "-" + ((seat.getSeatNumber() - 1) / baySize);
                                }
                        ));
    
                for (List<Seat> baySeats : seatsByBay.values()) {
    
                    if (baySeats.size() >= passengerCount) {
                        return baySeats.stream()
                                .limit(passengerCount)
                                .map(this::mapToSeatRecommendation)
                                .toList();
                    }
                }
    
                preference = SAME_COACH;
            }
    
            if (preference == SAME_COACH) {
    
                var seatsByCoach = availableSeats.stream()
                        .collect(java.util.stream.Collectors.groupingBy(
                                seat -> seat.getCoach().getId()
                        ));
    
                for (List<Seat> coachSeats : seatsByCoach.values()) {
    
                    if (coachSeats.size() >= passengerCount) {
    
                        return coachSeats.stream()
                                .limit(passengerCount)
                                .map(this::mapToSeatRecommendation)
                                .toList();
                    }
                }
    
                throw new IllegalArgumentException(
                        "Could not find enough seats in the same coach"
                );
            }
    
    // NO_PREFERENCE
    
            return availableSeats.stream()
                    .limit(passengerCount)
                    .map(this::mapToSeatRecommendation)
                    .toList();
        }
    
    
        @Override
        @Transactional
        public BookingResponse lockBooking(
                BookingRequest request,
                String userEmail
        ) {
    
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "User not found"
                            )
                    );
    
            Train train = trainRepository.findById(request.trainId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Train not found with id: "
                                            + request.trainId()
                            )
                    );
    
            if (request.fromStation()
                    .equalsIgnoreCase(request.toStation())) {
    
                throw new IllegalArgumentException(
                        "From station and to station cannot be the same"
                );
            }
    
            if (request.journeyDate().isBefore(LocalDate.now())) {
                throw new IllegalArgumentException(
                        "Journey date cannot be in the past"
                );
            }
    
            DayOfWeek journeyDay =
                    request.journeyDate().getDayOfWeek();
    
            if (!trainScheduleRepository.existsByTrainIdAndDayOfWeek(
                    train.getId(),
                    journeyDay
            )) {
                throw new IllegalArgumentException(
                        "Train does not operate on "
                                + journeyDay
                );
            }
    
            int passengerCount = request.passengers().size();
    
            if (passengerCount < 1 || passengerCount > 6) {
                throw new IllegalArgumentException(
                        "Booking must contain between 1 and 6 passengers"
                );
            }
    
            int seniorCount = (int) request.passengers().stream()
                    .filter(passenger -> passenger.age() >= 60)
                    .count();
    
            BookingAllocationRequest allocationRequest =
                    bookingAllocationRequestService.register(
                            request,
                            seniorCount
                    );
    
            LocalDateTime competitionStart =
                    allocationRequest.getReceivedAt()
                            .minusNanos(999_999_999);
    
            LocalDateTime competitionEnd =
                    allocationRequest.getReceivedAt()
                            .plusSeconds(1);
    
            long waitMillis =
                    java.time.Duration.between(
                            java.time.LocalDateTime.now(),
                            competitionEnd
                    ).toMillis();
    
            if (waitMillis > 0) {
                try {
                    Thread.sleep(waitMillis);
                } catch (InterruptedException e) {
                    Thread.currentThread().interrupt();
    
                    throw new IllegalStateException(
                            "Booking allocation was interrupted"
                    );
                }
            }
    
            List<BookingAllocationRequest> competingRequests =
                    bookingAllocationRequestRepository.findCompetingRequests(
                            request.trainId(),
                            request.fromStation(),
                            request.toStation(),
                            request.journeyDate(),
                            request.classCode(),
                            competitionStart,
                            competitionEnd
                    );
    
    
    
            System.out.println("========================================");

            competingRequests.sort(
                    Comparator
                            .comparingInt(
                                    BookingAllocationRequest::getSeniorCount
                            )
                            .reversed()
                            .thenComparing(
                                    Comparator.comparingInt(
                                            BookingAllocationRequest::getBerthPreferenceCount
                                    ).reversed()
                            )
                            .thenComparing(
                                    Comparator.comparingInt(
                                            (BookingAllocationRequest allocation) -> {
                                                return switch (allocation.getSeatPreference()) {
                                                    case CONSECUTIVE -> 3;
                                                    case SAME_COACH -> 2;
                                                    case NO_PREFERENCE -> 1;
                                                };
                                            }
                                    ).reversed()
                            )
                            .thenComparing(
                                    BookingAllocationRequest::getReceivedAt
                            )
                            .thenComparing(
                                    BookingAllocationRequest::getId
                            )
            );
    
            if (competingRequests.isEmpty()
                    || !competingRequests.get(0)
                    .getRequestId()
                    .equals(allocationRequest.getRequestId())) {
    
                throw new IllegalArgumentException(
                        "Another booking request has priority"
                );
            }
    
            allocationRequest.setStatus(
                    AllocationRequestStatus.PROCESSING
            );
    
            bookingAllocationRequestRepository.save(
                    allocationRequest
            );
    
            TrainRoute fromRoute =
                    trainRouteRepository
                            .findByTrainNumberOrderByStopOrder(
                                    train.getNumber()
                            )
                            .stream()
                            .filter(route ->
                                    route.getStation()
                                            .getCode()
                                            .equalsIgnoreCase(
                                                    request.fromStation()
                                            )
                            )
                            .findFirst()
                            .orElseThrow(() ->
                                    new IllegalArgumentException(
                                            "Train does not operate from station: "
                                                    + request.fromStation()
                                    )
                            );
    
            TrainRoute toRoute =
                    trainRouteRepository
                            .findByTrainNumberOrderByStopOrder(
                                    train.getNumber()
                            )
                            .stream()
                            .filter(route ->
                                    route.getStation()
                                            .getCode()
                                            .equalsIgnoreCase(
                                                    request.toStation()
                                            )
                            )
                            .findFirst()
                            .orElseThrow(() ->
                                    new IllegalArgumentException(
                                            "Train does not operate to station: "
                                                    + request.toStation()
                                    )
                            );
    
            if (fromRoute.getStopOrder()
                    >= toRoute.getStopOrder()) {
    
                throw new IllegalArgumentException(
                        "Invalid journey direction: "
                                + request.fromStation()
                                + " must come before "
                                + request.toStation()
                );
            }
    
            List<Seat> availableSeats =
                    seatRepository.findSeatsForAllocation(
                                    train.getId(),
                                    request.classCode()
                            )
                            .stream()
                            .filter(seat ->
                                    !seatBlockRepository
                                            .existsBySeatIdAndJourneyDateAndActiveTrue(
                                                    seat.getId(),
                                                    request.journeyDate()
                                            )
                            )
                            .filter(seat ->
                                    !bookingSeatRepository.isSeatBookedForSegment(
                                            seat.getId(),
                                            train.getId(),
                                            request.journeyDate().atStartOfDay(),
                                            fromRoute.getStopOrder(),
                                            toRoute.getStopOrder()
                                    )
                            )
                            .toList();
    
            if (availableSeats.size() < passengerCount) {
                throw new IllegalArgumentException(
                        "Not enough seats available for "
                                + passengerCount
                                + " passengers in class "
                                + request.classCode()
                );
            }
    
            List<Seat> allocatedSeats =
                    allocateSeats(
                            availableSeats,
                            request.passengers(),
                            request.seatPreference()
                    );
    
            if (allocatedSeats.size() != passengerCount) {
                throw new IllegalArgumentException(
                        "Could not allocate seats for all passengers"
                );
            }
    
            String pnr = generatePnr();
    
            Booking booking = Booking.builder()
                    .pnr(pnr)
                    .user(user)
                    .train(train)
                    .fromStation(request.fromStation())
                    .toStation(request.toStation())
                    .journeyDate(
                            request.journeyDate().atStartOfDay()
                    )
                    .passengerCount(passengerCount)
                    .status(BookingStatus.LOCKED)
                    .totalFare(
                            calculateFare(passengerCount)
                    )
                    .lockExpiresAt(
                            java.time.LocalDateTime.now()
                                    .plusMinutes(seatLockMinutes)
                    )
                    .build();
    
            Booking savedBooking =
                    bookingRepository.save(booking);
    
            for (int i = 0; i < request.passengers().size(); i++) {
    
                PassengerRequest passenger =
                        request.passengers().get(i);
    
                Seat seat = allocatedSeats.get(i);
    
                BookingSeat bookingSeat =
                        BookingSeat.builder()
                                .booking(savedBooking)
                                .seat(seat)
                                .passengerName(passenger.name())
                                .passengerAge(passenger.age())
                                .passengerGender(passenger.gender())
                                .build();
    
                bookingSeatRepository.save(bookingSeat);
            }
    
            allocationRequest.setStatus(
                    AllocationRequestStatus.PROCESSED
            );
    
            bookingAllocationRequestRepository.save(
                    allocationRequest
            );
    
            return mapToResponse(savedBooking);
        }
    
        @Override
        @Transactional
        public BookingResponse confirmBooking(
                String pnr,
                String userEmail
        ) {
    
            Booking booking =
                    bookingRepository.findByPnr(pnr)
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Booking not found with PNR: "
                                                    + pnr
                                    )
                            );
    
            if (!booking.getUser()
                    .getEmail()
                    .equals(userEmail)) {
    
                throw new IllegalArgumentException(
                        "You are not allowed to confirm this booking"
                );
            }
    
            if (booking.getStatus()
                    != BookingStatus.LOCKED) {
    
                throw new IllegalArgumentException(
                        "Booking is not currently locked"
                );
            }
    
            if (booking.getLockExpiresAt() == null
                    || !booking.getLockExpiresAt()
                    .isAfter(java.time.LocalDateTime.now())) {
    
                booking.setStatus(
                        BookingStatus.CANCELLED
                );
    
                bookingRepository.save(booking);
    
                throw new IllegalArgumentException(
                        "Booking lock has expired"
                );
            }
    
            booking.setStatus(
                    BookingStatus.CONFIRMED
            );
    
            booking.setLockExpiresAt(null);
    
            Booking savedBooking =
                    bookingRepository.save(booking);
    
            return mapToResponse(savedBooking);
        }
    
        @Override
        @Transactional
        public BookingResponse createBooking(
                BookingRequest request,
                String userEmail
        ) {
    
            SeatPreference preference = request.seatPreference();
    
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "User not found"
                            )
                    );
    
            Train train = trainRepository.findById(request.trainId())
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "Train not found with id: "
                                            + request.trainId()
                            )
                    );
    
    
            if (request.fromStation()
                    .equalsIgnoreCase(request.toStation())) {
    
                throw new IllegalArgumentException(
                        "From station and to station cannot be the same"
                );
            }
    
            if (request.journeyDate().isBefore(LocalDate.now())) {
                throw new IllegalArgumentException(
                        "Journey date cannot be in the past"
                );
            }
    
            DayOfWeek journeyDay =
                    request.journeyDate().getDayOfWeek();
    
            if (!trainScheduleRepository.existsByTrainIdAndDayOfWeek(
                    train.getId(),
                    journeyDay
            )) {
                throw new IllegalArgumentException(
                        "Train does not operate on "
                                + journeyDay
                );
            }
    
            int passengerCount = request.passengers().size();
    
            if (passengerCount < 1 || passengerCount > 6) {
                throw new IllegalArgumentException(
                        "Booking must contain between 1 and 6 passengers"
                );
            }
    
    
            TrainRoute fromRoute =
                    trainRouteRepository
                            .findByTrainNumberOrderByStopOrder(
                                    train.getNumber()
                            )
                            .stream()
                            .filter(route ->
                                    route.getStation()
                                            .getCode()
                                            .equalsIgnoreCase(
                                                    request.fromStation()
                                            )
                            )
                            .findFirst()
                            .orElseThrow(() ->
                                    new IllegalArgumentException(
                                            "Train does not operate from station: "
                                                    + request.fromStation()
                                    )
                            );
    
            TrainRoute toRoute =
                    trainRouteRepository
                            .findByTrainNumberOrderByStopOrder(
                                    train.getNumber()
                            )
                            .stream()
                            .filter(route ->
                                    route.getStation()
                                            .getCode()
                                            .equalsIgnoreCase(
                                                    request.toStation()
                                            )
                            )
                            .findFirst()
                            .orElseThrow(() ->
                                    new IllegalArgumentException(
                                            "Train does not operate to station: "
                                                    + request.toStation()
                                    )
                            );
    
            if (fromRoute.getStopOrder()
                    >= toRoute.getStopOrder()) {
    
                throw new IllegalArgumentException(
                        "Invalid journey direction: "
                                + request.fromStation()
                                + " must come before "
                                + request.toStation()
                );
            }
    
            List<Seat> availableSeats =
                    seatRepository.findSeatsForAllocation(
                                    train.getId(),
                                    request.classCode()
                            )
                            .stream()
                            .filter(seat ->
                                    !seatBlockRepository
                                            .existsBySeatIdAndJourneyDateAndActiveTrue(
                                                    seat.getId(),
                                                    request.journeyDate()
                                            )
                            )
                            .filter(seat ->
                                    !bookingSeatRepository.isSeatBookedForSegment(
                                            seat.getId(),
                                            train.getId(),
                                            request.journeyDate().atStartOfDay(),
                                            fromRoute.getStopOrder(),
                                            toRoute.getStopOrder()
                                    )
                            )
                            .toList();
    
            if (availableSeats.size() < passengerCount) {
                throw new IllegalArgumentException(
                        "Not enough seats available for "
                                + passengerCount
                                + " passengers in class "
                                + request.classCode()
                );
            }
    
            List<Seat> allocatedSeats =
                    allocateSeats(
                            availableSeats,
                            request.passengers(),
                            request.seatPreference()
                    );
    
            if (allocatedSeats.size() != passengerCount) {
                throw new IllegalArgumentException(
                        "Could not allocate seats for all passengers"
                );
            }
    
            String pnr = generatePnr();
    
            Booking booking = Booking.builder()
                    .pnr(pnr)
                    .user(user)
                    .train(train)
                    .fromStation(
                            request.fromStation()
                    )
                    .toStation(
                            request.toStation()
                    )
                    .journeyDate(
                            request.journeyDate()
                                    .atStartOfDay()
                    )
                    .passengerCount(
                            passengerCount
                    )
                    .status(
                            BookingStatus.CONFIRMED
                    )
                    .totalFare(
                            calculateFare(
                                    passengerCount
                            )
                    )
                    .build();
    
            Booking savedBooking =
                    bookingRepository.save(booking);
    
            for (int i = 0; i < request.passengers().size(); i++) {
    
                PassengerRequest passenger =
                        request.passengers().get(i);
    
                Seat seat = allocatedSeats.get(i);
    
                BookingSeat bookingSeat =
                        BookingSeat.builder()
                                .booking(savedBooking)
                                .seat(seat)
                                .passengerName(passenger.name())
                                .passengerAge(passenger.age())
                                .passengerGender(passenger.gender())
                                .build();
    
                bookingSeatRepository.save(bookingSeat);
            }
    
            return mapToResponse(savedBooking);
        }
    
        @Override
        @Transactional(readOnly = true)
        public BookingResponse getBookingByPnr(
                String pnr,
                String userEmail
        ) {
    
            Booking booking =
                    bookingRepository.findByPnr(pnr)
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Booking not found with PNR: "
                                                    + pnr
                                    )
                            );
    
            if (!booking.getUser()
                    .getEmail()
                    .equals(userEmail)) {
    
                throw new IllegalArgumentException(
                        "You are not allowed to view this booking"
                );
            }
    
            return mapToResponse(booking);
        }

        @Override
        @Transactional(readOnly = true)
        public List<BookingResponse> getMyBookings(
                String userEmail
        ) {
            User user = userRepository.findByEmail(userEmail)
                    .orElseThrow(() ->
                            new ResourceNotFoundException(
                                    "User not found"
                            )
                    );

            return bookingRepository
                    .findByUserIdOrderByJourneyDateDesc(user.getId())
                    .stream()
                    .map(this::mapToResponse)
                    .toList();
        }
    
        @Override
        @Transactional
        public void cancelBooking(
                String pnr,
                String userEmail
        ) {
    
            Booking booking =
                    bookingRepository.findByPnr(pnr)
                            .orElseThrow(() ->
                                    new ResourceNotFoundException(
                                            "Booking not found with PNR: "
                                                    + pnr
                                    )
                            );
    
            if (!booking.getUser()
                    .getEmail()
                    .equals(userEmail)) {
    
                throw new IllegalArgumentException(
                        "You are not allowed to cancel this booking"
                );
            }
    
            if (booking.getStatus()
                    == BookingStatus.CANCELLED) {
    
                throw new IllegalArgumentException(
                        "Booking is already cancelled"
                );
            }
    
            booking.setStatus(
                    BookingStatus.CANCELLED
            );
    
            bookingRepository.save(booking);
        }
    
        private String generatePnr() {
    
            String pnr;
    
            do {
    
                pnr = "RN"
                        + UUID.randomUUID()
                        .toString()
                        .substring(0, 8)
                        .toUpperCase();
    
            } while (
                    bookingRepository.existsByPnr(pnr)
            );
    
            return pnr;
        }
    
        private double calculateFare(
                int passengerCount
        ) {
    
            double baseFare = 450.0;
    
            return baseFare * passengerCount;
        }
    
        private BookingResponse mapToResponse(
                Booking booking
        ) {
    
            List<BookingSeatResponse> seats =
                    bookingSeatRepository
                            .findByBookingId(
                                    booking.getId()
                            )
                            .stream()
                            .map(bs -> {
    
                                Seat seat =
                                        bs.getSeat();
    
                                return new BookingSeatResponse(
                                        seat.getId(),
                                        seat.getSeatNumber(),
                                        seat.getCoach()
                                                .getCoachNumber(),
                                        seat.getBerthType()
                                                .toString(),
                                        bs.getPassengerName(),
                                        bs.getPassengerAge(),
                                        bs.getPassengerGender()
                                );
                            })
                            .toList();

            String classCode = bookingSeatRepository
                    .findByBookingId(booking.getId())
                    .stream()
                    .findFirst()
                    .map(bs -> bs.getSeat().getCoach().getTrainClass().getCode())
                    .orElse(null);

            return new BookingResponse(
                    booking.getId(),
                    booking.getPnr(),
                    booking.getTrain().getId(),
                    booking.getTrain().getNumber(),
                    booking.getTrain().getName(),
                    booking.getFromStation(),
                    booking.getToStation(),
                    booking.getJourneyDate()
                            .toLocalDate(),
                    classCode,
                    booking.getPassengerCount(),
                    booking.getStatus(),
                    booking.getTotalFare(),
                    booking.getCreatedAt(),
                    seats
            );
        }
    
        private SeatRecommendationResponse mapToSeatRecommendation(Seat seat) {
            return new SeatRecommendationResponse(
                    seat.getId(),
                    seat.getSeatNumber(),
                    seat.getPosition(),
                    seat.getCoach().getCoachNumber(),
                    seat.getCoach().getId(),
                    seat.getCoach().getTrain().getId(),
                    seat.getCoach().getTrain().getNumber(),
                    seat.getBerthType()
            );
        }
        private List<Seat> allocateSeats(
                List<Seat> availableSeats,
                List<PassengerRequest> passengers,
                SeatPreference preference
        ) {
    
            List<Seat> allocatedSeats = new ArrayList<>();
    
            if (preference == SAME_COACH) {
    
                var seatsByCoach = availableSeats.stream()
                        .collect(java.util.stream.Collectors.groupingBy(
                                seat -> seat.getCoach().getId()
                        ));
    
                for (List<Seat> coachSeats : seatsByCoach.values()) {
    
                    if (coachSeats.size() < passengers.size()) {
                        continue;
                    }
    
                    allocatedSeats.addAll(
                            allocatePassengersToSeats(
                                    coachSeats,
                                    passengers
                            )
                    );
    
                    if (allocatedSeats.size() == passengers.size()) {
                        return allocatedSeats;
                    }
    
                    allocatedSeats.clear();
                }
    
                throw new IllegalArgumentException(
                        "Could not allocate all passengers in the same coach"
                );
            }
    
            if (preference == CONSECUTIVE) {
    
                var seatsByCoach = availableSeats.stream()
                        .collect(java.util.stream.Collectors.groupingBy(
                                seat -> seat.getCoach().getId()
                        ));
    
                for (List<Seat> coachSeats : seatsByCoach.values()) {
    
                    coachSeats.sort(
                            Comparator.comparing(Seat::getSeatNumber)
                    );
    
                    for (int start = 0;
                         start <= coachSeats.size() - passengers.size();
                         start++) {
    
                        List<Seat> candidateSeats =
                                coachSeats.subList(
                                        start,
                                        start + passengers.size()
                                );
    
                        boolean consecutive = true;
    
                        for (int i = 1; i < candidateSeats.size(); i++) {
    
                            if (candidateSeats.get(i).getSeatNumber()
                                    != candidateSeats.get(i - 1).getSeatNumber() + 1) {
    
                                consecutive = false;
                                break;
                            }
                        }
    
                        if (!consecutive) {
                            continue;
                        }
    
                        List<Seat> allocated =
                                allocatePassengersToSeats(
                                        candidateSeats,
                                        passengers
                                );
    
                        if (allocated.size() == passengers.size()) {
                            return allocated;
                        }
                    }
                }
    
                throw new IllegalArgumentException(
                        "Could not allocate consecutive seats"
                );
            }
    
            return allocatePassengersToSeats(
                    availableSeats,
                    passengers
            );
        }
    
        private List<Seat> allocatePassengersToSeats(
                List<Seat> seats,
                List<PassengerRequest> passengers
        ) {
    
            List<Seat> remainingSeats =
                    new ArrayList<>(seats);
    
            List<Seat> allocatedSeats =
                    new ArrayList<>(
                            java.util.Collections.nCopies(
                                    passengers.size(),
                                    null
                            )
                    );
    
            List<Integer> passengerOrder =
                    new ArrayList<>();
    
            for (int i = 0; i < passengers.size(); i++) {
                passengerOrder.add(i);
            }
    
            passengerOrder.sort(
                    Comparator
                            .comparing(
                                    (Integer index) ->
                                            passengers.get(index).age() >= 60
                            )
                            .reversed()
                            .thenComparing(
                                    index ->
                                            passengers.get(index).berthPreference() == null
                            )
                            .thenComparingInt(
                                    Integer::intValue
                            )
            );
    
            for (Integer passengerIndex : passengerOrder) {
    
                PassengerRequest passenger =
                        passengers.get(passengerIndex);
    
                Seat selectedSeat =
                        remainingSeats.stream()
                                .filter(seat ->
                                        passenger.berthPreference() != null
                                                && seat.getBerthType()
                                                == passenger.berthPreference()
                                )
                                .findFirst()
                                .orElse(null);
    
                if (selectedSeat != null) {
    
                    allocatedSeats.set(
                            passengerIndex,
                            selectedSeat
                    );
    
                    remainingSeats.remove(selectedSeat);
                }
            }
    
            for (Integer passengerIndex : passengerOrder) {
    
                if (allocatedSeats.get(passengerIndex) != null) {
                    continue;
                }
    
                Seat selectedSeat =
                        remainingSeats.stream()
                                .findFirst()
                                .orElse(null);
    
                if (selectedSeat == null) {
                    return new ArrayList<>();
                }
    
                allocatedSeats.set(
                        passengerIndex,
                        selectedSeat
                );
    
                remainingSeats.remove(selectedSeat);
            }
    
            return allocatedSeats;
        }
    }