import { useState } from "react";
import "../../styles/AdminBookings.css";

function AdminBookings() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const [selectedBooking, setSelectedBooking] = useState(null);

    const [bookings] = useState([
        {
            pnr: "RN102938",
            trainNumber: "12627",
            trainName: "RailNexus Express",
            passenger: "Rahul Kumar",
            from: "Bangalore",
            to: "Hubli",
            date: "21 Aug 2026",
            className: "SL",
            passengers: 2,
            fare: "₹900",
            status: "Confirmed",
        },
        {
            pnr: "RN102939",
            trainNumber: "16515",
            trainName: "Deccan Star",
            passenger: "Ananya Rao",
            from: "Bangalore",
            to: "Mangalore",
            date: "21 Aug 2026",
            className: "3A",
            passengers: 1,
            fare: "₹1,250",
            status: "Confirmed",
        },
        {
            pnr: "RN102940",
            trainNumber: "12051",
            trainName: "Karnataka Express",
            passenger: "Vikram Shetty",
            from: "Bangalore",
            to: "Chennai",
            date: "20 Aug 2026",
            className: "2A",
            passengers: 1,
            fare: "₹1,800",
            status: "Cancelled",
        },
        {
            pnr: "RN102941",
            trainNumber: "20646",
            trainName: "Southern Explorer",
            passenger: "Priya Nair",
            from: "Mangalore",
            to: "Bangalore",
            date: "22 Aug 2026",
            className: "CC",
            passengers: 3,
            fare: "₹1,650",
            status: "Confirmed",
        },
        {
            pnr: "RN102942",
            trainNumber: "12845",
            trainName: "Deccan Star",
            passenger: "Arjun Menon",
            from: "Bangalore",
            to: "Hubli",
            date: "23 Aug 2026",
            className: "1A",
            passengers: 1,
            fare: "₹1,200",
            status: "Pending",
        },
    ]);

    const filteredBookings = bookings.filter((booking) => {
        const searchValue = search.toLowerCase();

        const matchesSearch =
            booking.pnr.toLowerCase().includes(searchValue) ||
            booking.trainNumber.toLowerCase().includes(searchValue) ||
            booking.trainName.toLowerCase().includes(searchValue) ||
            booking.passenger.toLowerCase().includes(searchValue);

        const matchesStatus =
            statusFilter === "All" ||
            booking.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

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

                            <option value="Confirmed">
                                Confirmed
                            </option>

                            <option value="Pending">
                                Pending
                            </option>

                            <option value="Cancelled">
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
                                            {booking.passenger}
                                        </strong>

                                        <span className="admin-passenger-count">
                                            {booking.passengers} passenger
                                            {booking.passengers !== 1
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
                                                {booking.from}
                                            </strong>

                                            <span>→</span>

                                            <strong>
                                                {booking.to}
                                            </strong>

                                        </div>

                                        <span className="admin-sub-text">
                                            {booking.date}
                                        </span>
                                    </td>


                                    <td>
                                        <span className="admin-class-badge">
                                            {booking.className}
                                        </span>
                                    </td>


                                    <td>
                                        <strong>
                                            {booking.fare}
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
                                            onClick={() => setSelectedBooking(booking)}
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
                                {selectedBooking.passenger}
                            </strong>
                        </div>

                        <div>
                            <span>Passengers</span>
                            <strong>
                                {selectedBooking.passengers}
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
                                {selectedBooking.from}
                            </strong>
                        </div>

                        <div>
                            <span>To</span>
                            <strong>
                                {selectedBooking.to}
                            </strong>
                        </div>

                        <div>
                            <span>Journey Date</span>
                            <strong>
                                {selectedBooking.date}
                            </strong>
                        </div>

                    </div>

                </div>


                <div className="admin-detail-summary">

                    <div>
                        <span>Class</span>

                        <strong className="admin-class-badge">
                            {selectedBooking.className}
                        </strong>
                    </div>


                    <div>
                        <span>Fare</span>

                        <strong>
                            {selectedBooking.fare}
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