import { useState, useEffect } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import "../../styles/Booking.css";

function Booking() {
    const { trainNumber } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const selectedClass = searchParams.get("class");
    const trainId = searchParams.get("trainId");
    const fromStation = searchParams.get("from");
    const toStation = searchParams.get("to");
    const journeyDate = searchParams.get("date");
    const [train, setTrain] = useState(null);
    const [loading, setLoading] = useState(true);


    const [passengers, setPassengers] = useState([
        {
            id: 1,
            name: "",
            age: "",
            gender: "",
            seatPreference: ""
        }
    ]);

    const [arrangementPreference, setArrangementPreference] = useState("NO_PREFERENCE");
    const [lockedBooking, setLockedBooking] = useState(null);
    const [lockingSeat, setLockingSeat] = useState(false);
    const [unlockingSeat, setUnlockingSeat] = useState(false);

    useEffect(() => {
        const fetchTrainDetails = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    `http://localhost:8080/api/train-routes/train/${trainId}?journeyDate=${journeyDate}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch train details");
                }

                const data = await response.json();
                setTrain(data);
            } catch (error) {
                setTrain(null);
            } finally {
                setLoading(false);
            }
        };

        if (trainId && journeyDate) {
            fetchTrainDetails();
        } else {
            setLoading(false);
        }
    }, [trainId, journeyDate]);

    function handlePassengerChange(passengerId, field, value) {
        setPassengers((currentPassengers) =>
            currentPassengers.map((passenger) =>
                passenger.id === passengerId
                    ? {
                        ...passenger,
                        [field]: value
                    }
                    : passenger
            )
        );
    }


    function isPassengerComplete(passenger) {
        return (
            passenger.name.trim() !== "" &&
            passenger.age !== "" &&
            Number(passenger.age) >= 1 &&
            passenger.gender !== "" &&
            (selectedClass === "CC" ||
                selectedClass === "EC" ||
                selectedClass === "2S" ||
                passenger.seatPreference !== "")
        );
    }

    function areAllPassengersComplete() {
        return passengers.every((passenger) =>
            isPassengerComplete(passenger)
        );
    }

    async function handleLockSeat() {
        if (!areAllPassengersComplete()) {
            return;
        }

        try {
            setLockingSeat(true);

            const token = localStorage.getItem("token");

            const bookingRequest = {
                trainId: train.trainId,
                fromStation: fromStation,
                toStation: toStation,
                journeyDate: journeyDate,
                classCode: selectedClass,
                seatPreference: arrangementPreference,
                passengers: passengers.map((passenger) => ({
                    name: passenger.name,
                    age: Number(passenger.age),
                    gender: passenger.gender,
                    berthPreference:
                        passenger.seatPreference === ""
                            ? null
                            : passenger.seatPreference
                }))
            };

            const response = await fetch(
                "http://localhost:8080/api/bookings/lock",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`
                    },
                    body: JSON.stringify(bookingRequest)
                }
            );

            if (!response.ok) {
                const errorData = await response.text();

                throw new Error(
                    errorData || "Unable to lock booking"
                );
            }

            const data = await response.json();

            setLockedBooking(data);
        } catch (error) {
            console.error(error);
        } finally {
            setLockingSeat(false);
        }
    }

    async function handleUnlockSeat() {
        if (!lockedBooking) {
            return;
        }

        try {
            setUnlockingSeat(true);

            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:8080/api/bookings/${lockedBooking.pnr}/cancel`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!response.ok) {
                const errorData = await response.text();
                throw new Error(
                    errorData || "Unable to unlock the selected seat"
                );
            }

            setLockedBooking(null);
        } catch (error) {
            console.error(error);
        } finally {
            setUnlockingSeat(false);
        }
    }

    function handleContinueToPayment() {
        if (!lockedBooking) {
            return;
        }

        navigate(
            `/payment/${train.trainNumber}?class=${travelClass.code}&trainId=${train.trainId}&from=${fromStation}&to=${toStation}&date=${journeyDate}`,
            {
                state: {
                    passengers: passengers,
                    booking: lockedBooking
                }
            }
        );
    }

    function handleAddPassenger() {
        const currentPassenger = passengers[passengers.length - 1];

        if (!isPassengerComplete(currentPassenger)) {
            return;
        }

        if (passengers.length >= 6) {
            return;
        }

        setPassengers((currentPassengers) => [
            ...currentPassengers,
            {
                id: Date.now(),
                name: "",
                age: "",
                gender: "",
                seatPreference: ""
            }
        ]);
    }

    function handleRemovePassenger(passengerId) {
        setPassengers((currentPassengers) =>
            currentPassengers.filter(
                (passenger) => passenger.id !== passengerId
            )
        );
    }

    function handleClearPassenger(passengerId) {
        setPassengers((currentPassengers) =>
            currentPassengers.map((passenger) =>
                passenger.id === passengerId
                    ? {
                        ...passenger,
                        name: "",
                        age: "",
                        gender: "",
                        seatPreference: ""
                    }
                    : passenger
            )
        );
    }

    const travelClass = train?.classes?.find(
        (classItem) => classItem.code === selectedClass
    );

    const routes = train?.routes || [];

    const firstRoute = routes[0];
    const lastRoute = routes[routes.length - 1];

    const formatTime = (time) => {
        if (!time) {
            return "—";
        }

        return time.substring(0, 5);
    };

    if (!train || !travelClass) {
        return (
            <div className="booking-not-found">
                <h1>Booking Details Not Found</h1>

                <p>
                    The selected train or travel class could not be found.
                </p>

                <Link to="/trains">
                    Back to Train Search
                </Link>
            </div>
        );
    }

    return (
        <div className="booking-page">
            <section className="booking-header">
                <div className="booking-header-content">
                    <Link
                        to={`/trains/${train.trainNumber}?trainId=${train.trainId}&from=${fromStation}&to=${toStation}&date=${journeyDate}`}
                        className="booking-back-link"
                    >
                        ← Back to Train Details
                    </Link>

                    <p className="booking-tagline">
                        COMPLETE YOUR BOOKING
                    </p>

                    <h1>Book Your Journey</h1>

                    <p>
                        Enter passenger details and review your journey
                        before continuing.
                    </p>
                </div>
            </section>

            <main className="booking-content">
                <section className="booking-journey-card">
                    <div className="booking-journey-heading">
                        <div>
                            <span>{train.trainNumber}</span>
                            <h2>{train.trainName}</h2>
                        </div>

                        <strong>{travelClass.name}</strong>
                    </div>

                    <div className="booking-journey-details">
                        <div>
                            <span>FROM</span>
                            <strong>{fromStation}</strong>
                            <p>{formatTime(firstRoute?.departureTime)}</p>
                        </div>

                        <div className="booking-journey-line">
                            <span>{journeyDate}</span>
                            <div></div>
                        </div>

                        <div>
                            <span>TO</span>
                            <strong>{toStation}</strong>
                            <p>{formatTime(lastRoute?.arrivalTime)}</p>
                        </div>
                    </div>
                </section>

                <div className="booking-layout">
                    <section className="booking-passenger-card">
                        <div className="booking-section-heading">
                            <p>PASSENGER DETAILS</p>
                            <h2>Passenger Details</h2>
                        </div>

                        <div className="booking-section">
                            <h2>Seat Arrangement</h2>

                            <select
                                value={arrangementPreference}
                                onChange={(e) =>
                                    setArrangementPreference(e.target.value)
                                }
                            >
                                <option value="NO_PREFERENCE">
                                    No Preference
                                </option>

                                <option value="CONSECUTIVE">
                                    Keep Seats Together
                                </option>

                                <option value="SAME_COACH">
                                    Same Coach
                                </option>
                            </select>
                        </div>

                        {passengers.map((passenger, index) => (
                            <div
                                className="booking-passenger-form"
                                key={passenger.id}
                            >
                                <div className="booking-passenger-heading">
                                    <h3>Passenger {index + 1}</h3>

                                    {index === 0 ? (
                                        <button
                                            className="booking-clear-passenger-button"
                                            type="button"
                                            onClick={() =>
                                                handleClearPassenger(
                                                    passenger.id
                                                )
                                            }
                                        >
                                            Clear Details
                                        </button>
                                    ) : (
                                        <button
                                            className="booking-remove-passenger-button"
                                            type="button"
                                            onClick={() =>
                                                handleRemovePassenger(
                                                    passenger.id
                                                )
                                            }
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>

                                <div className="booking-form">
                                    <div className="booking-input-group booking-input-full">
                                        <label
                                            htmlFor={`passenger-name-${passenger.id}`}
                                        >
                                            Full Name
                                        </label>

                                        <input
                                            id={`passenger-name-${passenger.id}`}
                                            type="text"
                                            placeholder="Enter passenger name"
                                            value={passenger.name}
                                            onChange={(event) =>
                                                handlePassengerChange(
                                                    passenger.id,
                                                    "name",
                                                    event.target.value
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="booking-input-group">
                                        <label
                                            htmlFor={`passenger-age-${passenger.id}`}
                                        >
                                            Age
                                        </label>

                                        <input
                                            id={`passenger-age-${passenger.id}`}
                                            type="number"
                                            min="1"
                                            max="120"
                                            placeholder="Age"
                                            value={passenger.age}
                                            onChange={(event) =>
                                                handlePassengerChange(
                                                    passenger.id,
                                                    "age",
                                                    event.target.value
                                                )
                                            }
                                        />
                                    </div>

                                    <div className="booking-input-group">
                                        <label
                                            htmlFor={`passenger-gender-${passenger.id}`}
                                        >
                                            Gender
                                        </label>

                                        <select
                                            id={`passenger-gender-${passenger.id}`}
                                            value={passenger.gender}
                                            onChange={(event) =>
                                                handlePassengerChange(
                                                    passenger.id,
                                                    "gender",
                                                    event.target.value
                                                )
                                            }
                                        >
                                            <option value="">
                                                Select gender
                                            </option>

                                            <option value="MALE">
                                                Male
                                            </option>

                                            <option value="FEMALE">
                                                Female
                                            </option>

                                            <option value="OTHER">
                                                Other
                                            </option>
                                        </select>
                                    </div>

                                    <div className="booking-input-group booking-input-full">
                                        <label
                                            htmlFor={`seat-preference-${passenger.id}`}
                                        >
                                            Seat Preference
                                        </label>

                                        <select
                                            id={`seat-preference-${passenger.id}`}
                                            value={passenger.seatPreference}
                                            onChange={(event) =>
                                                handlePassengerChange(
                                                    passenger.id,
                                                    "seatPreference",
                                                    event.target.value
                                                )
                                            }
                                        >
                                            <option value="">
                                                No preference
                                            </option>

                                            {selectedClass !== "CC" &&
                                                selectedClass !== "EC" &&
                                                selectedClass !== "2S" && (
                                                    <>
                                                        <option value="LOWER">
                                                            Lower
                                                        </option>

                                                        <option value="MIDDLE">
                                                            Middle
                                                        </option>

                                                        <option value="UPPER">
                                                            Upper
                                                        </option>

                                                        <option value="SIDE_LOWER">
                                                            Side Lower
                                                        </option>

                                                        <option value="SIDE_UPPER">
                                                            Side Upper
                                                        </option>
                                                    </>
                                                )}
                                        </select>
                                    </div>
                                </div>
                            </div>
                        ))}

                        <button
                            className="booking-add-passenger-button"
                            type="button"
                            onClick={handleAddPassenger}
                            disabled={
                                !isPassengerComplete(
                                    passengers[passengers.length - 1]
                                ) || passengers.length >= 6
                            }
                        >
                            + Add Passenger
                        </button>

                        <button
                            className="booking-recommend-seats-button"
                            type="button"
                            onClick={handleLockSeat}
                            disabled={
                                !areAllPassengersComplete() || lockingSeat
                            }
                        >
                            {lockingSeat
                                ? "Allocating Seats..."
                                : "Allocate Berths & Continue"}
                        </button>

                    </section>

                    <aside className="booking-summary-card">
                        <div className="booking-section-heading">
                            <p>BOOKING SUMMARY</p>
                            <h2>Review Journey</h2>
                        </div>

                        <div className="booking-summary-row">
                            <span>Class Code</span>
                            <strong>{travelClass.code}</strong>
                        </div>

                        <div className="booking-summary-row">
                            <span>Class Name</span>
                            <strong>{travelClass.name}</strong>
                        </div>

                        <div className="booking-summary-row">
                            <span>Passenger</span>
                            <strong>{passengers.length}</strong>
                        </div>

                        <div className="booking-summary-total">
                            <span>Total Fare</span>
                            <strong>Calculated at payment</strong>
                        </div>

                        {lockedBooking && (
                            <div className="booking-action-buttons">
                                <button
                                    className="booking-unlock-button"
                                    type="button"
                                    onClick={handleUnlockSeat}
                                    disabled={unlockingSeat}
                                >
                                    {unlockingSeat
                                        ? "Releasing..."
                                        : "Release Reservation"}
                                </button>

                                <button
                                    className="booking-continue-button"
                                    type="button"
                                    onClick={handleContinueToPayment}
                                >
                                    Proceed to Payment
                                </button>
                            </div>
                        )}
                    </aside>
                </div>
            </main>
        </div>
    );
}

export default Booking;