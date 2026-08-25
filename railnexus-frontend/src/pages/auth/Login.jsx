import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "../../styles/Login.css";

function Login() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [loginMethod, setLoginMethod] = useState("email");

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [showPassword, setShowPassword] = useState(false);

    const [phone, setPhone] = useState("");
    const [otp, setOtp] = useState("");
    const [otpSent, setOtpSent] = useState(false);

    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    function handleMethodChange(method) {
        setLoginMethod(method);
        setError("");
        setMessage("");
        setOtpSent(false);
        setOtp("");
    }

    function handleEmailLogin(event) {
        event.preventDefault();

        setError("");
        setMessage("");

        if (email.trim() === "" || password.trim() === "") {
            setError("Please fill in all fields.");
            return;
        }

        login();
        navigate("/");
    }

    function handleSendOtp() {
        setError("");
        setMessage("");

        const phoneNumber = phone.trim();

        if (!/^\d{10}$/.test(phoneNumber)) {
            setError("Phone number must contain 10 digits.");
            return;
        }

        setOtpSent(true);
        setMessage("OTP sent successfully.");

        console.log("OTP sent to:", phoneNumber);
    }

    function handleVerifyOtp(event) {
        event.preventDefault();

        setError("");
        setMessage("");

        if (otp.trim() === "") {
            setError("Please enter the OTP.");
            return;
        }

        if (!/^\d{6}$/.test(otp)) {
            setError("OTP must contain 6 digits.");
            return;
        }

        login();
        navigate("/");
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


                <div className="auth-method-switch">

                    <button
                        type="button"
                        className={
                            loginMethod === "email"
                                ? "auth-method-button active"
                                : "auth-method-button"
                        }
                        onClick={() =>
                            handleMethodChange("email")
                        }
                    >
                        Email & Password
                    </button>

                    <button
                        type="button"
                        className={
                            loginMethod === "phone"
                                ? "auth-method-button active"
                                : "auth-method-button"
                        }
                        onClick={() =>
                            handleMethodChange("phone")
                        }
                    >
                        Phone & OTP
                    </button>

                </div>


                {loginMethod === "email" ? (

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
                        >
                            Login
                        </button>

                    </form>

                ) : (

                    <form
                        className="auth-form"
                        onSubmit={handleVerifyOtp}
                    >

                        <div className="auth-input-group">

                            <label htmlFor="login-phone">
                                Phone Number
                            </label>

                            <input
                                id="login-phone"
                                type="tel"
                                placeholder="Enter 10-digit phone number"
                                value={phone}
                                onChange={(event) =>
                                    setPhone(event.target.value)
                                }
                                maxLength="10"
                            />

                        </div>


                        {!otpSent ? (

                            <button
                                type="button"
                                className="auth-submit-button"
                                onClick={handleSendOtp}
                            >
                                Send OTP
                            </button>

                        ) : (

                            <>

                                <div className="auth-input-group">

                                    <label htmlFor="login-otp">
                                        OTP
                                    </label>

                                    <input
                                        id="login-otp"
                                        type="text"
                                        inputMode="numeric"
                                        placeholder="Enter 6-digit OTP"
                                        value={otp}
                                        onChange={(event) =>
                                            setOtp(
                                                event.target.value
                                            )
                                        }
                                        maxLength="6"
                                    />

                                </div>


                                {message && (
                                    <div className="auth-success">
                                        {message}
                                    </div>
                                )}


                                {error && (
                                    <div className="auth-error">
                                        {error}
                                    </div>
                                )}


                                <button
                                    type="submit"
                                    className="auth-submit-button"
                                >
                                    Verify OTP
                                </button>


                                <button
                                    type="button"
                                    className="auth-resend-button"
                                    onClick={handleSendOtp}
                                >
                                    Resend OTP
                                </button>

                            </>

                        )}

                    </form>

                )}


                {loginMethod === "email" && error && (
                    <div className="auth-error">
                        {error}
                    </div>
                )}


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