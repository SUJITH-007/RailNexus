import { useEffect, useState } from "react";
import "../../styles/AdminStations.css";

function AdminStations() {
    const [stations, setStations] = useState([]);
    const [showAddStation, setShowAddStation] = useState(false);
    const [showEditStation, setShowEditStation] = useState(false);

    const [stationName, setStationName] = useState("");
    const [stationCode, setStationCode] = useState("");
    const [city, setCity] = useState("");
    const [state, setState] = useState("");

    const [editingCode, setEditingCode] = useState("");

    const [search, setSearch] = useState("");

    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [deleting, setDeleting] = useState(false);
    const [error, setError] = useState("");

    const token = localStorage.getItem("token");

    useEffect(() => {
        fetchStations();
    }, []);

    async function fetchStations() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:8080/api/stations",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load stations.");
            }

            const data = await response.json();
            setStations(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }

    function openAddStationForm() {
        setStationName("");
        setStationCode("");
        setCity("");
        setState("");
        setEditingCode("");
        setError("");
        setShowEditStation(false);
        setShowAddStation(true);
    }

    function openEditStationForm(station) {
        setStationName(station.name);
        setStationCode(station.code);
        setCity(station.city);
        setState(station.state);
        setEditingCode(station.code);
        setError("");
        setShowAddStation(false);
        setShowEditStation(true);
    }

    function closeStationForm() {
        setShowAddStation(false);
        setShowEditStation(false);
        setStationName("");
        setStationCode("");
        setCity("");
        setState("");
        setEditingCode("");
        setError("");
    }

    async function handleAddStation(event) {
        event.preventDefault();

        setError("");

        if (
            stationName.trim() === "" ||
            stationCode.trim() === "" ||
            city.trim() === "" ||
            state.trim() === ""
        ) {
            setError("Please fill in all fields.");
            return;
        }

        const stationRequest = {
            name: stationName.trim(),
            code: stationCode.trim().toUpperCase(),
            city: city.trim(),
            state: state.trim(),
        };

        try {
            setSaving(true);

            const response = await fetch(
                "http://localhost:8080/api/stations",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(stationRequest),
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    data?.error ||
                    "Failed to create station."
                );
            }

            setStations((currentStations) => [
                ...currentStations,
                data,
            ]);

            closeStationForm();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    async function handleEditStation(event) {
        event.preventDefault();

        setError("");

        if (
            stationName.trim() === "" ||
            stationCode.trim() === "" ||
            city.trim() === "" ||
            state.trim() === ""
        ) {
            setError("Please fill in all fields.");
            return;
        }

        const stationRequest = {
            name: stationName.trim(),
            code: stationCode.trim().toUpperCase(),
            city: city.trim(),
            state: state.trim(),
        };

        try {
            setSaving(true);

            const response = await fetch(
                `http://localhost:8080/api/stations/${editingCode}`,
                {
                    method: "PUT",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify(stationRequest),
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    data?.error ||
                    "Failed to update station."
                );
            }

            setStations((currentStations) =>
                currentStations.map((station) =>
                    station.id === data.id ? data : station
                )
            );

            closeStationForm();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }

    async function handleDeleteStation(station) {
        const confirmed = window.confirm(
            `Are you sure you want to delete ${station.name} (${station.code})?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setDeleting(true);
            setError("");

            const response = await fetch(
                `http://localhost:8080/api/stations/${station.code}`,
                {
                    method: "DELETE",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const data = await response.json().catch(() => null);

                throw new Error(
                    data?.message ||
                    data?.error ||
                    "Failed to delete station."
                );
            }

            setStations((currentStations) =>
                currentStations.filter(
                    (currentStation) =>
                        currentStation.id !== station.id
                )
            );
        } catch (err) {
            setError(err.message);
        } finally {
            setDeleting(false);
        }
    }

    const filteredStations = stations.filter((station) => {
        const value = search.toLowerCase();

        return (
            station.name.toLowerCase().includes(value) ||
            station.code.toLowerCase().includes(value) ||
            station.city.toLowerCase().includes(value) ||
            station.state.toLowerCase().includes(value)
        );
    });

    return (
        <div className="admin-page">

            <div className="admin-page-header">

                <div>
                    <p className="admin-page-label">
                        MANAGEMENT
                    </p>

                    <h1>Stations</h1>

                    <p>
                        Manage railway stations used by RailNexus.
                    </p>
                </div>

                <button
                    className="admin-primary-button"
                    onClick={openAddStationForm}
                >
                    + Add New Station
                </button>

            </div>

            <section className="admin-card">

                <div className="admin-table-toolbar">

                    <div>
                        <h2>Station List</h2>

                        <p>
                            {filteredStations.length} stations found
                        </p>
                    </div>

                    <input
                        type="text"
                        placeholder="Search stations..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        className="admin-search-input"
                    />

                </div>

                {error && !showAddStation && !showEditStation && (
                    <div className="admin-form-error">
                        {error}
                    </div>
                )}

                <div className="admin-table-wrapper">

                    <table className="admin-table">

                        <thead>
                            <tr>
                                <th>Station</th>
                                <th>Code</th>
                                <th>City</th>
                                <th>State</th>
                                <th>Actions</th>
                            </tr>
                        </thead>

                        <tbody>

                            {loading ? (

                                <tr>
                                    <td colSpan="5">
                                        Loading stations...
                                    </td>
                                </tr>

                            ) : filteredStations.length === 0 ? (

                                <tr>
                                    <td colSpan="5">
                                        No stations found.
                                    </td>
                                </tr>

                            ) : (

                                filteredStations.map((station) => (

                                    <tr key={station.id}>

                                        <td>
                                            <strong>
                                                {station.name}
                                            </strong>
                                        </td>

                                        <td>
                                            <span className="station-code">
                                                {station.code}
                                            </span>
                                        </td>

                                        <td>
                                            {station.city}
                                        </td>

                                        <td>
                                            {station.state}
                                        </td>

                                        <td>
                                            <div className="admin-table-actions">

                                                <button
                                                    type="button"
                                                    className="admin-edit-button"
                                                    onClick={() =>
                                                        openEditStationForm(station)
                                                    }
                                                >
                                                    Edit
                                                </button>

                                                <button
                                                    type="button"
                                                    className="admin-delete-button"
                                                    onClick={() =>
                                                        handleDeleteStation(station)
                                                    }
                                                    disabled={deleting}
                                                >
                                                    Delete
                                                </button>

                                            </div>
                                        </td>

                                    </tr>

                                ))

                            )}

                        </tbody>

                    </table>

                </div>

            </section>

            {(showAddStation || showEditStation) && (

                <div
                    className="admin-modal-overlay"
                    onClick={closeStationForm}
                >

                    <div
                        className="admin-modal"
                        onClick={(event) =>
                            event.stopPropagation()
                        }
                    >

                        <div className="admin-modal-header">

                            <div>

                                <p className="admin-page-label">
                                    STATION MANAGEMENT
                                </p>

                                <h2>
                                    {showEditStation
                                        ? "Edit Station"
                                        : "Add New Station"}
                                </h2>

                                <p>
                                    {showEditStation
                                        ? "Update the station details below."
                                        : "Enter the station details below."}
                                </p>

                            </div>

                            <button
                                type="button"
                                className="admin-modal-close"
                                onClick={closeStationForm}
                            >
                                ×
                            </button>

                        </div>

                        <form
                            className="admin-station-form"
                            onSubmit={
                                showEditStation
                                    ? handleEditStation
                                    : handleAddStation
                            }
                        >

                            {error && (
                                <div className="admin-form-error">
                                    {error}
                                </div>
                            )}

                            <div className="admin-form-group">

                                <label>
                                    Station Name
                                </label>

                                <input
                                    type="text"
                                    placeholder="Example: Mysuru Junction"
                                    value={stationName}
                                    onChange={(event) =>
                                        setStationName(event.target.value)
                                    }
                                />

                            </div>

                            <div className="admin-form-group">

                                <label>
                                    Station Code
                                </label>

                                <input
                                    type="text"
                                    placeholder="Example: MYS"
                                    maxLength="10"
                                    value={stationCode}
                                    onChange={(event) =>
                                        setStationCode(event.target.value)
                                    }
                                />

                            </div>

                            <div className="admin-form-row">

                                <div className="admin-form-group">

                                    <label>
                                        City
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Example: Mysuru"
                                        value={city}
                                        onChange={(event) =>
                                            setCity(event.target.value)
                                        }
                                    />

                                </div>

                                <div className="admin-form-group">

                                    <label>
                                        State
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Example: Karnataka"
                                        value={state}
                                        onChange={(event) =>
                                            setState(event.target.value)
                                        }
                                    />

                                </div>

                            </div>

                            <div className="admin-form-actions">

                                <button
                                    type="button"
                                    className="admin-secondary-button"
                                    onClick={closeStationForm}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="admin-primary-button"
                                    disabled={saving}
                                >
                                    {saving
                                        ? "Saving..."
                                        : showEditStation
                                            ? "Update Station"
                                            : "Add Station"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}

        </div>
    );
}

export default AdminStations;