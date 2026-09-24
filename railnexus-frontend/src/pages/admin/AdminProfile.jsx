import { useEffect, useState } from "react";
import "../../styles/AdminProfile.css";

function AdminProfile() {
    const [isEditing, setIsEditing] = useState(false);

    const [admin, setAdmin] = useState(null);

    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");
    const [message, setMessage] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchProfile();
    }, []);

    async function fetchProfile() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:8080/api/users/me",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to load administrator profile."
                );
            }

            setAdmin(data);

            setFormData({
                name: data.name,
                email: data.email,
                phone: data.phone,
            });

        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function handleChange(event) {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });

        setError("");
        setMessage("");
    }

    function handleEdit() {
        setFormData({
            name: admin.name,
            email: admin.email,
            phone: admin.phone,
        });

        setError("");
        setMessage("");
        setIsEditing(true);
    }

    function handleCancel() {
        setFormData({
            name: admin.name,
            email: admin.email,
            phone: admin.phone,
        });

        setError("");
        setMessage("");
        setIsEditing(false);
    }

    async function handleSave(event) {
        event.preventDefault();

        setError("");
        setMessage("");

        if (
            formData.name.trim() === "" ||
            formData.email.trim() === "" ||
            formData.phone.trim() === ""
        ) {
            setError("Please fill in all fields.");
            return;
        }

        if (!/^\d{10}$/.test(formData.phone.trim())) {
            setError("Phone number must contain 10 digits.");
            return;
        }

        try {
            setSaving(true);

            const response = await fetch(
                "http://localhost:8080/api/users/me",
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        name: formData.name.trim(),
                        email: formData.email.trim(),
                        phone: formData.phone.trim(),
                    }),
                }
            );

            const data = await response.json();

            if (!response.ok) {
                throw new Error(
                    data.message ||
                    "Failed to update administrator profile."
                );
            }

            localStorage.setItem("token", data.token);

            const profileResponse = await fetch(
                "http://localhost:8080/api/users/me",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${data.token}`,
                    },
                }
            );

            const updatedProfile = await profileResponse.json();

            if (!profileResponse.ok) {
                throw new Error(
                    updatedProfile.message ||
                    "Profile updated, but failed to reload profile."
                );
            }

            setAdmin(updatedProfile);

            setFormData({
                name: updatedProfile.name,
                email: updatedProfile.email,
                phone: updatedProfile.phone,
            });

            setIsEditing(false);
            setMessage("Profile updated successfully.");

        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="admin-page">

                <div className="admin-page-header">
                    <div>
                        <p className="admin-page-label">
                            ACCOUNT
                        </p>

                        <h1>Admin Profile</h1>

                        <p>
                            Manage your administrator account and profile information.
                        </p>
                    </div>
                </div>

                <section className="admin-profile-card">
                    <div className="admin-profile-details">
                        Loading profile...
                    </div>
                </section>

            </div>
        );
    }

    if (!admin) {
        return (
            <div className="admin-page">

                <div className="admin-page-header">
                    <div>
                        <p className="admin-page-label">
                            ACCOUNT
                        </p>

                        <h1>Admin Profile</h1>

                        <p>
                            Manage your administrator account and profile information.
                        </p>
                    </div>
                </div>

                <section className="admin-profile-card">
                    <div className="admin-profile-details">
                        <p>{error || "Unable to load profile."}</p>
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
                        ACCOUNT
                    </p>

                    <h1>Admin Profile</h1>

                    <p>
                        Manage your administrator account and profile information.
                    </p>
                </div>

            </div>

            <section className="admin-profile-card">

                <div className="admin-profile-top">

                    <div className="admin-profile-identity">

                        <div className="admin-profile-avatar">
                            {admin.name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <h2>{admin.name}</h2>

                            <p>
                                {admin.role === "ADMIN"
                                    ? "Administrator"
                                    : admin.role}
                            </p>

                            <span className="admin-profile-status">
                                {admin.status === "ACTIVE"
                                    ? "ACTIVE ACCOUNT"
                                    : admin.status}
                            </span>
                        </div>

                    </div>

                    {!isEditing && (
                        <button
                            type="button"
                            className="admin-profile-edit-button"
                            onClick={handleEdit}
                        >
                            Edit Profile
                        </button>
                    )}

                </div>

                {error && (
                    <div className="admin-profile-message error">
                        {error}
                    </div>
                )}

                {message && (
                    <div className="admin-profile-message success">
                        {message}
                    </div>
                )}

                {!isEditing ? (

                    <div className="admin-profile-details">

                        <div className="admin-profile-section">

                            <p className="admin-profile-section-label">
                                PERSONAL INFORMATION
                            </p>

                            <h3>Profile Details</h3>

                            <p className="admin-profile-section-description">
                                View your administrator account information.
                            </p>

                        </div>

                        <div className="admin-profile-grid">

                            <div className="admin-profile-field">

                                <label>
                                    Full Name
                                </label>

                                <div className="admin-profile-value">
                                    {admin.name}
                                </div>

                            </div>

                            <div className="admin-profile-field">

                                <label>
                                    Email Address
                                </label>

                                <div className="admin-profile-value">
                                    {admin.email}
                                </div>

                            </div>

                            <div className="admin-profile-field">

                                <label>
                                    Phone Number
                                </label>

                                <div className="admin-profile-value">
                                    {admin.phone}
                                </div>

                            </div>

                            <div className="admin-profile-field">

                                <label>
                                    Role
                                </label>

                                <div className="admin-profile-value">
                                    {admin.role === "ADMIN"
                                        ? "Administrator"
                                        : admin.role}
                                </div>

                            </div>

                        </div>

                        <div className="admin-account-info">

                            <p className="admin-profile-section-label">
                                ACCOUNT INFORMATION
                            </p>

                            <div className="admin-account-row">

                                <span>
                                    Account Status
                                </span>

                                <strong>
                                    {admin.status === "ACTIVE"
                                        ? "Active"
                                        : admin.status}
                                </strong>

                            </div>

                            <div className="admin-account-row">

                                <span>
                                    Account Type
                                </span>

                                <strong>
                                    {admin.role === "ADMIN"
                                        ? "Administrator"
                                        : admin.role}
                                </strong>

                            </div>

                            <div className="admin-account-row">

                                <span>
                                    Access Level
                                </span>

                                <strong>
                                    {admin.role === "ADMIN"
                                        ? "Full System Access"
                                        : "Standard Access"}
                                </strong>

                            </div>

                        </div>

                    </div>

                ) : (

                    <form
                        className="admin-profile-edit-form"
                        onSubmit={handleSave}
                    >

                        <div className="admin-profile-section">

                            <p className="admin-profile-section-label">
                                EDIT PROFILE
                            </p>

                            <h3>Update Profile</h3>

                            <p className="admin-profile-section-description">
                                Update your administrator account information.
                            </p>

                        </div>

                        <div className="admin-profile-edit-grid">

                            <div className="admin-profile-input-group">

                                <label htmlFor="admin-profile-name">
                                    Full Name
                                </label>

                                <input
                                    id="admin-profile-name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="admin-profile-input-group">

                                <label htmlFor="admin-profile-email">
                                    Email Address
                                </label>

                                <input
                                    id="admin-profile-email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="admin-profile-input-group">

                                <label htmlFor="admin-profile-phone">
                                    Phone Number
                                </label>

                                <input
                                    id="admin-profile-phone"
                                    name="phone"
                                    type="tel"
                                    maxLength="10"
                                    value={formData.phone}
                                    onChange={handleChange}
                                />

                            </div>

                            <div className="admin-profile-input-group">

                                <label>
                                    Role
                                </label>

                                <input
                                    type="text"
                                    value={
                                        admin.role === "ADMIN"
                                            ? "Administrator"
                                            : admin.role
                                    }
                                    disabled
                                />

                            </div>

                        </div>

                        <div className="admin-profile-form-actions">

                            <button
                                type="button"
                                className="admin-profile-cancel-button"
                                onClick={handleCancel}
                                disabled={saving}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="admin-profile-save-button"
                                disabled={saving}
                            >
                                {saving
                                    ? "Saving..."
                                    : "Save Changes"}
                            </button>

                        </div>

                    </form>

                )}

            </section>

        </div>
    );
}

export default AdminProfile;