import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import "../../styles/BookingConfirmation.css";

function BookingConfirmation() {
    const { pnr } = useParams();
    const [booking, setBooking] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchBooking = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/bookings/${pnr}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
                        }
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to fetch booking");
                }

                const data = await response.json();
                setBooking(data);
            } catch (error) {
                console.error("Failed to fetch booking:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchBooking();
    }, [pnr]);
    const passengers = booking?.seats || [];
    if (loading) {
        return (
            <div className="confirmation-not-found">
                <h1>Loading Booking</h1>
            </div>
        );
    }

    if (!booking) {
        return (
            <div className="confirmation-not-found">
                <h1>Booking Not Found</h1>
                <p>
                    The confirmed booking information could not be found.
                </p>
                <Link to="/trains">
                    Back to Train Search
                </Link>
            </div>
        );
    }
    return (
        <div className="confirmation-page">
            <section className="confirmation-header">
                <div className="confirmation-header-content">
                    <p className="confirmation-tagline">
                        BOOKING CONFIRMED
                    </p>
                    <h1>Your Journey is Confirmed</h1>
                    <p>
                        Your RailNexus booking has been successfully
                        confirmed.
                    </p>
                </div>
            </section>
            <main className="confirmation-content">
                <section className="confirmation-success-card">
                    <div className="confirmation-success-icon">
                        ✓
                    </div>
                    <div>
                        <p className="confirmation-success-label">
                            BOOKING CONFIRMED
                        </p>
                        <h2>
                            Your ticket has been booked successfully.
                        </h2>
                        <p>
                            Keep your PNR handy for future reference.
                        </p>
                    </div>
                </section>
                <section className="confirmation-pnr-card">
                    <div>
                        <span>PNR NUMBER</span>
                        <strong>
                            {booking.pnr}
                        </strong>
                    </div>
                    <div>
                        <span>STATUS</span>
                        <strong className="confirmation-status">
                            {booking.status}
                        </strong>
                    </div>
                </section>
                <section className="confirmation-ticket-card">
                    <div className="confirmation-ticket-heading">
                        <div>
                            <span>{booking.trainNumber}</span>
                            <h2>{booking.trainName}</h2>
                        </div>
                        <strong>
                            {booking.classCode}
                        </strong>
                    </div>
                    <div className="confirmation-journey">
                        <div>
                            <span>FROM</span>
                            <strong>
                                {booking.fromStation}
                            </strong>
                            <p>
                                {booking.journeyDate}
                            </p>
                        </div>
                        <div className="confirmation-journey-line">
                            <span>
                                {booking.journeyDate}
                            </span>
                            <div></div>
                            <small>
                                Direct
                            </small>
                        </div>
                        <div className="confirmation-arrival">
                            <span>TO</span>
                            <strong>
                                {booking.toStation}
                            </strong>
                            <p>
                                {booking.journeyDate}
                            </p>
                        </div>
                    </div>
                </section>
                <section className="confirmation-passengers-card">
                    <div className="confirmation-section-heading">
                        <p>
                            PASSENGERS
                        </p>
                        <h2>
                            Passenger Details
                        </h2>
                    </div>
                    <div className="confirmation-passenger-list">
                        {passengers.map(
                            (passenger, index) => (
                                <div
                                    className="confirmation-passenger"
                                    key={passenger.id}
                                >
                                    <div>
                                        <span>
                                            PASSENGER {index + 1}
                                        </span>
                                        <h3>
                                            {passenger.passengerName}
                                        </h3>
                                    </div>
                                    <div>
                                        <span>AGE</span>
                                        <p>
                                            {passenger.passengerAge}
                                        </p>
                                    </div>
                                    <div>
                                        <span>GENDER</span>
                                        <p>
                                            {passenger.passengerGender}
                                        </p>
                                    </div>
                                    <div>
                                        <span>COACH</span>
                                        <p>
                                            {booking.seats?.[index]?.coachNumber ?? "Assigned"}
                                        </p>
                                    </div>
                                    <div>
                                        <span>BERTH</span>
                                        <p>
                                            {booking.seats?.[index]?.seatNumber ?? "Assigned"}
                                        </p>
                                    </div>
                                    <div>
                                        <span>TYPE</span>
                                        <p>
                                            {booking.seats?.[index]?.berthType ?? "Assigned"}
                                        </p>
                                    </div>
                                </div>
                            )
                        )}
                    </div>
                </section>
                <section className="confirmation-fare-card">
                    <div className="confirmation-section-heading">
                        <p>
                            PAYMENT
                        </p>
                        <h2>
                            Fare Summary
                        </h2>
                    </div>
                    <div className="confirmation-fare-row">
                        <span>
                            Fare / Passenger
                        </span>
                        <strong>
                            ₹{booking.totalFare / passengers.length}
                        </strong>
                    </div>
                    <div className="confirmation-fare-row">
                        <span>
                            Passengers
                        </span>
                        <strong>
                            {passengers.length}
                        </strong>
                    </div>
                    <div className="confirmation-fare-total">
                        <span>
                            Total Fare
                        </span>
                        <strong>
                            ₹{booking.totalFare}
                        </strong>
                    </div>
                </section>
                <div className="confirmation-actions">
                    <Link
                        to="/trains"
                        className="confirmation-primary-button"
                    >
                        Book Another Journey
                    </Link>
                    <button
                        className="confirmation-secondary-button"
                        type="button"
                        onClick={() => window.print()}
                    >
                        Print Ticket
                    </button>
                </div>
            </main>
        </div>
    );
}

export default BookingConfirmation;