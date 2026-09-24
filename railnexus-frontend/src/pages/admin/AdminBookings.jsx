import { useEffect, useState } from "react";
import "../../styles/AdminBookings.css";

function AdminBookings() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedBooking, setSelectedBooking] = useState(null);
    const [bookings, setBookings] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchBookings();
    }, []);

    async function fetchBookings() {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:8080/api/admin/bookings",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    data?.error ||
                    "Failed to load bookings."
                );
            }

            setBookings(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function formatDate(date) {
        if (!date) {
            return "-";
        }

        return new Date(`${date}T00:00:00`).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    }

    function formatFare(fare) {
        return `₹${Number(fare || 0).toLocaleString("en-IN")}`;
    }

    const filteredBookings = bookings.filter((booking) => {
        const searchValue = search.toLowerCase();

        const matchesSearch =
            booking.pnr?.toLowerCase().includes(searchValue) ||
            booking.trainNumber?.toLowerCase().includes(searchValue) ||
            booking.trainName?.toLowerCase().includes(searchValue) ||
            booking.passengerName?.toLowerCase().includes(searchValue) ||
            booking.passengerEmail?.toLowerCase().includes(searchValue);

        const matchesStatus =
            statusFilter === "All" ||
            booking.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    if (loading) {
        return (
            <div className="admin-page">
                <div className="admin-page-header">
                    <div>
                        <p className="admin-page-label">
                            MANAGEMENT
                        </p>

                        <h1>Bookings</h1>

                        <p>
                            View and manage passenger bookings across RailNexus.
                        </p>
                    </div>
                </div>

                <section className="admin-card">
                    <div className="admin-empty-state">
                        <h3>Loading bookings</h3>
                        <p>Fetching booking data from RailNexus.</p>
                    </div>
                </section>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-page">
                <div className="admin-page-header">
                    <div>
                        <p className="admin-page-label">
                            MANAGEMENT
                        </p>

                        <h1>Bookings</h1>

                        <p>
                            View and manage passenger bookings across RailNexus.
                        </p>
                    </div>
                </div>

                <section className="admin-card">
                    <div className="admin-empty-state">
                        <h3>Unable to load bookings</h3>
                        <p>{error}</p>
                        <button
                            type="button"
                            className="admin-view-button"
                            onClick={fetchBookings}
                        >
                            Retry
                        </button>
                    </div>
                </section>
            </div>
        );
    }

    return (
        <div className="admin-page">

            <div className="admin-page-header">

                <div>
                    <p className="admin-page-label">
                        MANAGEMENT
                    </p>

                    <h1>Bookings</h1>

                    <p>
                        View and manage passenger bookings across RailNexus.
                    </p>
                </div>

            </div>

            <section className="admin-card">

                <div className="admin-bookings-toolbar">

                    <div>
                        <h2>Booking List</h2>

                        <p>
                            {filteredBookings.length} bookings found
                        </p>
                    </div>

                    <div className="admin-booking-filters">

                        <input
                            type="text"
                            placeholder="Search bookings..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            className="admin-search-input"
                        />

                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(event.target.value)
                            }
                            className="admin-filter-select"
                        >
                            <option value="All">
                                All Status
                            </option>

                            <option value="CONFIRMED">
                                Confirmed
                            </option>

                            <option value="CANCELLED">
                                Cancelled
                            </option>
                        </select>

                    </div>

                </div>

                <div className="admin-table-wrapper">

                    <table className="admin-table">

                        <thead>
                            <tr>
                                <th>PNR</th>
                                <th>Passenger</th>
                                <th>Train</th>
                                <th>Journey</th>
                                <th>Class</th>
                                <th>Fare</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>

                            {filteredBookings.map((booking) => (

                                <tr key={booking.pnr}>

                                    <td>
                                        <strong className="admin-pnr">
                                            {booking.pnr}
                                        </strong>
                                    </td>

                                    <td>
                                        <strong className="admin-passenger-name">
                                            {booking.passengerName}
                                        </strong>

                                        <span className="admin-passenger-count">
                                            {booking.passengerCount} passenger
                                            {booking.passengerCount !== 1
                                                ? "s"
                                                : ""}
                                        </span>
                                    </td>

                                    <td>
                                        <strong>
                                            {booking.trainName}
                                        </strong>

                                        <span className="admin-sub-text">
                                            {booking.trainNumber}
                                        </span>
                                    </td>

                                    <td>
                                        <div className="admin-booking-route">

                                            <strong>
                                                {booking.fromStation}
                                            </strong>

                                            <span>→</span>

                                            <strong>
                                                {booking.toStation}
                                            </strong>

                                        </div>

                                        <span className="admin-sub-text">
                                            {formatDate(booking.journeyDate)}
                                        </span>
                                    </td>

                                    <td>
                                        <span className="admin-class-badge">
                                            {booking.classCode || "-"}
                                        </span>
                                    </td>

                                    <td>
                                        <strong>
                                            {formatFare(booking.totalFare)}
                                        </strong>
                                    </td>

                                    <td>
                                        <span
                                            className={`admin-booking-status ${booking.status.toLowerCase()}`}
                                        >
                                            {booking.status}
                                        </span>
                                    </td>

                                    <td>
                                        <button
                                            className="admin-view-button"
                                            type="button"
                                            onClick={() =>
                                                setSelectedBooking(booking)
                                            }
                                        >
                                            View
                                        </button>
                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                    {filteredBookings.length === 0 && (

                        <div className="admin-empty-state">

                            <h3>
                                No bookings found
                            </h3>

                            <p>
                                Try changing your search or filter.
                            </p>

                        </div>

                    )}

                </div>

            </section>

            {selectedBooking && (

                <div
                    className="admin-modal-overlay"
                    onClick={() => setSelectedBooking(null)}
                >

                    <div
                        className="admin-booking-detail-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="admin-modal-header">

                            <div>

                                <p className="admin-page-label">
                                    BOOKING DETAILS
                                </p>

                                <h2>
                                    Booking Information
                                </h2>

                                <p>
                                    Complete details of this passenger booking.
                                </p>

                            </div>

                            <button
                                type="button"
                                className="admin-modal-close"
                                onClick={() =>
                                    setSelectedBooking(null)
                                }
                            >
                                ×
                            </button>

                        </div>

                        <div className="admin-booking-detail-content">

                            <div className="admin-detail-pnr">

                                <span>
                                    PNR
                                </span>

                                <strong>
                                    {selectedBooking.pnr}
                                </strong>

                            </div>

                            <div className="admin-detail-section">

                                <h3>
                                    Passenger
                                </h3>

                                <div className="admin-detail-grid">

                                    <div>
                                        <span>Name</span>
                                        <strong>
                                            {selectedBooking.passengerName}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Email</span>
                                        <strong>
                                            {selectedBooking.passengerEmail}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Passengers</span>
                                        <strong>
                                            {selectedBooking.passengerCount}
                                        </strong>
                                    </div>

                                </div>

                            </div>

                            <div className="admin-detail-section">

                                <h3>
                                    Train
                                </h3>

                                <div className="admin-detail-grid">

                                    <div>
                                        <span>Train Name</span>
                                        <strong>
                                            {selectedBooking.trainName}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Train Number</span>
                                        <strong>
                                            {selectedBooking.trainNumber}
                                        </strong>
                                    </div>

                                </div>

                            </div>

                            <div className="admin-detail-section">

                                <h3>
                                    Journey
                                </h3>

                                <div className="admin-detail-grid">

                                    <div>
                                        <span>From</span>
                                        <strong>
                                            {selectedBooking.fromStation}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>To</span>
                                        <strong>
                                            {selectedBooking.toStation}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>Journey Date</span>
                                        <strong>
                                            {formatDate(
                                                selectedBooking.journeyDate
                                            )}
                                        </strong>
                                    </div>

                                </div>

                            </div>

                            <div className="admin-detail-section">

                                <h3>
                                    Seats
                                </h3>

                                <div className="admin-detail-grid">

                                    {selectedBooking.seats?.length > 0 ? (
                                        selectedBooking.seats.map((seat) => (
                                            <div key={seat.seatId}>
                                                <span>
                                                    {seat.coachNumber} / Seat {seat.seatNumber}
                                                </span>

                                                <strong>
                                                    {seat.passengerName}
                                                </strong>
                                            </div>
                                        ))
                                    ) : (
                                        <div>
                                            <span>Seats</span>
                                            <strong>-</strong>
                                        </div>
                                    )}

                                </div>

                            </div>

                            <div className="admin-detail-summary">

                                <div>
                                    <span>Class</span>

                                    <strong className="admin-class-badge">
                                        {selectedBooking.classCode || "-"}
                                    </strong>
                                </div>

                                <div>
                                    <span>Fare</span>

                                    <strong>
                                        {formatFare(
                                            selectedBooking.totalFare
                                        )}
                                    </strong>
                                </div>

                                <div>
                                    <span>Status</span>

                                    <strong
                                        className={`admin-booking-status ${selectedBooking.status.toLowerCase()}`}
                                    >
                                        {selectedBooking.status}
                                    </strong>
                                </div>

                            </div>

                        </div>

                        <div className="admin-detail-footer">

                            <button
                                type="button"
                                className="admin-cancel-button"
                                onClick={() =>
                                    setSelectedBooking(null)
                                }
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default AdminBookings;