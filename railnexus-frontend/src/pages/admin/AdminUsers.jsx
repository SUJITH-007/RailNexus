import { useState } from "react";
import "../../styles/AdminUsers.css";

function AdminUsers() {
    const [search, setSearch] = useState("");
    const [statusFilter, setStatusFilter] = useState("All");

    const [selectedUser, setSelectedUser] = useState(null);

    const [users, setUsers] = useState([
        {
            id: 1,
            name: "Rahul Kumar",
            email: "rahul.kumar@gmail.com",
            phone: "9876543210",
            registered: "12 Jan 2026",
            bookings: 8,
            status: "Active",
        },
        {
            id: 2,
            name: "Ananya Rao",
            email: "ananya.rao@gmail.com",
            phone: "9876543211",
            registered: "18 Feb 2026",
            bookings: 5,
            status: "Active",
        },
        {
            id: 3,
            name: "Vikram Shetty",
            email: "vikram.shetty@gmail.com",
            phone: "9876543212",
            registered: "03 Mar 2026",
            bookings: 12,
            status: "Blocked",
        },
        {
            id: 4,
            name: "Priya Nair",
            email: "priya.nair@gmail.com",
            phone: "9876543213",
            registered: "21 Mar 2026",
            bookings: 4,
            status: "Active",
        },
        {
            id: 5,
            name: "Arjun Menon",
            email: "arjun.menon@gmail.com",
            phone: "9876543214",
            registered: "08 Apr 2026",
            bookings: 2,
            status: "Active",
        },
        {
            id: 6,
            name: "Kiran Rao",
            email: "kiran.rao@gmail.com",
            phone: "9876543215",
            registered: "15 Apr 2026",
            bookings: 7,
            status: "Blocked",
        },
    ]);

    function handleToggleBlock(userId) {
        setUsers((currentUsers) =>
            currentUsers.map((user) =>
                user.id === userId
                    ? {
                        ...user,
                        status:
                            user.status === "Active"
                                ? "Blocked"
                                : "Active",
                    }
                    : user
            )
        );
    }

    const filteredUsers = users.filter((user) => {
        const searchValue = search.toLowerCase();

        const matchesSearch =
            user.name.toLowerCase().includes(searchValue) ||
            user.email.toLowerCase().includes(searchValue) ||
            user.phone.includes(searchValue);

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

                            <option value="Active">
                                Active
                            </option>

                            <option value="Blocked">
                                Blocked
                            </option>
                        </select>

                    </div>

                </div>


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

                            {filteredUsers.map((user) => (

                                <tr key={user.id}>

                                    <td>
                                        <div className="admin-user-info">

                                            <div className="admin-user-avatar">
                                                {user.name
                                                    .charAt(0)
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
                                        {user.phone}
                                    </td>


                                    <td>
                                        {user.registered}
                                    </td>


                                    <td>
                                        <strong>
                                            {user.bookings}
                                        </strong>
                                    </td>


                                    <td>

                                        <span
                                            className={
                                                user.status === "Active"
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
                                                onClick={() => setSelectedUser(user)}
                                            >
                                                View
                                            </button>

                                            <button
                                                type="button"
                                                className={
                                                    user.status === "Active"
                                                        ? "admin-block-button"
                                                        : "admin-unblock-button"
                                                }
                                                onClick={() => handleToggleBlock(user.id)}
                                            >
                                                {user.status === "Active"
                                                    ? "Block"
                                                    : "Unblock"}
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>


                    {filteredUsers.length === 0 && (

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
                                    Passenger Account
                                </h2>

                                <p>
                                    View passenger account information.
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
                                        .charAt(0)
                                        .toUpperCase()}
                                </div>

                                <div>

                                    <h3>
                                        {selectedUser.name}
                                    </h3>

                                    <span
                                        className={
                                            selectedUser.status === "Active"
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
                                        <span>Full Name</span>

                                        <strong>
                                            {selectedUser.name}
                                        </strong>
                                    </div>


                                    <div>
                                        <span>Email Address</span>

                                        <strong>
                                            {selectedUser.email}
                                        </strong>
                                    </div>


                                    <div>
                                        <span>Phone Number</span>

                                        <strong>
                                            {selectedUser.phone}
                                        </strong>
                                    </div>


                                    <div>
                                        <span>Registered</span>

                                        <strong>
                                            {selectedUser.registered}
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
                                        {selectedUser.bookings}
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