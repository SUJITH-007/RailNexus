import { useEffect, useState } from "react";
import { useParams, Link, useSearchParams } from "react-router-dom";
import "../../styles/TrainDetails.css";

function TrainDetails() {
    const { trainNumber } = useParams();
    const [searchParams] = useSearchParams();

    const trainId = searchParams.get("trainId");
    const fromStation = searchParams.get("from") || "";
    const toStation = searchParams.get("to") || "";
    const journeyDate = searchParams.get("date") || "";

    const [train, setTrain] = useState(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchTrainDetails = async () => {
            try {
                const response = await fetch(
                    `http://localhost:8080/api/train-routes/train/${trainId}?journeyDate=${journeyDate}`,
                    {
                        headers: {
                            Authorization: `Bearer ${localStorage.getItem("token")}`
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

    if (loading) {
        return (
            <div className="train-details-not-found">
                <h1>Loading Train Details...</h1>
            </div>
        );
    }

    if (!train) {
        return (
            <div className="train-details-not-found">
                <h1>Train Not Found</h1>
                <p>
                    The train you are looking for does not exist for this journey date.
                </p>

                <Link to="/trains">
                    Back to Train Search
                </Link>
            </div>
        );
    }

    const routes = train.routes || [];
    const classes = train.classes || [];

    const firstRoute = routes[0];
    const lastRoute = routes[routes.length - 1];

    const formatTime = (time) => {
        if (!time) {
            return "—";
        }

        return time.substring(0, 5);
    };

    const getClassDescription = (classCode) => {
        if (classCode === "SL") {
            return "Sleeper";
        }

        if (classCode === "3A") {
            return "Third AC";
        }

        if (classCode === "2A") {
            return "Second AC";
        }

        if (classCode === "1A") {
            return "First AC";
        }

        if (classCode === "CC") {
            return "Chair Car";
        }

        if (classCode === "2S") {
            return "Second Sitting";
        }

        return classCode;
    };

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
                            {train.trainNumber || trainNumber}
                        </span>

                        <h1>{train.trainName}</h1>
                    </div>

                    <p>
                        {train.source} → {train.destination}
                    </p>
                </div>
            </section>

            <main className="train-details-content">
                <section className="train-details-summary">
                    <div className="train-summary-item">
                        <span>DEPARTURE</span>
                        <strong>
                            {firstRoute
                                ? formatTime(firstRoute.departureTime)
                                : "—"}
                        </strong>
                        <p>
                            {firstRoute
                                ? firstRoute.stationName
                                : fromStation}
                        </p>
                    </div>

                    <div className="train-summary-duration">
                        <span>
                            {firstRoute && lastRoute
                                ? `${Math.abs(
                                      lastRoute.distance -
                                          firstRoute.distance
                                  )} km`
                                : "Journey"}
                        </span>

                        <div className="train-summary-line"></div>

                        <small>Direct</small>
                    </div>

                    <div className="train-summary-item train-summary-arrival">
                        <span>ARRIVAL</span>
                        <strong>
                            {lastRoute
                                ? formatTime(lastRoute.arrivalTime)
                                : "—"}
                        </strong>
                        <p>
                            {lastRoute
                                ? lastRoute.stationName
                                : toStation}
                        </p>
                    </div>
                </section>

                <section className="train-details-section">
                    <div className="train-details-section-heading">
                        <p>ROUTE</p>
                        <h2>Journey Route</h2>
                    </div>

                    <div className="train-route">
                        {routes.map((stop, index) => (
                            <div
                                className="train-route-stop"
                                key={stop.id}
                            >
                                <div className="train-route-indicator">
                                    <span></span>

                                    {index !== routes.length - 1 && (
                                        <div className="train-route-line"></div>
                                    )}
                                </div>

                                <div className="train-route-station">
                                    <h3>
                                        {stop.stationName}
                                    </h3>

                                    <div className="train-route-times">
                                        <span>
                                            Arrival:{" "}
                                            {formatTime(
                                                stop.arrivalTime
                                            )}
                                        </span>

                                        <span>
                                            Departure:{" "}
                                            {formatTime(
                                                stop.departureTime
                                            )}
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
                        {classes.map((travelClass) => (
                            <div
                                className="train-details-class-card"
                                key={travelClass.id}
                            >
                                <div>
                                    <span>
                                        {travelClass.code}
                                    </span>

                                    <h3>
                                        {travelClass.name ||
                                            getClassDescription(
                                                travelClass.code
                                            )}
                                    </h3>
                                </div>

                                <div className="train-details-class-info">
                                    <strong>
                                        {travelClass.ac
                                            ? "AC"
                                            : "Non-AC"}
                                    </strong>

                                    <small>
                                        Available for booking
                                    </small>
                                </div>

                                <Link
                                    to={`/booking/${train.trainNumber || trainNumber}?class=${travelClass.code}&from=${fromStation}&to=${toStation}&date=${journeyDate}&trainId=${train.trainId}`}
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