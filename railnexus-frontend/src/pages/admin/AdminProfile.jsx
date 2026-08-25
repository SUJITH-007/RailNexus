import { useState } from "react";
import "../../styles/AdminProfile.css";

function AdminProfile() {
    const [isEditing, setIsEditing] = useState(false);

    const [admin, setAdmin] = useState({
        name: "Admin User",
        email: "admin@railnexus.com",
        phone: "9876543210",
        role: "System Administrator",
    });

    const [formData, setFormData] = useState(admin);

    function handleChange(event) {
        setFormData({
            ...formData,
            [event.target.name]: event.target.value,
        });
    }

    function handleEdit() {
        setFormData(admin);
        setIsEditing(true);
    }

    function handleCancel() {
        setFormData(admin);
        setIsEditing(false);
    }

    function handleSave(event) {
        event.preventDefault();

        setAdmin(formData);
        setIsEditing(false);
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
                            {admin.name.charAt(0)}
                        </div>

                        <div>
                            <h2>{admin.name}</h2>

                            <p>
                                {admin.role}
                            </p>

                            <span className="admin-profile-status">
                                ACTIVE ACCOUNT
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
                                    {admin.role}
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
                                    Active
                                </strong>

                            </div>

                            <div className="admin-account-row">

                                <span>
                                    Account Type
                                </span>

                                <strong>
                                    Administrator
                                </strong>

                            </div>

                            <div className="admin-account-row">

                                <span>
                                    Access Level
                                </span>

                                <strong>
                                    Full System Access
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


                        <div className="admin-profile-grid">

                            <div className="admin-profile-input-group">

                                <label htmlFor="admin-name">
                                    Full Name
                                </label>

                                <input
                                    id="admin-name"
                                    name="name"
                                    type="text"
                                    value={formData.name}
                                    onChange={handleChange}
                                />

                            </div>


                            <div className="admin-profile-input-group">

                                <label htmlFor="admin-email">
                                    Email Address
                                </label>

                                <input
                                    id="admin-email"
                                    name="email"
                                    type="email"
                                    value={formData.email}
                                    onChange={handleChange}
                                />

                            </div>


                            <div className="admin-profile-input-group">

                                <label htmlFor="admin-phone">
                                    Phone Number
                                </label>

                                <input
                                    id="admin-phone"
                                    name="phone"
                                    type="tel"
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
                                    value={formData.role}
                                    disabled
                                />

                            </div>

                        </div>


                        <div className="admin-profile-form-actions">

                            <button
                                type="button"
                                className="admin-profile-cancel-button"
                                onClick={handleCancel}
                            >
                                Cancel
                            </button>

                            <button
                                type="submit"
                                className="admin-profile-save-button"
                            >
                                Save Changes
                            </button>

                        </div>

                    </form>

                )}

            </section>

        </div>
    );
}

export default AdminProfile;