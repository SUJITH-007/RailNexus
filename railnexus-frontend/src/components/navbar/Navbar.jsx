import { Link, useNavigate, useLocation } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Navbar.css";

function Navbar() {
    const navigate = useNavigate();
    const location = useLocation();
    const { isLoggedIn, logout } = useAuth();

    const isAdminPage = location.pathname.startsWith("/admin");

    return (
        <nav className="navbar">

            <div className="navbar-brand">
                <Link to="/">
                    <h2>RailNexus</h2>
                </Link>
            </div>

            {!isAdminPage && (
                <div className="navbar-links">

                    <Link to="/">
                        Home
                    </Link>

                    <Link to="/trains">
                        Search Trains
                    </Link>

                    {isLoggedIn ? (
                        <>
                            <Link to="/my-bookings">
                                My Bookings
                            </Link>

                            <Link to="/profile">
                                Profile
                            </Link>

                            <button
                                type="button"
                                className="navbar-logout-button"
                                onClick={() => {
                                    logout();
                                    navigate("/");
                                }}
                            >
                                Logout
                            </button>
                        </>
                    ) : (
                        <>
                            <Link to="/login">
                                Login
                            </Link>

                            <Link to="/register">
                                Register
                            </Link>
                        </>
                    )}

                </div>
            )}

        </nav>
    );
}

export default Navbar;