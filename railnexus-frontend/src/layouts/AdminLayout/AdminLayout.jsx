import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/AdminLayout.css";

function AdminLayout({ children }) {
    const location = useLocation();
    const navigate = useNavigate();
    const { logout } = useAuth();

    return (
        <div className="admin-layout">

            <aside className="admin-sidebar">

                <div className="admin-sidebar-brand">
                    <Link to="/admin">
                        <h2>RailNexus</h2>
                        <span>ADMIN PANEL</span>
                    </Link>
                </div>


                <nav className="admin-sidebar-nav">

                    <p className="admin-nav-label">
                        MANAGEMENT
                    </p>

                    <Link
                        to="/admin"
                        className={
                            location.pathname === "/admin"
                                ? "admin-nav-link active"
                                : "admin-nav-link"
                        }
                    >
                        Dashboard
                    </Link>

                    <Link
                        to="/admin/trains"
                        className={
                            location.pathname.startsWith("/admin/trains")
                                ? "admin-nav-link active"
                                : "admin-nav-link"
                        }
                    >
                        Trains
                    </Link>

                    <Link
                        to="/admin/stations"
                        className={
                            location.pathname.startsWith("/admin/stations")
                                ? "admin-nav-link active"
                                : "admin-nav-link"
                        }
                    >
                        Stations
                    </Link>

                    <Link
                        to="/admin/bookings"
                        className={
                            location.pathname.startsWith("/admin/bookings")
                                ? "admin-nav-link active"
                                : "admin-nav-link"
                        }
                    >
                        Bookings
                    </Link>

                    <Link
                        to="/admin/users"
                        className={
                            location.pathname.startsWith("/admin/users")
                                ? "admin-nav-link active"
                                : "admin-nav-link"
                        }
                    >
                        Users
                    </Link>


                    <p className="admin-nav-label">
                        ACCOUNT
                    </p>

                    <Link
                        to="/admin/profile"
                        className={
                            location.pathname.startsWith("/admin/profile")
                                ? "admin-nav-link active"
                                : "admin-nav-link"
                        }
                    >
                        Admin Profile
                    </Link>

                </nav>


                <div className="admin-sidebar-bottom">

                    <Link
                        to="/"
                        className="admin-back-link"
                    >
                        ← Back to RailNexus
                    </Link>

                    <button
                        type="button"
                        className="admin-logout-button"
                        onClick={() => {
                            logout();
                            navigate("/");
                        }}
                    >
                        Logout
                    </button>

                </div>

            </aside>


            <div className="admin-main">

                <header className="admin-topbar">

                    <div>
                        <span>RAILNEXUS ADMIN</span>
                    </div>

                    <div className="admin-user">
                        <div className="admin-user-avatar">
                            A
                        </div>

                        <div>
                            <strong>Admin</strong>
                            <span>Administrator</span>
                        </div>
                    </div>

                </header>


                <main className="admin-content">
                    {children}
                </main>

            </div>

        </div>
    );
}

export default AdminLayout;