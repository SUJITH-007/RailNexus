import {
    useLocation,
    useParams,
    useSearchParams,
    Link,
    useNavigate
} from "react-router-dom";
import trains from "../../data/trains";
import "../../styles/Payment.css";

function Payment() {
    const { trainNumber } = useParams();
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();

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
            <div className="payment-not-found">
                <h1>Payment Details Not Found</h1>

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

    const totalFare =
        pricePerPassenger * passengers.length;

    function handleProceedToPay() {
        navigate(
            `/confirmation/${train.number}?class=${travelClass.name}`,
            {
                state: {
                    passengers: passengers
                }
            }
        );
    }

    return (
        <div className="payment-page">

            <section className="payment-header">
                <div className="payment-header-content">

                    <Link
                        to={`/booking/${train.number}?class=${travelClass.name}`}
                        className="payment-back-link"
                    >
                        ← Back to Booking
                    </Link>

                    <p className="payment-tagline">
                        SECURE PAYMENT
                    </p>

                    <h1>Complete Your Payment</h1>

                    <p>
                        Review your booking details and choose
                        your payment method.
                    </p>

                </div>
            </section>


            <main className="payment-content">

                <section className="payment-journey-card">

                    <div className="payment-journey-heading">

                        <div>
                            <span>{train.number}</span>

                            <h2>{train.name}</h2>
                        </div>

                        <strong>
                            {travelClass.name}
                        </strong>

                    </div>


                    <div className="payment-journey-details">

                        <div>
                            <span>FROM</span>

                            <strong>
                                {train.from}
                            </strong>

                            <p>
                                {train.departure}
                            </p>
                        </div>


                        <div className="payment-journey-line">

                            <span>
                                {train.duration}
                            </span>

                            <div></div>

                        </div>


                        <div>
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


                <div className="payment-layout">

                    <section className="payment-passenger-card">

                        <div className="payment-section-heading">

                            <p>
                                PASSENGERS
                            </p>

                            <h2>
                                Passenger Details
                            </h2>

                        </div>


                        <div className="payment-passenger-list">

                            {passengers.map(
                                (passenger, index) => (

                                    <div
                                        className="payment-passenger"
                                        key={passenger.id}
                                    >

                                        <div>
                                            <span>
                                                Passenger {index + 1}
                                            </span>

                                            <h3>
                                                {passenger.name}
                                            </h3>
                                        </div>

                                        <div>
                                            <p>
                                                Age: {passenger.age}
                                            </p>

                                            <p>
                                                Gender: {passenger.gender}
                                            </p>
                                        </div>

                                        <div>
                                            <p>
                                                Seat:{" "}
                                                {passenger.seatPreference}
                                            </p>
                                        </div>

                                    </div>

                                )
                            )}

                        </div>

                    </section>


                    <aside className="payment-summary-card">

                        <div className="payment-section-heading">

                            <p>
                                PAYMENT SUMMARY
                            </p>

                            <h2>
                                Review & Pay
                            </h2>

                        </div>


                        <div className="payment-summary-row">

                            <span>
                                Train
                            </span>

                            <strong>
                                {train.number}
                            </strong>

                        </div>


                        <div className="payment-summary-row">

                            <span>
                                Class
                            </span>

                            <strong>
                                {travelClass.name}
                            </strong>

                        </div>


                        <div className="payment-summary-row">

                            <span>
                                Passengers
                            </span>

                            <strong>
                                {passengers.length}
                            </strong>

                        </div>


                        <div className="payment-summary-row">

                            <span>
                                Fare / Passenger
                            </span>

                            <strong>
                                {travelClass.price}
                            </strong>

                        </div>


                        <div className="payment-summary-total">

                            <span>
                                Total Fare
                            </span>

                            <strong>
                                ₹{totalFare}
                            </strong>

                        </div>


                        <button
                            className="payment-pay-button"
                            type="button"
                            onClick={handleProceedToPay}
                        >
                            Proceed to Pay
                        </button>

                    </aside>

                </div>

            </main>

        </div>
    );
}

export default Payment;