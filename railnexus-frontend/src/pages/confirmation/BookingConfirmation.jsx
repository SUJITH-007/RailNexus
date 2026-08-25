import { useLocation, useParams, useSearchParams, Link } from "react-router-dom";
import trains from "../../data/trains";
import "../../styles/BookingConfirmation.css";

function BookingConfirmation() {
    const { trainNumber } = useParams();
    const [searchParams] = useSearchParams();
    const location = useLocation();

    const selectedClass = searchParams.get("class");

    const passengers = location.state?.passengers || [];

    const train = trains.find(
        (trainItem) => trainItem.number === trainNumber
    );

    const travelClass = train?.classes.find(
        (classItem) => classItem.name === selectedClass
    );

    if (!train || !travelClass || passengers.length === 0) {
        return (
            <div className="confirmation-not-found">
                <h1>Booking Not Found</h1>

                <p>
                    The booking information could not be found.
                </p>

                <Link to="/trains">
                    Back to Train Search
                </Link>
            </div>
        );
    }

    const pricePerPassenger = Number(
        travelClass.price.replace(/[^\d.]/g, "")
    );

    const totalFare = pricePerPassenger * passengers.length;

    const pnr =
        "RN" +
        Math.floor(100000000 + Math.random() * 900000000);

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
                        created.
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
                            {pnr}
                        </strong>
                    </div>

                    <div>
                        <span>STATUS</span>

                        <strong className="confirmation-status">
                            CONFIRMED
                        </strong>
                    </div>

                </section>


                <section className="confirmation-ticket-card">

                    <div className="confirmation-ticket-heading">

                        <div>
                            <span>{train.number}</span>

                            <h2>{train.name}</h2>
                        </div>

                        <strong>
                            {travelClass.name}
                        </strong>

                    </div>


                    <div className="confirmation-journey">

                        <div>
                            <span>FROM</span>

                            <strong>
                                {train.from}
                            </strong>

                            <p>
                                {train.departure}
                            </p>
                        </div>


                        <div className="confirmation-journey-line">

                            <span>
                                {train.duration}
                            </span>

                            <div></div>

                            <small>
                                Direct
                            </small>

                        </div>


                        <div className="confirmation-arrival">

                            <span>TO</span>

                            <strong>
                                {train.to}
                            </strong>

                            <p>
                                {train.arrival}
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
                                            {passenger.name}
                                        </h3>
                                    </div>

                                    <div>
                                        <span>AGE</span>

                                        <p>
                                            {passenger.age}
                                        </p>
                                    </div>

                                    <div>
                                        <span>GENDER</span>

                                        <p>
                                            {passenger.gender}
                                        </p>
                                    </div>

                                    <div>
                                        <span>SEAT</span>

                                        <p>
                                            {passenger.seatPreference}
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
                            {travelClass.price}
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
                            ₹{totalFare}
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