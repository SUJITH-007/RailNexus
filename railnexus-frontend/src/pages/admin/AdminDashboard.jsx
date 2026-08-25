import { Link } from "react-router-dom";
import "../../styles/AdminDashboard.css";

function AdminDashboard() {
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
                    <strong>1,248</strong>
                    <p>Registered users</p>
                </div>

                <div className="admin-stat-card">
                    <span>TOTAL TRAINS</span>
                    <strong>86</strong>
                    <p>Active trains</p>
                </div>

                <div className="admin-stat-card">
                    <span>TODAY'S BOOKINGS</span>
                    <strong>342</strong>
                    <p>Bookings today</p>
                </div>

                <div className="admin-stat-card">
                    <span>TOTAL REVENUE</span>
                    <strong>₹4.82L</strong>
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

                        <div className="admin-table-row">
                            <span>RN102938</span>
                            <span>12627</span>
                            <span>Rahul Kumar</span>
                            <strong className="status-confirmed">
                                Confirmed
                            </strong>
                        </div>

                        <div className="admin-table-row">
                            <span>RN102939</span>
                            <span>16515</span>
                            <span>Ananya Rao</span>
                            <strong className="status-confirmed">
                                Confirmed
                            </strong>
                        </div>

                        <div className="admin-table-row">
                            <span>RN102940</span>
                            <span>12051</span>
                            <span>Vikram Shetty</span>
                            <strong className="status-cancelled">
                                Cancelled
                            </strong>
                        </div>

                        <div className="admin-table-row">
                            <span>RN102941</span>
                            <span>20646</span>
                            <span>Priya Nair</span>
                            <strong className="status-confirmed">
                                Confirmed
                            </strong>
                        </div>

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