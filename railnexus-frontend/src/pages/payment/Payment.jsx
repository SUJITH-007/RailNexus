import {
    useLocation,
    useParams,
    useSearchParams,
    Link,
    useNavigate
} from "react-router-dom";
import "../../styles/Payment.css";

function Payment() {
    const { trainNumber } = useParams();
    const [searchParams] = useSearchParams();
    const location = useLocation();
    const navigate = useNavigate();
    const selectedClass = searchParams.get("class");
    const trainId = searchParams.get("trainId");
    const fromStation = searchParams.get("from");
    const toStation = searchParams.get("to");
    const journeyDate = searchParams.get("date");
    const passengers = location.state?.passengers || [];
    const booking = location.state?.booking;

    if (!booking || passengers.length === 0) {
        return (
            <div className="payment-not-found">
                <h1>Payment Details Not Found</h1>
                <p>
                    The locked booking information could not be found.
                </p>
                <Link to="/trains">
                    Back to Train Search
                </Link>
            </div>
        );
    }

    async function handleProceedToPay() {
        try {
            const token = localStorage.getItem("token");

            const orderResponse = await fetch(
                `http://localhost:8080/api/bookings/payment-order/${booking.pnr}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`
                    }
                }
            );

            if (!orderResponse.ok) {
                const errorData = await orderResponse.text();
                throw new Error(
                    errorData || "Unable to create payment order"
                );
            }

            const order = await orderResponse.json();

            const options = {
                key: order.keyId,
                amount: order.amount,
                currency: order.currency,
                name: "RailNexus",
                description: `Railway Ticket - ${booking.pnr}`,
                order_id: order.orderId,
                handler: async function (response) {
                    const verifyResponse = await fetch(
                        "http://localhost:8080/api/bookings/payment/verify",
                        {
                            method: "POST",
                            headers: {
                                "Content-Type": "application/json",
                                Authorization: `Bearer ${token}`
                            },
                            body: JSON.stringify({
                                pnr: booking.pnr,
                                razorpayPaymentId:
                                    response.razorpay_payment_id,
                                razorpayOrderId:
                                    response.razorpay_order_id,
                                razorpaySignature:
                                    response.razorpay_signature
                            })
                        }
                    );

                    if (!verifyResponse.ok) {
                        const errorData = await verifyResponse.text();
                        throw new Error(
                            errorData || "Payment verification failed"
                        );
                    }

                    const confirmedBooking =
                        await verifyResponse.json();

                    navigate(
                        `/confirmation/${trainNumber}?class=${selectedClass}`,
                        {
                            state: {
                                passengers: passengers,
                                booking: confirmedBooking
                            }
                        }
                    );
                },
                prefill: {
                    name: passengers[0]?.name || "",
                },
                theme: {
                    color: "#1d4ed8"
                }
            };

            const razorpay = new window.Razorpay(options);
            razorpay.open();
        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div className="payment-page">
            <section className="payment-header">
                <div className="payment-header-content">
                    <Link
                        to={`/booking/${trainNumber}?class=${selectedClass}&trainId=${trainId}&from=${fromStation}&to=${toStation}&date=${journeyDate}`}
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
                            <span>{booking.trainNumber}</span>
                            <h2>{booking.trainName}</h2>
                        </div>
                        <strong>
                            {selectedClass}
                        </strong>
                    </div>
                    <div className="payment-journey-details">
                        <div>
                            <span>FROM</span>
                            <strong>
                                {fromStation}
                            </strong>
                            <p>
                                {booking.journeyDate}
                            </p>
                        </div>
                        <div className="payment-journey-line">
                            <span>
                                {journeyDate}
                            </span>
                            <div></div>
                        </div>
                        <div>
                            <span>TO</span>
                            <strong>
                                {toStation}
                            </strong>
                            <p>
                                {booking.journeyDate}
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
                                {booking.trainNumber}
                            </strong>
                        </div>
                        <div className="payment-summary-row">
                            <span>
                                Class
                            </span>
                            <strong>
                                {selectedClass}
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
                                ₹{booking.totalFare / passengers.length}
                            </strong>
                        </div>
                        <div className="payment-summary-total">
                            <span>
                                Total Fare
                            </span>
                            <strong>
                                ₹{booking.totalFare}
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