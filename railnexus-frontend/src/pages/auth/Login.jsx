import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Login.css";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    async function handleEmailLogin(event) {
        event.preventDefault();

        setError("");

        if (email.trim() === "" || password.trim() === "") {
            setError("Please fill in all fields.");
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

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                setError(
                    data?.message ||
                    data?.error ||
                    "Invalid email or password."
                );
                return;
            }

            const payload = JSON.parse(
                atob(data.token.split(".")[1])
            );

            if (payload.role !== "USER") {
                setError(
                    "Administrator account detected. Please use Admin Login."
                );
                return;
            }

            login(data);

            navigate("/");

        } catch (error) {
            console.error("User login error:", error);

            setError(
                "Unable to connect to the server. Please try again."
            );
        } finally {
            setLoading(false);
        }
    }

    return (
        <div className="auth-page">

            <section className="auth-card">

                <div className="auth-header">

                    <p className="auth-tagline">
                        WELCOME BACK
                    </p>

                    <h1>
                        Login to RailNexus
                    </h1>

                    <p>
                        Sign in to continue managing your railway journeys.
                    </p>

                </div>


                <form
                    className="auth-form"
                    onSubmit={handleEmailLogin}
                >

                    <div className="auth-input-group">

                        <label htmlFor="login-email">
                            Email Address
                        </label>

                        <input
                            id="login-email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(event) =>
                                setEmail(event.target.value)
                            }
                        />

                    </div>


                    <div className="auth-input-group">

                        <label htmlFor="login-password">
                            Password
                        </label>

                        <div className="auth-password-wrapper">

                            <input
                                id="login-password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Enter your password"
                                value={password}
                                onChange={(event) =>
                                    setPassword(event.target.value)
                                }
                            />

                            <button
                                type="button"
                                className="auth-password-toggle"
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
                        <div className="auth-error">
                            {error}
                        </div>
                    )}


                    <button
                        type="submit"
                        className="auth-submit-button"
                        disabled={loading}
                    >
                        {loading
                            ? "Signing In..."
                            : "Login"}
                    </button>

                </form>


                <div className="auth-footer">

                    <p>
                        Don't have an account?{" "}

                        <Link to="/register">
                            Create an account
                        </Link>
                    </p>

                    <p className="admin-login-link">
                        Administrator?{" "}

                        <Link to="/admin/login">
                            Admin Login
                        </Link>
                    </p>

                </div>

            </section>

        </div>
    );
}

export default Login;