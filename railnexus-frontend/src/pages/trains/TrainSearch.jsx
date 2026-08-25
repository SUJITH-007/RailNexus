import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import "../../styles/TrainSearch.css";
import trains from "../../data/trains";

function TrainSearch() {
    const [searchParams] = useSearchParams();

    const [from, setFrom] = useState(
        searchParams.get("from") || "Bangalore"
    );

    const [to, setTo] = useState(
        searchParams.get("to") || "Hubli"
    );

    const [travelClass, setTravelClass] = useState(
        searchParams.get("class") || "all"
    );

    const [journeyDate, setJourneyDate] = useState(
        searchParams.get("date") || ""
    );

    const [searchResults, setSearchResults] = useState([]);

    function searchTrains(
        fromStation,
        toStation,
        selectedClass
    ) {
        const normalizedFrom = fromStation.trim().toLowerCase();
        const normalizedTo = toStation.trim().toLowerCase();

        return trains.filter((train) => {
            const routeMatches =
                train.from.toLowerCase() === normalizedFrom &&
                train.to.toLowerCase() === normalizedTo;

            if (!routeMatches) {
                return false;
            }

            if (selectedClass === "all") {
                return true;
            }

            return train.classes.some(
                (travelClassOption) =>
                    travelClassOption.name === selectedClass
            );
        });
    }
    useEffect(() => {
        const results = searchTrains(
            from,
            to,
            travelClass
        );

        setSearchResults(results);
    }, []);

    function handleSearch() {
        const results = searchTrains(
            from,
            to,
            travelClass
        );

        setSearchResults(results);
    }

    function handleSwap() {
        const currentFrom = from;
        setFrom(to);
        setTo(currentFrom);
    }

    return (
        <div className="train-search-page">
            <section className="train-search-header">
                <div className="train-search-header-content">
                    <p className="train-search-tagline">
                        PLAN YOUR JOURNEY
                    </p>

                    <h1>Search Trains</h1>

                    <p>
                        Find trains, compare timings, and choose the right
                        journey for you.
                    </p>
                </div>
            </section>

            <main className="train-search-content">
                <section className="train-search-form-card">
                    <div className="train-search-form-heading">
                        <h2>Search for trains</h2>

                        <p>
                            Enter your journey details to find available
                            trains.
                        </p>
                    </div>

                    <div className="train-search-form">
                        <div className="train-search-input-group">
                            <label htmlFor="from">From</label>

                            <input
                                id="from"
                                type="text"
                                placeholder="Departure station"
                                value={from}
                                onChange={(event) =>
                                    setFrom(event.target.value)
                                }
                            />
                        </div>

                        <button
                            className="train-search-swap-button"
                            type="button"
                            onClick={handleSwap}
                        >
                            ⇄
                        </button>

                        <div className="train-search-input-group">
                            <label htmlFor="to">To</label>

                            <input
                                id="to"
                                type="text"
                                placeholder="Arrival station"
                                value={to}
                                onChange={(event) =>
                                    setTo(event.target.value)
                                }
                            />
                        </div>

                        <div className="train-search-input-group">
                            <label htmlFor="journey-date">
                                Journey Date
                            </label>

                            <input
                                id="journey-date"
                                type="date"
                                value={journeyDate}
                                onChange={(event) =>
                                    setJourneyDate(event.target.value)
                                }
                            />
                        </div>

                        <div className="train-search-input-group">
                            <label htmlFor="travel-class">
                                Class
                            </label>

                            <select
                                id="travel-class"
                                value={travelClass}
                                onChange={(event) =>
                                    setTravelClass(event.target.value)
                                }
                            >
                                <option value="all">
                                    All Classes
                                </option>

                                <option value="1A">
                                    First AC
                                </option>

                                <option value="2A">
                                    Second AC
                                </option>

                                <option value="3A">
                                    Third AC
                                </option>

                                <option value="SL">
                                    Sleeper
                                </option>

                                <option value="CC">
                                    Chair Car
                                </option>

                                <option value="2S">
                                    Second Sitting
                                </option>
                            </select>
                        </div>

                        <button
                            className="train-search-submit-button"
                            type="button"
                            onClick={handleSearch}
                        >
                            Search Trains
                        </button>
                    </div>
                </section>

                <section className="train-results-section">
                    <div className="train-results-heading">
                        <div>
                            <p className="train-results-label">
                                AVAILABLE TRAINS
                            </p>

                            <h2>
                                Trains from{" "}
                                {from.trim() || "Origin"} to{" "}
                                {to.trim() || "Destination"}
                            </h2>
                        </div>

                        <span className="train-results-count">
                            {searchResults.length} trains found
                        </span>
                    </div>

                    <div className="train-results-list">
                        {searchResults.map((train) => (
                            <article
                                className="train-result-card"
                                key={train.number}
                            >
                                <div className="train-result-main">
                                    <div className="train-identity">
                                        <span className="train-number">
                                            {train.number}
                                        </span>

                                        <h3>{train.name}</h3>
                                    </div>

                                    <div className="train-timing">
                                        <div className="train-station-time">
                                            <strong>
                                                {train.departure}
                                            </strong>

                                            <span>
                                                {train.from}
                                            </span>
                                        </div>

                                        <div className="train-duration">
                                            <span>
                                                {train.duration}
                                            </span>

                                            <div className="train-duration-line"></div>

                                            <span>
                                                Direct
                                            </span>
                                        </div>

                                        <div className="train-station-time">
                                            <strong>
                                                {train.arrival}
                                            </strong>

                                            <span>
                                                {train.to}
                                            </span>
                                        </div>
                                    </div>
                                </div>

                                <div className="train-result-classes">
                                    {train.classes.map(
                                        (travelClassOption) => (
                                            <div
                                                className="train-class-option"
                                                key={
                                                    travelClassOption.name
                                                }
                                            >
                                                <span>
                                                    {
                                                        travelClassOption.name
                                                    }
                                                </span>

                                                <strong>
                                                    {
                                                        travelClassOption.price
                                                    }
                                                </strong>

                                                <small>
                                                    Available
                                                </small>
                                            </div>
                                        )
                                    )}

                                    <Link
                                        to={`/trains/${train.number}`}
                                        className="train-details-button"
                                    >
                                        View Details
                                    </Link>
                                </div>
                            </article>
                        ))}
                    </div>
                </section>
            </main>
        </div>
    );
}

export default TrainSearch;