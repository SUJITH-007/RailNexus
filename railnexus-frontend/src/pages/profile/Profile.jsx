
import { useEffect, useState } from "react";
import { useAuth } from "../../context/AuthContext";
import API_BASE_URL from "../../config/api";
import "../../styles/Profile.css";

function Profile() {
    const { token, login } = useAuth();

    const [profile, setProfile] = useState(null);
    const [formData, setFormData] = useState({
        name: "",
        email: "",
        phone: "",
    });

    const [isEditing, setIsEditing] = useState(false);
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState("");

    useEffect(() => {
        async function fetchProfile() {
            try {
                const response = await fetch(
                    `${API_BASE_URL}/api/users/me`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!response.ok) {
                    throw new Error("Unable to load profile");
                }

                const data = await response.json();

                setProfile(data);
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

        if (token) {
            fetchProfile();
        } else {
            setError("Please log in to view your profile.");
            setLoading(false);
        }
    }, [token]);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData((previous) => ({
            ...previous,
            [name]: value,
        }));
    }

    function handleEdit() {
        setFormData({
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
        });

        setIsEditing(true);
        setError("");
    }

    function handleCancel() {
        setFormData({
            name: profile.name,
            email: profile.email,
            phone: profile.phone,
        });

        setIsEditing(false);
        setError("");
    }

    async function handleSave() {
        setSaving(true);
        setError("");

        try {
            const response = await fetch(
                `${API_BASE_URL}/api/users/me`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                    body: JSON.stringify(formData),
                }
            );

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || "Profile update failed");
            }

            const data = await response.json();

            // Backend returns a refreshed JWT.
            login(data);

            // Fetch the updated profile using the new token.
            const refreshedToken = data.token;

            const profileResponse = await fetch(
                `${API_BASE_URL}/api/users/me`,
                {
                    headers: {
                        Authorization: `Bearer ${refreshedToken}`,
                    },
                }
            );

            if (!profileResponse.ok) {
                throw new Error("Profile updated, but refresh failed.");
            }

            const updatedProfile = await profileResponse.json();

            setProfile(updatedProfile);
            setFormData({
                name: updatedProfile.name,
                email: updatedProfile.email,
                phone: updatedProfile.phone,
            });

            setIsEditing(false);
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return <div className="profile-page">Loading profile...</div>;
    }

    if (!profile) {
        return (
            <div className="profile-page">
                <p>{error || "Profile unavailable."}</p>
            </div>
        );
    }

    return (
        <div className="profile-page">

            <section className="profile-header">
                <div className="profile-header-content">
                    <p className="profile-tagline">ACCOUNT</p>
                    <h1>My Profile</h1>
                    <p>
                        Manage your personal information and
                        RailNexus account.
                    </p>
                </div>
            </section>

            <main className="profile-content">

                <section className="profile-card">

                    <div className="profile-card-header">
                        <div>
                            <p className="profile-section-label">
                                PERSONAL INFORMATION
                            </p>
                            <h2>Profile Details</h2>
                            <p>
                                View and manage your account information.
                            </p>
                        </div>

                        {!isEditing && (
                            <button
                                type="button"
                                className="profile-edit-button"
                                onClick={handleEdit}
                            >
                                Edit Profile
                            </button>
                        )}
                    </div>

                    <div className="profile-avatar-section">
                        <div className="profile-avatar">
                            {profile.name.charAt(0).toUpperCase()}
                        </div>

                        <div>
                            <h3>{profile.name}</h3>
                            <span className="profile-status">
                                {profile.status} ACCOUNT
                            </span>
                        </div>
                    </div>

                    <div className="profile-form">

                        <div className="profile-input-group">
                            <label htmlFor="profile-name">
                                Full Name
                            </label>
                            <input
                                id="profile-name"
                                name="name"
                                type="text"
                                value={formData.name}
                                disabled={!isEditing}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="profile-input-group">
                            <label htmlFor="profile-email">
                                Email Address
                            </label>
                            <input
                                id="profile-email"
                                name="email"
                                type="email"
                                value={formData.email}
                                disabled={!isEditing}
                                onChange={handleChange}
                            />
                        </div>

                        <div className="profile-input-group">
                            <label htmlFor="profile-phone">
                                Phone Number
                            </label>
                            <input
                                id="profile-phone"
                                name="phone"
                                type="tel"
                                value={formData.phone}
                                disabled={!isEditing}
                                onChange={handleChange}
                            />
                        </div>

                    </div>

                    {error && <p className="profile-error">{error}</p>}

                    {isEditing && (
                        <div className="profile-actions">
                            <button
                                type="button"
                                className="profile-cancel-button"
                                onClick={handleCancel}
                                disabled={saving}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="profile-save-button"
                                onClick={handleSave}
                                disabled={saving}
                            >
                                {saving ? "Saving..." : "Save Changes"}
                            </button>
                        </div>
                    )}

                </section>

                <section className="profile-card">

                    <div className="profile-section-heading">
                        <p className="profile-section-label">
                            SECURITY
                        </p>
                        <h2>Account Security</h2>
                        <p>
                            Manage your password and account security.
                        </p>
                    </div>

                    <div className="profile-security-row">
                        <div>
                            <h3>Password</h3>
                            <p>
                                Keep your account secure with a strong password.
                            </p>
                        </div>

                        <button
                            type="button"
                            className="profile-secondary-button"
                            disabled
                        >
                            Change Password
                        </button>
                    </div>

                </section>

                <section className="profile-card">

                    <div className="profile-section-heading">
                        <p className="profile-section-label">ACCOUNT</p>
                        <h2>Account Information</h2>
                    </div>

                    <div className="profile-info-grid">

                        <div className="profile-info-item">
                            <span>Account Status</span>
                            <strong>{profile.status}</strong>
                        </div>

                        <div className="profile-info-item">
                            <span>Member Since</span>
                            <strong>
                                {new Date(profile.createdAt).toLocaleDateString(
                                    "en-IN",
                                    {
                                        month: "long",
                                        year: "numeric",
                                    }
                                )}
                            </strong>
                        </div>

                    </div>

                </section>

            </main>
        </div>
    );
}

export default Profile;
