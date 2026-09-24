import { useEffect, useState } from "react";
import { Link, useSearchParams } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/TrainSearch.css";

function TrainSearch() {
    const [searchParams, setSearchParams] = useSearchParams();
    const { token } = useAuth();

    const [from, setFrom] = useState(
        searchParams.get("from") || ""
    );

    const [to, setTo] = useState(
        searchParams.get("to") || ""
    );

    const [fromStation, setFromStation] = useState(null);
    const [toStation, setToStation] = useState(null);

    const [fromSuggestions, setFromSuggestions] = useState([]);
    const [toSuggestions, setToSuggestions] = useState([]);


    useEffect(() => {
        async function loadStationsFromUrl() {
            const fromCode = searchParams.get("from");
            const toCode = searchParams.get("to");

            if (fromCode) {
                const stations = await searchStations(fromCode);

                const station = stations.find(
                    (item) => item.code === fromCode
                );

                if (station) {
                    setFromStation(station);
                    setFrom(station.name);
                }
            }

            if (toCode) {
                const stations = await searchStations(toCode);

                const station = stations.find(
                    (item) => item.code === toCode
                );

                if (station) {
                    setToStation(station);
                    setTo(station.name);
                }
            }
        }

        loadStationsFromUrl();
    }, []);

    const [travelClass, setTravelClass] = useState(
        searchParams.get("class") || "all"
    );

    const [journeyDate, setJourneyDate] = useState(
        searchParams.get("date") || ""
    );

    const [searchResults, setSearchResults] = useState([]);
    const [availability, setAvailability] = useState({});
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        if (!fromStation || !toStation || !journeyDate) {
            return;
        }

        searchTrains();
    }, [fromStation, toStation, journeyDate]);

    async function searchStations(query) {

        if (!query.trim()) {
            return [];
        }

        try {
            const response = await fetch(
                `http://localhost:8080/api/stations/search?query=${encodeURIComponent(
                    query.trim()
                )}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to search stations.");
            }

            return await response.json();

        } catch (error) {
            console.error("Station search error:", error);
            return [];
        }
    }

    async function handleFromChange(event) {
        const value = event.target.value;

        setFrom(value);
        setFromStation(null);
        setError("");

        if (value.trim().length < 2) {
            setFromSuggestions([]);
            return;
        }

        const stations = await searchStations(value);

        setFromSuggestions(stations);
    }

    async function handleToChange(event) {
        const value = event.target.value;

        setTo(value);
        setToStation(null);
        setError("");

        if (value.trim().length < 2) {
            setToSuggestions([]);
            return;
        }

        const stations = await searchStations(value);

        setToSuggestions(stations);
    }

    function selectFromStation(station) {
        setFrom(station.name);
        setFromStation(station);
        setFromSuggestions([]);
        setError("");
    }

    function selectToStation(station) {
        setTo(station.name);
        setToStation(station);
        setToSuggestions([]);
        setError("");
    }

    function handleSwap() {
        const currentFrom = from;
        const currentTo = to;

        const currentFromStation = fromStation;
        const currentToStation = toStation;

        setFrom(currentTo);
        setTo(currentFrom);

        setFromStation(currentToStation);
        setToStation(currentFromStation);

        setFromSuggestions([]);
        setToSuggestions([]);
        setError("");
    }

    async function searchTrains() {
        if (!fromStation || !toStation) {
            setError(
                "Please select both departure and arrival stations from the suggestions."
            );
            setSearchResults([]);
            return;
        }

        if (fromStation.code === toStation.code) {
            setError(
                "Departure and arrival stations cannot be the same."
            );
            setSearchResults([]);
            return;
        }

        if (!journeyDate) {
            setError("Please select a journey date.");
            setSearchResults([]);
            return;
        }

        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                `http://localhost:8080/api/train-routes/search?fromStationId=${fromStation.id}&toStationId=${toStation.id}&journeyDate=${journeyDate}`,
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const errorText = await response.text();

                throw new Error(
                    errorText || "Failed to search trains."
                );
            }

            const data = await response.json();

            let filteredResults = data;

            if (travelClass !== "all") {
                filteredResults = data.filter((train) =>
                    train.classes?.includes(travelClass)
                );
            }

            setSearchResults(filteredResults);
            fetchClassAvailability(filteredResults);

            setSearchParams({
                from: fromStation.code,
                to: toStation.code,
                date: journeyDate,
                class: travelClass,
            });

        } catch (error) {
            console.error("Train search error:", error);

            setError(
                error.message || "Unable to search trains."
            );

            setSearchResults([]);
        } finally {
            setLoading(false);
        }
        async function fetchClassAvailability(trains) {
            const availabilityData = {};

            for (const train of trains) {
                try {
                    const response = await fetch(
                        `http://localhost:8080/api/bookings/class-availability?trainId=${train.trainId}&journeyDate=${journeyDate}&from=${fromStation.code}&to=${toStation.code}`,
                        {
                            method: "GET",
                            headers: {
                                Authorization: `Bearer ${token}`,
                            },
                        }
                    );

                    if (!response.ok) {
                        continue;
                    }

                    const data = await response.json();

                    availabilityData[train.trainId] = data;
                } catch (error) {
                    console.error("Class availability error:", error);
                }
            }

            setAvailability(availabilityData);
        }
    }

    function formatTime(time) {
        if (!time) {
            return "-";
        }

        const [hours, minutes] = time.split(":");
        const hour = Number(hours);

        const period = hour >= 12 ? "PM" : "AM";
        const formattedHour = hour % 12 || 12;

        return `${formattedHour}:${minutes} ${period}`;
    }

    function calculateDuration(departureTime, arrivalTime) {
        if (!departureTime || !arrivalTime) {
            return "-";
        }

        const [departureHour, departureMinute] =
            departureTime.split(":").map(Number);

        const [arrivalHour, arrivalMinute] =
            arrivalTime.split(":").map(Number);

        const departureTotal =
            departureHour * 60 + departureMinute;

        const arrivalTotal =
            arrivalHour * 60 + arrivalMinute;

        const difference = arrivalTotal - departureTotal;

        if (difference < 0) {
            return "-";
        }

        const hours = Math.floor(difference / 60);
        const minutes = difference % 60;

        return `${hours}h ${minutes}m`;
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

                        {/* FROM */}

                        <div className="train-search-input-group">

                            <label htmlFor="from">
                                From
                            </label>

                            <div className="station-autocomplete">

                                <input
                                    id="from"
                                    type="text"
                                    placeholder="Enter station or city"
                                    value={from}
                                    onChange={handleFromChange}
                                    autoComplete="off"
                                />

                                {fromSuggestions.length > 0 && (
                                    <div className="station-suggestions">

                                        {fromSuggestions.map(
                                            (station) => (
                                                <button
                                                    type="button"
                                                    key={station.id}
                                                    className="station-suggestion"
                                                    onClick={() =>
                                                        selectFromStation(
                                                            station
                                                        )
                                                    }
                                                >

                                                    <strong>
                                                        {station.name}
                                                    </strong>

                                                    <span>
                                                        {station.code} •{" "}
                                                        {station.city}
                                                    </span>

                                                </button>
                                            )
                                        )}

                                    </div>
                                )}

                            </div>

                        </div>

                        {/* SWAP */}

                        <button
                            className="train-search-swap-button"
                            type="button"
                            onClick={handleSwap}
                        >
                            ⇄
                        </button>

                        {/* TO */}

                        <div className="train-search-input-group">

                            <label htmlFor="to">
                                To
                            </label>

                            <div className="station-autocomplete">

                                <input
                                    id="to"
                                    type="text"
                                    placeholder="Enter station or city"
                                    value={to}
                                    onChange={handleToChange}
                                    autoComplete="off"
                                />

                                {toSuggestions.length > 0 && (
                                    <div className="station-suggestions">

                                        {toSuggestions.map(
                                            (station) => (
                                                <button
                                                    type="button"
                                                    key={station.id}
                                                    className="station-suggestion"
                                                    onClick={() =>
                                                        selectToStation(
                                                            station
                                                        )
                                                    }
                                                >

                                                    <strong>
                                                        {station.name}
                                                    </strong>

                                                    <span>
                                                        {station.code} •{" "}
                                                        {station.city}
                                                    </span>

                                                </button>
                                            )
                                        )}

                                    </div>
                                )}

                            </div>

                        </div>

                        {/* JOURNEY DATE */}

                        <div className="train-search-input-group">

                            <label htmlFor="journey-date">
                                Journey Date
                            </label>

                            <input
                                id="journey-date"
                                type="date"
                                value={journeyDate}
                                onChange={(event) =>
                                    setJourneyDate(
                                        event.target.value
                                    )
                                }
                            />

                        </div>

                        {/* CLASS */}

                        <div className="train-search-input-group">

                            <label htmlFor="travel-class">
                                Class
                            </label>

                            <select
                                id="travel-class"
                                value={travelClass}
                                onChange={(event) =>
                                    setTravelClass(
                                        event.target.value
                                    )
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

                        {/* SEARCH BUTTON */}

                        <button
                            className="train-search-submit-button"
                            type="button"
                            onClick={searchTrains}
                            disabled={loading}
                        >
                            {loading
                                ? "Searching..."
                                : "Search Trains"}
                        </button>

                    </div>

                </section>

                {/* ERROR */}

                {error && (
                    <section className="train-results-section">
                        <p>{error}</p>
                    </section>
                )}

                {/* RESULTS */}

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
                                key={train.trainId}
                            >

                                <div className="train-result-main">

                                    <div className="train-identity">

                                        <span className="train-number">
                                            {train.trainNumber}
                                        </span>

                                        <h3>
                                            {train.trainName}
                                        </h3>

                                    </div>

                                    <div className="train-timing">

                                        <div className="train-station-time">

                                            <strong>
                                                {formatTime(
                                                    train.departureTime
                                                )}
                                            </strong>

                                            <span>
                                                {train.fromStationName}
                                            </span>

                                        </div>

                                        <div className="train-duration">

                                            <span>
                                                {calculateDuration(
                                                    train.departureTime,
                                                    train.arrivalTime
                                                )}
                                            </span>

                                            <div className="train-duration-line"></div>

                                            <span>
                                                {train.trainType}
                                            </span>

                                        </div>

                                        <div className="train-station-time">

                                            <strong>
                                                {formatTime(
                                                    train.arrivalTime
                                                )}
                                            </strong>

                                            <span>
                                                {train.toStationName}
                                            </span>

                                        </div>

                                    </div>

                                </div>

                                <div className="train-result-classes">

                                    {train.classes?.map((classCode) => {
                                        const classAvailability =
                                            availability[train.trainId]?.find(
                                                (item) => item.classCode === classCode
                                            );

                                        return (
                                            <div
                                                className="train-class-option"
                                                key={classCode}
                                            >
                                                <span>
                                                    {classCode}
                                                </span>

                                                <strong>
                                                    {classAvailability
                                                        ? classAvailability.availableSeats
                                                        : "-"}
                                                </strong>

                                                <small>
                                                    {classAvailability
                                                        ? classAvailability.availableSeats > 0
                                                            ? "Available"
                                                            : "Sold Out"
                                                        : "Not Available"}
                                                </small>
                                            </div>
                                        );
                                    })}

                                    <Link
                                        to={`/trains/${train.trainNumber}?trainId=${train.trainId}&from=${fromStation.code}&to=${toStation.code}&date=${journeyDate}`}
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