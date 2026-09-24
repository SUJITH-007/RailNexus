import { useEffect, useState } from "react";
import "../../styles/AdminUsers.css";

function AdminUsers() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");
    const [selectedUser, setSelectedUser] = useState(null);
    const [users, setUsers] = useState([]);
    const [loading, setLoading] = useState(true);
    const [updatingUserId, setUpdatingUserId] = useState(null);
    const [error, setError] = useState("");

    useEffect(() => {
        fetchUsers();
    }, []);

    async function fetchUsers() {
        try {
            setLoading(true);
            setError("");

            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:8080/api/admin/users",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    data?.error ||
                    "Failed to load users."
                );
            }

            setUsers(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    async function handleToggleBlock(user) {
        try {
            setUpdatingUserId(user.id);
            setError("");

            const nextStatus =
                user.status === "ACTIVE"
                    ? "BLOCKED"
                    : "ACTIVE";

            const token = localStorage.getItem("token");

            const response = await fetch(
                `http://localhost:8080/api/admin/users/${user.id}/status?status=${nextStatus}`,
                {
                    method: "PUT",
                    headers: {
                        Authorization: `Bearer ${token}`,
                        "Content-Type": "application/json",
                    },
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    data?.error ||
                    "Failed to update user status."
                );
            }

            setUsers((currentUsers) =>
                currentUsers.map((currentUser) =>
                    currentUser.id === data.id
                        ? data
                        : currentUser
                )
            );

            setSelectedUser((currentSelectedUser) =>
                currentSelectedUser?.id === data.id
                    ? data
                    : currentSelectedUser
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setUpdatingUserId(null);
        }
    }

    function formatDate(dateTime) {
        if (!dateTime) {
            return "-";
        }

        return new Date(dateTime).toLocaleDateString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
            }
        );
    }

    function formatDateTime(dateTime) {
        if (!dateTime) {
            return "-";
        }

        return new Date(dateTime).toLocaleString(
            "en-IN",
            {
                day: "2-digit",
                month: "short",
                year: "numeric",
                hour: "2-digit",
                minute: "2-digit",
            }
        );
    }

    const filteredUsers = users.filter((user) => {
        const searchValue = search.toLowerCase();

        const matchesSearch =
            user.name?.toLowerCase().includes(searchValue) ||
            user.email?.toLowerCase().includes(searchValue) ||
            user.phone?.includes(searchValue) ||
            user.role?.toLowerCase().includes(searchValue);

        const matchesStatus =
            statusFilter === "All" ||
            user.status === statusFilter;

        return matchesSearch && matchesStatus;
    });

    return (
        <div className="admin-page">

            <div className="admin-page-header">

                <div>
                    <p className="admin-page-label">
                        MANAGEMENT
                    </p>

                    <h1>Users</h1>

                    <p>
                        Manage RailNexus passenger accounts and access.
                    </p>
                </div>

            </div>

            <section className="admin-card">

                <div className="admin-users-toolbar">

                    <div>
                        <h2>User List</h2>

                        <p>
                            {filteredUsers.length} users found
                        </p>
                    </div>

                    <div className="admin-user-filters">

                        <input
                            type="text"
                            placeholder="Search users..."
                            value={search}
                            onChange={(event) =>
                                setSearch(event.target.value)
                            }
                            className="admin-search-input"
                        />

                        <select
                            value={statusFilter}
                            onChange={(event) =>
                                setStatusFilter(event.target.value)
                            }
                            className="admin-filter-select"
                        >
                            <option value="All">
                                All Status
                            </option>

                            <option value="ACTIVE">
                                Active
                            </option>

                            <option value="BLOCKED">
                                Blocked
                            </option>
                        </select>

                    </div>

                </div>

                {error && (
                    <div className="admin-form-error">
                        {error}
                    </div>
                )}

                <div className="admin-table-wrapper">

                    <table className="admin-table">

                        <thead>
                            <tr>
                                <th>User</th>
                                <th>Phone</th>
                                <th>Registered</th>
                                <th>Bookings</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>

                            {loading ? (

                                <tr>
                                    <td colSpan="6">
                                        Loading users...
                                    </td>
                                </tr>

                            ) : filteredUsers.length === 0 ? (

                                <tr>
                                    <td colSpan="6">
                                        No users found.
                                    </td>
                                </tr>

                            ) : (

                                filteredUsers.map((user) => (

                                    <tr key={user.id}>

                                        <td>

                                            <div className="admin-user-info">

                                                <div className="admin-user-avatar">
                                                    {user.name
                                                        ?.charAt(0)
                                                        .toUpperCase()}
                                                </div>

                                                <div>

                                                    <strong>
                                                        {user.name}
                                                    </strong>

                                                    <span>
                                                        {user.email}
                                                    </span>

                                                </div>

                                            </div>

                                        </td>

                                        <td>
                                            {user.phone || "-"}
                                        </td>

                                        <td>
                                            {formatDate(user.createdAt)}
                                        </td>

                                        <td>
                                            {user.totalBookings ?? 0}
                                        </td>

                                        <td>

                                            <span
                                                className={
                                                    user.status === "ACTIVE"
                                                        ? "admin-user-status active"
                                                        : "admin-user-status blocked"
                                                }
                                            >
                                                {user.status}
                                            </span>

                                        </td>

                                        <td>

                                            <div className="admin-user-actions">

                                                <button
                                                    type="button"
                                                    className="admin-view-button"
                                                    onClick={() =>
                                                        setSelectedUser(user)
                                                    }
                                                >
                                                    View
                                                </button>

                                                <button
                                                    type="button"
                                                    className={
                                                        user.status === "ACTIVE"
                                                            ? "admin-block-button"
                                                            : "admin-unblock-button"
                                                    }
                                                    disabled={
                                                        updatingUserId === user.id
                                                    }
                                                    onClick={() =>
                                                        handleToggleBlock(user)
                                                    }
                                                >
                                                    {updatingUserId === user.id
                                                        ? "Updating..."
                                                        : user.status === "ACTIVE"
                                                            ? "Block"
                                                            : "Unblock"}
                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                    {!loading &&
                        filteredUsers.length === 0 && (
                            <div className="admin-empty-state">

                                <h3>
                                    No users found
                                </h3>

                                <p>
                                    Try changing your search or filter.
                                </p>

                            </div>
                        )}

                </div>

            </section>

            {selectedUser && (

                <div
                    className="admin-modal-overlay"
                    onClick={() => setSelectedUser(null)}
                >

                    <div
                        className="admin-user-detail-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="admin-modal-header">

                            <div>

                                <p className="admin-page-label">
                                    USER DETAILS
                                </p>

                                <h2>
                                    User Account
                                </h2>

                                <p>
                                    View user account information.
                                </p>

                            </div>

                            <button
                                type="button"
                                className="admin-modal-close"
                                onClick={() =>
                                    setSelectedUser(null)
                                }
                            >
                                ×
                            </button>

                        </div>

                        <div className="admin-user-detail-content">

                            <div className="admin-user-detail-profile">

                                <div className="admin-user-detail-avatar">
                                    {selectedUser.name
                                        ?.charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div>

                                    <h3>
                                        {selectedUser.name}
                                    </h3>

                                    <span
                                        className={
                                            selectedUser.status === "ACTIVE"
                                                ? "admin-user-status active"
                                                : "admin-user-status blocked"
                                        }
                                    >
                                        {selectedUser.status}
                                    </span>

                                </div>

                            </div>

                            <div className="admin-detail-section">

                                <h3>
                                    Personal Information
                                </h3>

                                <div className="admin-detail-grid">

                                    <div>
                                        <span>
                                            Full Name
                                        </span>

                                        <strong>
                                            {selectedUser.name}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Email Address
                                        </span>

                                        <strong>
                                            {selectedUser.email}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Phone Number
                                        </span>

                                        <strong>
                                            {selectedUser.phone || "-"}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Role
                                        </span>

                                        <strong>
                                            {selectedUser.role}
                                        </strong>
                                    </div>

                                    <div>
                                        <span>
                                            Registered
                                        </span>

                                        <strong>
                                            {formatDateTime(
                                                selectedUser.createdAt
                                            )}
                                        </strong>
                                    </div>

                                </div>

                            </div>

                            <div className="admin-user-detail-stat">

                                <div>

                                    <span>
                                        TOTAL BOOKINGS
                                    </span>

                                    <strong>
                                        {selectedUser.totalBookings ?? 0}
                                    </strong>

                                </div>

                                <div>

                                    <span>
                                        ACCOUNT STATUS
                                    </span>

                                    <strong>
                                        {selectedUser.status}
                                    </strong>

                                </div>

                            </div>

                        </div>

                        <div className="admin-detail-footer">

                            <button
                                type="button"
                                className="admin-cancel-button"
                                onClick={() =>
                                    setSelectedUser(null)
                                }
                            >
                                Close
                            </button>

                        </div>

                    </div>

                </div>

            )}

        </div>
    );
}

export default AdminUsers;