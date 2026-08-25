import { useParams, Link } from "react-router-dom";
import trains from "../../data/trains";
import "../../styles/TrainDetails.css";

function TrainDetails() {
    const { trainNumber } = useParams();

    const train = trains.find(
        (trainItem) => trainItem.number === trainNumber
    );

    if (!train) {
        return (
            <div className="train-details-not-found">
                <h1>Train Not Found</h1>
                <p>
                    The train you are looking for does not exist.
                </p>

                <Link to="/trains">
                    Back to Train Search
                </Link>
            </div>
        );
    }

    return (
        <div className="train-details-page">
            <section className="train-details-header">
                <div className="train-details-header-content">
                    <Link
                        to="/trains"
                        className="train-details-back-link"
                    >
                        ← Back to Search
                    </Link>

                    <div className="train-details-title">
                        <span className="train-details-number">
                            {train.number}
                        </span>

                        <h1>{train.name}</h1>
                    </div>

                    <p>
                        {train.from} → {train.to}
                    </p>
                </div>
            </section>

            <main className="train-details-content">
                <section className="train-details-summary">
                    <div className="train-summary-item">
                        <span>DEPARTURE</span>
                        <strong>{train.departure}</strong>
                        <p>{train.from}</p>
                    </div>

                    <div className="train-summary-duration">
                        <span>{train.duration}</span>
                        <div className="train-summary-line"></div>
                        <small>Direct</small>
                    </div>

                    <div className="train-summary-item train-summary-arrival">
                        <span>ARRIVAL</span>
                        <strong>{train.arrival}</strong>
                        <p>{train.to}</p>
                    </div>
                </section>

                <section className="train-details-section">
                    <div className="train-details-section-heading">
                        <p>ROUTE</p>
                        <h2>Journey Route</h2>
                    </div>

                    <div className="train-route">
                        {train.route.map((stop, index) => (
                            <div
                                className="train-route-stop"
                                key={stop.station}
                            >
                                <div className="train-route-indicator">
                                    <span></span>

                                    {index !== train.route.length - 1 && (
                                        <div className="train-route-line"></div>
                                    )}
                                </div>

                                <div className="train-route-station">
                                    <h3>{stop.station}</h3>

                                    <div className="train-route-times">
                                        <span>
                                            Arrival: {stop.arrival}
                                        </span>

                                        <span>
                                            Departure: {stop.departure}
                                        </span>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </section>

                <section className="train-details-section">
                    <div className="train-details-section-heading">
                        <p>CLASSES</p>
                        <h2>Available Classes</h2>
                    </div>

                    <div className="train-class-list">
                        {train.classes.map((travelClass) => (
                            <div
                                className="train-details-class-card"
                                key={travelClass.name}
                            >
                                <div>
                                    <span>
                                        {travelClass.name}
                                    </span>

                                    <h3>
                                        {travelClass.name === "SL"
                                            ? "Sleeper"
                                            : travelClass.name === "3A"
                                                ? "Third AC"
                                                : travelClass.name === "2A"
                                                    ? "Second AC"
                                                    : travelClass.name === "1A"
                                                        ? "First AC"
                                                        : travelClass.name === "CC"
                                                            ? "Chair Car"
                                                            : "Second Sitting"}
                                    </h3>
                                </div>

                                <div className="train-details-class-info">
                                    <strong>
                                        {travelClass.price}
                                    </strong>

                                    <small>
                                        {travelClass.available} seats available
                                    </small>
                                </div>

                                <Link
                                    to={`/booking/${train.number}?class=${travelClass.name}`}
                                    className="train-book-button"
                                >
                                    Book Now
                                </Link>
                            </div>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default TrainDetails;