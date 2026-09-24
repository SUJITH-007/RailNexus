import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/AdminLogin.css";

function AdminLogin() {
    const navigate = useNavigate();

    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleSubmit(event) {
        event.preventDefault();

        setError("");

        if (
            email.trim() === "" ||
            password.trim() === ""
        ) {
            setError("Please enter your email and password.");
            return;
        }

        try {
            setLoading(true);

            const response = await fetch(
                "http://localhost:8080/api/auth/login",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify({
                        email: email.trim(),
                        password: password,
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                setError(
                    data.message ||
                    "Invalid administrator credentials."
                );
                return;
            }

            /*
             * Check the role contained in the JWT.
             */
            const payload = JSON.parse(
                atob(data.token.split(".")[1])
            );

            if (payload.role !== "ADMIN") {
                setError(
                    "Access denied. Administrator account required."
                );
                return;
            }

            /*
             * Store the JWT through AuthContext.
             */
            login(data);

            navigate("/admin");

        } catch (error) {
            console.error("Admin login error:", error);

            setError(
                "Unable to connect to the server. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="admin-login-page">

            <section className="admin-login-card">

                <div className="admin-login-header">

                    <div className="admin-login-logo">
                        A
                    </div>

                    <p className="admin-login-tagline">
                        RAILNEXUS ADMINISTRATION
                    </p>

                    <h1>
                        Administrator Login
                    </h1>

                    <p>
                        Sign in to manage RailNexus operations.
                    </p>

                </div>

                <form
                    className="admin-login-form"
                    onSubmit={handleSubmit}
                >

                    <div className="admin-login-input-group">

                        <label htmlFor="admin-email">
                            Email Address
                        </label>

                        <input
                            id="admin-email"
                            type="email"
                            placeholder="Enter administrator email"
                            value={email}
                            onChange={(event) => {
                                setEmail(event.target.value);
                                setError("");
                            }}
                        />

                    </div>

                    <div className="admin-login-input-group">

                        <label htmlFor="admin-password">
                            Password
                        </label>

                        <div className="admin-login-password-wrapper">

                            <input
                                id="admin-password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Enter administrator password"
                                value={password}
                                onChange={(event) => {
                                    setPassword(event.target.value);
                                    setError("");
                                }}
                            />

                            <button
                                type="button"
                                className="admin-login-password-toggle"
                                onClick={() =>
                                    setShowPassword(
                                        !showPassword
                                    )
                                }
                            >
                                {showPassword
                                    ? "Hide"
                                    : "Show"}
                            </button>

                        </div>

                    </div>

                    {error && (
                        <div className="admin-login-error">
                            {error}
                        </div>
                    )}

                    <button
                        type="submit"
                        className="admin-login-submit"
                        disabled={loading}
                    >
                        {loading
                            ? "Signing in..."
                            : "Administrator Login"}
                    </button>

                </form>

                <div className="admin-login-footer">

                    <p>
                        Authorized personnel only.
                    </p>

                    <Link to="/login">
                        ← Back to User Login
                    </Link>

                </div>

            </section>

        </div>
    );
}

export default AdminLogin;