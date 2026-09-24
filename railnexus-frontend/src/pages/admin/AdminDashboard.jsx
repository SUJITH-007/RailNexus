import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/AdminDashboard.css";

function AdminDashboard() {
    const [dashboard, setDashboard] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    useEffect(() => {
        const fetchDashboard = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    "http://localhost:8080/api/admin/dashboard",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                            "Content-Type": "application/json",
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Failed to load dashboard data");
                }

                const data = await response.json();
                setDashboard(data);
            } catch (err) {
                console.error("Dashboard error:", err);
                setError("Unable to load dashboard data.");
            } finally {
                setLoading(false);
            }
        };

        fetchDashboard();
    }, []);

    const formatRevenue = (revenue) => {
        if (revenue >= 100000) {
            return `₹${(revenue / 100000).toFixed(2)}L`;
        }

        if (revenue >= 1000) {
            return `₹${(revenue / 1000).toFixed(1)}K`;
        }

        return `₹${revenue.toFixed(0)}`;
    };

    if (loading) {
        return (
            <div className="admin-dashboard">
                <div className="admin-dashboard-heading">
                    <p>OVERVIEW</p>
                    <h1>Dashboard</h1>
                    <span>Loading dashboard data...</span>
                </div>
            </div>
        );
    }

    if (error) {
        return (
            <div className="admin-dashboard">
                <div className="admin-dashboard-heading">
                    <p>OVERVIEW</p>
                    <h1>Dashboard</h1>
                    <span>{error}</span>
                </div>
            </div>
        );
    }

    return (
        <div className="admin-dashboard">

            <div className="admin-dashboard-heading">
                <div>
                    <p>OVERVIEW</p>
                    <h1>Dashboard</h1>
                    <span>
                        Monitor RailNexus operations and activity.
                    </span>
                </div>
            </div>

            <section className="admin-stat-grid">

                <div className="admin-stat-card">
                    <span>TOTAL USERS</span>
                    <strong>{dashboard.totalUsers}</strong>
                    <p>Registered users</p>
                </div>

                <div className="admin-stat-card">
                    <span>TOTAL TRAINS</span>
                    <strong>{dashboard.totalTrains}</strong>
                    <p>Active trains</p>
                </div>

                <div className="admin-stat-card">
                    <span>TODAY'S BOOKINGS</span>
                    <strong>{dashboard.todayBookings}</strong>
                    <p>Bookings today</p>
                </div>

                <div className="admin-stat-card">
                    <span>TOTAL REVENUE</span>
                    <strong>{formatRevenue(dashboard.totalRevenue)}</strong>
                    <p>Current revenue</p>
                </div>

            </section>

            <section className="admin-dashboard-grid">

                <div className="admin-dashboard-card">

                    <div className="admin-card-heading">
                        <div>
                            <p>RECENT ACTIVITY</p>
                            <h2>Recent Bookings</h2>
                        </div>
                    </div>

                    <div className="admin-booking-table">

                        <div className="admin-table-header">
                            <span>PNR</span>
                            <span>TRAIN</span>
                            <span>PASSENGER</span>
                            <span>STATUS</span>
                        </div>

                        {dashboard.recentBookings.map((booking) => (
                            <div
                                className="admin-table-row"
                                key={booking.id}
                            >
                                <span>{booking.pnr}</span>

                                <span>{booking.trainNumber}</span>

                                <span>
                                    {booking.passengerCount} Passenger
                                    {booking.passengerCount !== 1 ? "s" : ""}
                                </span>

                                <strong
                                    className={
                                        booking.status === "CONFIRMED"
                                            ? "status-confirmed"
                                            : "status-cancelled"
                                    }
                                >
                                    {booking.status}
                                </strong>
                            </div>
                        ))}

                    </div>

                </div>

                <div className="admin-dashboard-card">

                    <div className="admin-card-heading">
                        <div>
                            <p>SYSTEM</p>
                            <h2>Quick Actions</h2>
                        </div>
                    </div>

                    <div className="admin-quick-actions">

                        <Link
                            to="/admin/trains?action=add"
                            className="admin-quick-action-button"
                        >
                            Add New Train
                        </Link>

                        <Link
                            to="/admin/bookings"
                            className="admin-quick-action-button"
                        >
                            View Bookings
                        </Link>

                        <Link
                            to="/admin/users"
                            className="admin-quick-action-button"
                        >
                            Manage Users
                        </Link>

                    </div>

                </div>

            </section>

        </div>
    );
}

export default AdminDashboard;