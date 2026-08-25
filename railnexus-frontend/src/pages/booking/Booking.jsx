import { useState } from "react";
import { useParams, useSearchParams, Link, useNavigate } from "react-router-dom";
import trains from "../../data/trains";
import "../../styles/Booking.css";

function Booking() {
    const { trainNumber } = useParams();
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();

    const selectedClass = searchParams.get("class");

    const [passengers, setPassengers] = useState([
        {
            id: 1,
            name: "",
            age: "",
            gender: "",
            seatPreference: ""
        }
    ]);

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
            passenger.seatPreference !== ""
        );
    }

    function areAllPassengersComplete() {
        return passengers.every((passenger) =>
            isPassengerComplete(passenger)
        );
    }

    function handleContinueToPayment() {
        if (!areAllPassengersComplete()) {
            return;
        }

        navigate(
            `/payment/${train.number}?class=${travelClass.name}`,
            {
                state: {
                    passengers: passengers
                }
            }
        );
    }

    function handleAddPassenger() {
        const currentPassenger = passengers[passengers.length - 1];

        if (!isPassengerComplete(currentPassenger)) {
            return;
        }

        if (passengers.length >= travelClass.available) {
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

    const train = trains.find(
        (trainItem) => trainItem.number === trainNumber
    );

    const travelClass = train?.classes.find(
        (classItem) => classItem.name === selectedClass
    );

    const pricePerPassenger = Number(
        travelClass?.price.replace(/[^\d.]/g, "")
    );

    const totalFare = pricePerPassenger * passengers.length;

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
                        to={`/trains/${train.number}`}
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
                            <span>{train.number}</span>
                            <h2>{train.name}</h2>
                        </div>

                        <strong>{travelClass.name}</strong>
                    </div>

                    <div className="booking-journey-details">
                        <div>
                            <span>FROM</span>
                            <strong>{train.from}</strong>
                            <p>{train.departure}</p>
                        </div>

                        <div className="booking-journey-line">
                            <span>{train.duration}</span>
                            <div></div>
                        </div>

                        <div>
                            <span>TO</span>
                            <strong>{train.to}</strong>
                            <p>{train.arrival}</p>
                        </div>
                    </div>
                </section>

                <div className="booking-layout">
                    <section className="booking-passenger-card">
                        <div className="booking-section-heading">
                            <p>PASSENGER DETAILS</p>
                            <h2>Passenger Details</h2>
                        </div>

                        {passengers.map((passenger, index) => (
                            <div className="booking-passenger-form" key={passenger.id}>
                                <div className="booking-passenger-heading">
                                    <h3>Passenger {index + 1}</h3>

                                    {index === 0 ? (
                                        <button
                                            className="booking-clear-passenger-button"
                                            type="button"
                                            onClick={() => handleClearPassenger(passenger.id)}
                                        >
                                            Clear Details
                                        </button>
                                    ) : (
                                        <button
                                            className="booking-remove-passenger-button"
                                            type="button"
                                            onClick={() => handleRemovePassenger(passenger.id)}
                                        >
                                            Remove
                                        </button>
                                    )}
                                </div>

                                <div className="booking-form">
                                    <div className="booking-input-group booking-input-full">
                                        <label htmlFor={`passenger-name-${passenger.id}`}>
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
                                        <label htmlFor={`passenger-age-${passenger.id}`}>
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
                                        <label htmlFor={`passenger-gender-${passenger.id}`}>
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
                                        <label htmlFor={`seat-preference-${passenger.id}`}>
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
                                !isPassengerComplete(passengers[passengers.length - 1]) ||
                                passengers.length >= travelClass.available
                            }
                        >
                            + Add Passenger
                        </button>
                    </section>

                    <aside className="booking-summary-card">
                        <div className="booking-section-heading">
                            <p>BOOKING SUMMARY</p>
                            <h2>Review Journey</h2>
                        </div>

                        <div className="booking-summary-row">
                            <span>Fare Per Passenger</span>
                            <strong>{travelClass.price}</strong>
                        </div>

                        <div className="booking-summary-row">
                            <span>Class</span>
                            <strong>{travelClass.name}</strong>
                        </div>

                        <div className="booking-summary-row">
                            <span>Passenger</span>
                            <strong>{passengers.length}</strong>
                        </div>

                        <div className="booking-summary-total">
                            <span>Total Fare</span>
                            <strong>₹{totalFare}</strong>
                        </div>

                        <button
                            className="booking-continue-button"
                            type="button"
                            onClick={handleContinueToPayment}
                        >
                            Continue to Payment
                        </button>
                    </aside>
                </div>
            </main>
        </div>
    );
}

export default Booking;