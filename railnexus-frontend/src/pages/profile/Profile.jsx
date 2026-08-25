import { useState } from "react";
import "../../styles/Profile.css";

function Profile() {
    const [isEditing, setIsEditing] = useState(false);

    const [profile, setProfile] = useState({
        name: "abc",
        email: "abc@gmail.com",
        phone: "9876543210",
    });

    const [formData, setFormData] = useState(profile);

    function handleChange(event) {
        const { name, value } = event.target;

        setFormData({
            ...formData,
            [name]: value,
        });
    }

    function handleEdit() {
        setFormData(profile);
        setIsEditing(true);
    }

    function handleCancel() {
        setFormData(profile);
        setIsEditing(false);
    }

    function handleSave() {
        setProfile(formData);
        setIsEditing(false);
    }

    return (
        <div className="profile-page">

            <section className="profile-header">
                <div className="profile-header-content">

                    <p className="profile-tagline">
                        ACCOUNT
                    </p>

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
                                ACTIVE ACCOUNT
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


                    {isEditing && (
                        <div className="profile-actions">

                            <button
                                type="button"
                                className="profile-cancel-button"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>

                            <button
                                type="button"
                                className="profile-save-button"
                                onClick={handleSave}
                            >
                                Save Changes
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
                        >
                            Change Password
                        </button>

                    </div>

                </section>


                <section className="profile-card">

                    <div className="profile-section-heading">

                        <p className="profile-section-label">
                            ACCOUNT
                        </p>

                        <h2>Account Information</h2>

                    </div>


                    <div className="profile-info-grid">

                        <div className="profile-info-item">
                            <span>Account Status</span>
                            <strong>Active</strong>
                        </div>

                        <div className="profile-info-item">
                            <span>Member Since</span>
                            <strong>August 2026</strong>
                        </div>

                    </div>

                </section>

            </main>

        </div>
    );
}

export default Profile;