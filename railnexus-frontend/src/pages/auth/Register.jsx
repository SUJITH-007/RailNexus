import { useState } from "react";
import { Link } from "react-router-dom";
import "../../styles/Register.css";

function Register() {
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [phone, setPhone] = useState("");
    const [password, setPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const [showPassword, setShowPassword] = useState(false);
    const [showConfirmPassword, setShowConfirmPassword] = useState(false);

    const [error, setError] = useState("");

    function handleSubmit(event) {
        event.preventDefault();

        setError("");

        if (
            name.trim() === "" ||
            email.trim() === "" ||
            phone.trim() === "" ||
            password === "" ||
            confirmPassword === ""
        ) {
            setError("Please fill in all fields.");
            return;
        }

        if (phone.length !== 10) {
            setError("Phone number must contain 10 digits.");
            return;
        }

        if (password.length < 6) {
            setError("Password must contain at least 6 characters.");
            return;
        }

        if (password !== confirmPassword) {
            setError("Passwords do not match.");
            return;
        }

        console.log("Registration form submitted");
    }

    return (
        <div className="auth-page">

            <section className="auth-card register-card">

                <div className="auth-header">
                    <p className="auth-tagline">
                        JOIN RAILNEXUS
                    </p>

                    <h1>Create Your Account</h1>

                    <p>
                        Create an account to manage your railway
                        journeys and bookings.
                    </p>
                </div>

                <form
                    className="auth-form"
                    onSubmit={handleSubmit}
                >

                    <div className="auth-input-group">
                        <label htmlFor="register-name">
                            Full Name
                        </label>

                        <input
                            id="register-name"
                            type="text"
                            placeholder="Enter your full name"
                            value={name}
                            onChange={(event) => {
                                setName(event.target.value);
                                setError("");
                            }}
                        />
                    </div>

                    <div className="auth-input-group">
                        <label htmlFor="register-email">
                            Email Address
                        </label>

                        <input
                            id="register-email"
                            type="email"
                            placeholder="Enter your email"
                            value={email}
                            onChange={(event) => {
                                setEmail(event.target.value);
                                setError("");
                            }}
                        />
                    </div>

                    <div className="auth-input-group">
                        <label htmlFor="register-phone">
                            Phone Number
                        </label>

                        <input
                            id="register-phone"
                            type="tel"
                            inputMode="numeric"
                            maxLength="10"
                            placeholder="Enter 10-digit phone number"
                            value={phone}
                            onChange={(event) => {
                                const value =
                                    event.target.value.replace(/\D/g, "");

                                setPhone(value);
                                setError("");
                            }}
                        />
                    </div>

                    <div className="auth-input-group">
                        <label htmlFor="register-password">
                            Password
                        </label>

                        <div className="auth-password-wrapper">

                            <input
                                id="register-password"
                                type={
                                    showPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Create a password"
                                value={password}
                                onChange={(event) => {
                                    setPassword(event.target.value);
                                    setError("");
                                }}
                            />

                            <button
                                type="button"
                                className="auth-password-toggle"
                                onClick={() =>
                                    setShowPassword(!showPassword)
                                }
                            >
                                {showPassword ? "Hide" : "Show"}
                            </button>

                        </div>
                    </div>

                    <div className="auth-input-group">
                        <label htmlFor="register-confirm-password">
                            Confirm Password
                        </label>

                        <div className="auth-password-wrapper">

                            <input
                                id="register-confirm-password"
                                type={
                                    showConfirmPassword
                                        ? "text"
                                        : "password"
                                }
                                placeholder="Confirm your password"
                                value={confirmPassword}
                                onChange={(event) => {
                                    setConfirmPassword(
                                        event.target.value
                                    );
                                    setError("");
                                }}
                            />

                            <button
                                type="button"
                                className="auth-password-toggle"
                                onClick={() =>
                                    setShowConfirmPassword(
                                        !showConfirmPassword
                                    )
                                }
                            >
                                {showConfirmPassword
                                    ? "Hide"
                                    : "Show"}
                            </button>

                        </div>
                    </div>

                    {error && (
                        <p className="auth-error">
                            {error}
                        </p>
                    )}

                    <button
                        type="submit"
                        className="auth-submit-button"
                    >
                        Create Account
                    </button>

                </form>

                <div className="auth-footer">
                    <p>
                        Already have an account?{" "}
                        <Link to="/login">
                            Login
                        </Link>
                    </p>
                </div>

            </section>

        </div>
    );
}

export default Register;