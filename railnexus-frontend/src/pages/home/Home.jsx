import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Home.css";

function Home() {
    const navigate = useNavigate();
    const { token } = useAuth();

    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [journeyDate, setJourneyDate] = useState("");
    const [travelClass, setTravelClass] = useState("all");

    const [fromStation, setFromStation] = useState(null);
    const [toStation, setToStation] = useState(null);

    const [fromSuggestions, setFromSuggestions] = useState([]);
    const [toSuggestions, setToSuggestions] = useState([]);

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
    }

    function selectToStation(station) {
        setTo(station.name);
        setToStation(station);
        setToSuggestions([]);
    }

    function handleSearch() {
        console.log("SEARCH BUTTON CLICKED");

        if (!fromStation || !toStation) {
            console.log(
                "Search stopped: Please select both stations from suggestions."
            );
            return;
        }

        if (!journeyDate) {
            console.log("Search stopped: Journey date is required.");
            return;
        }

        if (fromStation.code === toStation.code) {
            console.log(
                "Search stopped: Departure and arrival stations cannot be the same."
            );
            return;
        }

        const searchUrl =
            `/trains?from=${encodeURIComponent(fromStation.code)}` +
            `&to=${encodeURIComponent(toStation.code)}` +
            `&date=${encodeURIComponent(journeyDate)}` +
            `&class=${encodeURIComponent(travelClass)}`;

        console.log("Navigating to:", searchUrl);

        navigate(searchUrl);
    }
    return (
        <div className="home-page">

            <section className="hero-section">
                <div className="hero-content">
                    <p className="hero-tagline">SMARTER RAILWAY TRAVEL</p>

                    <h1>
                        Your Journey.
                        <br />
                        <span>Our Network.</span>
                    </h1>

                    <p className="hero-description">
                        Search trains, check availability, and plan your journey
                        with RailNexus.
                    </p>
                </div>

                <div className="home-search-card">
                    <div className="home-search-header">
                        <h2>Search Trains</h2>
                        <p>Find the best train for your journey</p>
                    </div>

                    <div className="home-search-fields">

                        <div className="home-search-input-group">

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

                                        {fromSuggestions.map((station) => (
                                            <button
                                                type="button"
                                                key={station.id}
                                                className="station-suggestion"
                                                onClick={() =>
                                                    selectFromStation(station)
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
                                        ))}

                                    </div>
                                )}

                            </div>

                        </div>

                        <button
                            className="home-search-swap-button"
                            type="button"
                            onClick={() => {
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
                            }}
                        >
                            ⇄
                        </button>

                        <div className="home-search-input-group">

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

                                        {toSuggestions.map((station) => (
                                            <button
                                                type="button"
                                                key={station.id}
                                                className="station-suggestion"
                                                onClick={() =>
                                                    selectToStation(station)
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
                                        ))}

                                    </div>
                                )}

                            </div>

                        </div>

                        <div className="home-search-input-group">
                            <label htmlFor="date">Journey Date</label>
                            <input
                                id="date"
                                type="date"
                                value={journeyDate}
                                onChange={(event) =>
                                    setJourneyDate(event.target.value)
                                }
                            />
                        </div>

                        <div className="home-search-input-group">
                            <label htmlFor="class">Class</label>
                            <select
                                id="class"
                                value={travelClass}
                                onChange={(event) =>
                                    setTravelClass(event.target.value)
                                }
                            >
                                <option value="all">All Classes</option>
                                <option value="1A">First AC</option>
                                <option value="2A">Second AC</option>
                                <option value="3A">Third AC</option>
                                <option value="SL">Sleeper</option>
                            </select>
                        </div>


                        <button
                            className="home-search-button"
                            type="button"
                            onClick={handleSearch}
                        >
                            Search Trains
                        </button>

                    </div>
                </div>
            </section>

            <section className="home-popular-section">
                <div className="home-section-heading">
                    <p>EXPLORE</p>
                    <h2>Popular Routes</h2>
                    <span>
                        Discover some of the most popular journeys on RailNexus.
                    </span>
                </div>

                <div className="home-route-grid">

                    <div className="home-route-card">
                        <h3>Bangalore → Hubli</h3>
                        <p>Karnataka</p>
                    </div>

                    <div className="home-route-card">
                        <h3>Bangalore → Mysore</h3>
                        <p>Karnataka</p>
                    </div>

                    <div className="home-route-card">
                        <h3>Mangalore → Bangalore</h3>
                        <p>Karnataka</p>
                    </div>

                    <div className="home-route-card">
                        <h3>Chennai → Bangalore</h3>
                        <p>South India</p>
                    </div>

                </div>
            </section>

            <section className="home-features-section">

                <div className="home-section-heading">
                    <p>WHY RAILNEXUS</p>
                    <h2>Everything you need for your journey</h2>
                </div>

                <div className="home-feature-grid">

                    <div className="home-feature-card">
                        <div className="home-feature-number">01</div>
                        <h3>Easy Search</h3>
                        <p>
                            Quickly find trains based on your source,
                            destination, and journey date.
                        </p>
                    </div>

                    <div className="home-feature-card">
                        <div className="home-feature-number">02</div>
                        <h3>Smart Booking</h3>
                        <p>
                            Select passengers and seats through a
                            simple and intuitive booking process.
                        </p>
                    </div>

                    <div className="home-feature-card">
                        <div className="home-feature-number">03</div>
                        <h3>Secure Platform</h3>
                        <p>
                            Authentication, protected APIs, and secure
                            booking workflows.
                        </p>
                    </div>

                </div>

            </section>

        </div>
    );
}

export default Home;