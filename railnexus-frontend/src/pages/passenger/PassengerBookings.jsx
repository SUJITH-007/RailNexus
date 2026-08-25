import { Link } from "react-router-dom";
import "../../styles/PassengerBookings.css";

function PassengerBookings() {
    const upcomingBookings = [
        {
            id: 1,
            pnr: "RN397881321",
            trainNumber: "12601",
            trainName: "RailNexus Express",
            from: "Bangalore",
            to: "Hubli",
            date: "21 Aug 2026",
            departure: "06:30 AM",
            arrival: "01:45 PM",
            travelClass: "SL",
            passengers: 1,
            fare: "₹450",
            status: "CONFIRMED"
        }
    ];

    const previousBookings = [
        {
            id: 2,
            pnr: "RN284761920",
            trainNumber: "12845",
            trainName: "Deccan Star",
            from: "Bangalore",
            to: "Hubli",
            date: "10 Aug 2026",
            departure: "08:15 AM",
            arrival: "03:30 PM",
            travelClass: "3A",
            passengers: 2,
            fare: "₹1,240",
            status: "COMPLETED"
        }
    ];

    return (
        <div className="passenger-bookings-page">

            <section className="passenger-bookings-header">
                <div className="passenger-bookings-header-content">

                    <p className="passenger-bookings-tagline">
                        YOUR JOURNEYS
                    </p>

                    <h1>My Bookings</h1>

                    <p>
                        View and manage your upcoming and previous
                        railway journeys.
                    </p>

                </div>
            </section>


            <main className="passenger-bookings-content">

                <section className="passenger-bookings-section">

                    <div className="passenger-section-heading">

                        <div>
                            <p>UPCOMING</p>

                            <h2>
                                Upcoming Journey
                            </h2>
                        </div>

                        <Link
                            to="/trains"
                            className="passenger-booking-new-button"
                        >
                            Book New Journey
                        </Link>

                    </div>


                    <div className="passenger-bookings-list">

                        {upcomingBookings.length === 0 ? (

                            <div className="passenger-empty-state">

                                <h3>
                                    No upcoming journeys
                                </h3>

                                <p>
                                    You don't have any upcoming
                                    bookings.
                                </p>

                                <Link to="/trains">
                                    Search Trains
                                </Link>

                            </div>

                        ) : (

                            upcomingBookings.map((booking) => (

                                <article
                                    className="passenger-booking-card"
                                    key={booking.id}
                                >

                                    <div className="passenger-booking-top">

                                        <div>

                                            <span className="passenger-booking-pnr-label">
                                                PNR NUMBER
                                            </span>

                                            <strong className="passenger-booking-pnr">
                                                {booking.pnr}
                                            </strong>

                                        </div>

                                        <span className="passenger-booking-status confirmed">
                                            {booking.status}
                                        </span>

                                    </div>


                                    <div className="passenger-booking-train">

                                        <div className="passenger-booking-train-name">

                                            <span>
                                                {booking.trainNumber}
                                            </span>

                                            <h3>
                                                {booking.trainName}
                                            </h3>

                                        </div>

                                        <strong>
                                            {booking.date}
                                        </strong>

                                    </div>


                                    <div className="passenger-booking-route">

                                        <div>

                                            <span>
                                                FROM
                                            </span>

                                            <strong>
                                                {booking.from}
                                            </strong>

                                            <p>
                                                {booking.departure}
                                            </p>

                                        </div>


                                        <div className="passenger-booking-route-line">

                                            <span>
                                                →
                                            </span>

                                        </div>


                                        <div>

                                            <span>
                                                TO
                                            </span>

                                            <strong>
                                                {booking.to}
                                            </strong>

                                            <p>
                                                {booking.arrival}
                                            </p>

                                        </div>

                                    </div>


                                    <div className="passenger-booking-details">

                                        <div>
                                            <span>
                                                CLASS
                                            </span>

                                            <strong>
                                                {booking.travelClass}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                PASSENGERS
                                            </span>

                                            <strong>
                                                {booking.passengers}
                                            </strong>
                                        </div>

                                        <div>
                                            <span>
                                                TOTAL FARE
                                            </span>

                                            <strong>
                                                {booking.fare}
                                            </strong>
                                        </div>

                                    </div>


                                    <div className="passenger-booking-actions">

                                        <Link
                                            to={`/confirmation/${booking.trainNumber}`}
                                            className="passenger-view-ticket-button"
                                        >
                                            View Ticket
                                        </Link>

                                        <button
                                            type="button"
                                            className="passenger-cancel-button"
                                        >
                                            Cancel Booking
                                        </button>

                                    </div>

                                </article>

                            ))

                        )}

                    </div>

                </section>


                <section className="passenger-bookings-section">

                    <div className="passenger-section-heading">

                        <div>

                            <p>
                                HISTORY
                            </p>

                            <h2>
                                Previous Bookings
                            </h2>

                        </div>

                    </div>


                    <div className="passenger-previous-list">

                        {previousBookings.map((booking) => (

                            <article
                                className="passenger-previous-card"
                                key={booking.id}
                            >

                                <div className="passenger-previous-main">

                                    <div>

                                        <span>
                                            {booking.pnr}
                                        </span>

                                        <h3>
                                            {booking.trainName}
                                        </h3>

                                        <p>
                                            {booking.from} → {booking.to}
                                        </p>

                                    </div>

                                    <div>

                                        <strong>
                                            {booking.date}
                                        </strong>

                                        <p>
                                            {booking.travelClass} ·{" "}
                                            {booking.passengers} Passenger(s)
                                        </p>

                                    </div>

                                </div>


                                <div className="passenger-previous-fare">

                                    <span>
                                        Total Fare
                                    </span>

                                    <strong>
                                        {booking.fare}
                                    </strong>

                                </div>

                            </article>

                        ))}

                    </div>

                </section>

            </main>

        </div>
    );
}

export default PassengerBookings;