import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "../../styles/Home.css";

function Home() {
    const navigate = useNavigate();

    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [journeyDate, setJourneyDate] = useState("");
    const [travelClass, setTravelClass] = useState("all");

    function handleSearch() {
        if (!from.trim() || !to.trim()) {
            return;
        }

        navigate(
            `/trains?from=${encodeURIComponent(from.trim())}&to=${encodeURIComponent(to.trim())}&date=${journeyDate}&class=${travelClass}`
        );
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

                        <div className="home-search-swap-button">
                            ⇄
                        </div>

                        <div className="home-search-input-group">
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