import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../../styles/AdminTrains.css";

function AdminTrains() {

    const [search, setSearch] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();

    const [trains, setTrains] = useState([
        {
            number: "12601",
            name: "RailNexus Express",
            from: "Bangalore",
            to: "Hubli",
            departure: "06:30 AM",
            arrival: "01:45 PM",
            status: "Active",
        },
        {
            number: "12845",
            name: "Deccan Star",
            from: "Bangalore",
            to: "Hubli",
            departure: "08:15 AM",
            arrival: "03:30 PM",
            status: "Active",
        },
        {
            number: "16591",
            name: "Southern Explorer",
            from: "Mangalore",
            to: "Bangalore",
            departure: "07:00 AM",
            arrival: "02:30 PM",
            status: "Active",
        },
        {
            number: "12051",
            name: "Karnataka Express",
            from: "Bangalore",
            to: "Chennai",
            departure: "05:30 AM",
            arrival: "11:45 AM",
            status: "Inactive",
        },
    ]);

    useEffect(() => {

    if (searchParams.get("action") === "add") {

        setShowAddTrain(true);

        setSearchParams({});
    }

}, [searchParams, setSearchParams]);

    const [showAddTrain, setShowAddTrain] = useState(false);
    const [editingTrain, setEditingTrain] = useState(null);
    const [deletingTrain, setDeletingTrain] = useState(null);

    const [trainNumber, setTrainNumber] = useState("");
    const [trainName, setTrainName] = useState("");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [departure, setDeparture] = useState("");
    const [arrival, setArrival] = useState("");
    const [status, setStatus] = useState("Active");

    const [error, setError] = useState("");

    function openAddTrainForm() {
        setShowAddTrain(true);
        setError("");
    }

    function openEditTrainForm(train) {

        setEditingTrain(train);

        setTrainNumber(train.number);
        setTrainName(train.name);
        setFrom(train.from);
        setTo(train.to);

        setDeparture(train.departure);
        setArrival(train.arrival);

        setStatus(train.status);

        setError("");
        setShowAddTrain(true);
    }

    function closeAddTrainForm() {
        setShowAddTrain(false);

        setEditingTrain(null);

        setError("");
    }

    function resetForm() {
        setTrainNumber("");
        setTrainName("");
        setFrom("");
        setTo("");
        setDeparture("");
        setArrival("");
        setStatus("Active");
    }

    function handleAddTrain(event) {

        event.preventDefault();

        setError("");

        if (
            trainNumber.trim() === "" ||
            trainName.trim() === "" ||
            from.trim() === "" ||
            to.trim() === "" ||
            departure.trim() === "" ||
            arrival.trim() === ""
        ) {
            setError("Please fill in all fields.");
            return;
        }


        /*
         * EDIT EXISTING TRAIN
         */
        if (editingTrain) {

            const updatedTrain = {
                number: trainNumber.trim(),
                name: trainName.trim(),
                from: from.trim(),
                to: to.trim(),
                departure: departure.trim(),
                arrival: arrival.trim(),
                status: status,
            };

            setTrains(
                trains.map((train) =>
                    train.number === editingTrain.number
                        ? updatedTrain
                        : train
                )
            );

            resetForm();

            setEditingTrain(null);

            setShowAddTrain(false);

            return;
        }


        /*
         * ADD NEW TRAIN
         */

        const trainAlreadyExists = trains.some(
            (train) =>
                train.number === trainNumber.trim()
        );

        if (trainAlreadyExists) {
            setError(
                "A train with this number already exists."
            );

            return;
        }


        const newTrain = {
            number: trainNumber.trim(),
            name: trainName.trim(),
            from: from.trim(),
            to: to.trim(),
            departure: departure.trim(),
            arrival: arrival.trim(),
            status: status,
        };


        setTrains([
            ...trains,
            newTrain,
        ]);


        resetForm();

        setShowAddTrain(false);
    }

    function handleDeleteTrain() {

        if (!deletingTrain) {
            return;
        }

        setTrains(
            trains.filter(
                (train) =>
                    train.number !== deletingTrain.number
            )
        );

        setDeletingTrain(null);
    }

    const filteredTrains = trains.filter((train) => {

        const value = search.toLowerCase();

        return (
            train.number.toLowerCase().includes(value) ||
            train.name.toLowerCase().includes(value) ||
            train.from.toLowerCase().includes(value) ||
            train.to.toLowerCase().includes(value)
        );
    });

    return (
        <div className="admin-page">

            <div className="admin-page-header">

                <div>

                    <p className="admin-page-label">
                        MANAGEMENT
                    </p>

                    <h1>
                        Trains
                    </h1>

                    <p>
                        Manage RailNexus trains, routes, and schedules.
                    </p>

                </div>

                <button
                    className="admin-primary-button"
                    onClick={openAddTrainForm}
                >
                    + Add New Train
                </button>

            </div>


            <section className="admin-card">

                <div className="admin-table-toolbar">

                    <div>

                        <h2>
                            Train List
                        </h2>

                        <p>
                            {filteredTrains.length} trains found
                        </p>

                    </div>

                    <input
                        type="text"
                        placeholder="Search trains..."
                        value={search}
                        onChange={(event) =>
                            setSearch(event.target.value)
                        }
                        className="admin-search-input"
                    />

                </div>


                <div className="admin-table-wrapper">

                    <table className="admin-table">

                        <thead>

                            <tr>
                                <th>Train</th>
                                <th>Route</th>
                                <th>Departure</th>
                                <th>Arrival</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>

                        </thead>

                        <tbody>

                            {filteredTrains.map((train) => (

                                <tr key={train.number}>

                                    <td>

                                        <div className="admin-train-name">

                                            <strong>
                                                {train.name}
                                            </strong>

                                            <span>
                                                {train.number}
                                            </span>

                                        </div>

                                    </td>

                                    <td>

                                        {train.from}

                                        <span className="route-arrow">
                                            →
                                        </span>

                                        {train.to}

                                    </td>

                                    <td>
                                        {train.departure}
                                    </td>

                                    <td>
                                        {train.arrival}
                                    </td>

                                    <td>

                                        <span
                                            className={
                                                train.status === "Active"
                                                    ? "status-badge active"
                                                    : "status-badge inactive"
                                            }
                                        >
                                            {train.status}
                                        </span>

                                    </td>

                                    <td>

                                        <div className="admin-action-buttons">

                                            <button
                                                onClick={() =>
                                                    openEditTrainForm(train)
                                                }
                                            >
                                                Edit
                                            </button>

                                            <button
                                                className="delete-button"
                                                onClick={() =>
                                                    setDeletingTrain(train)
                                                }
                                            >
                                                Delete
                                            </button>

                                        </div>

                                    </td>

                                </tr>

                            ))}

                        </tbody>

                    </table>

                </div>

            </section>


            {showAddTrain && (

                <div
                    className="admin-modal-overlay"
                    onClick={closeAddTrainForm}
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
                                    TRAIN MANAGEMENT
                                </p>

                                <h2>
                                    {editingTrain
                                        ? "Edit Train"
                                        : "Add New Train"}
                                </h2>

                                <p>
                                    {editingTrain
                                        ? "Update the train details below."
                                        : "Enter the train details below."}
                                </p>

                            </div>

                            <button
                                type="button"
                                className="admin-modal-close"
                                onClick={closeAddTrainForm}
                            >
                                ×
                            </button>

                        </div>


                        <form
                            className="admin-train-form"
                            onSubmit={handleAddTrain}
                        >

                            <div className="admin-form-row">

                                <div className="admin-form-group">

                                    <label>
                                        Train Number
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Example: 12601"
                                        value={trainNumber}
                                        onChange={(event) =>
                                            setTrainNumber(
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>


                                <div className="admin-form-group">

                                    <label>
                                        Train Name
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Example: RailNexus Express"
                                        value={trainName}
                                        onChange={(event) =>
                                            setTrainName(
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>

                            </div>


                            <div className="admin-form-row">

                                <div className="admin-form-group">

                                    <label>
                                        From
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Example: Bangalore"
                                        value={from}
                                        onChange={(event) =>
                                            setFrom(
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>


                                <div className="admin-form-group">

                                    <label>
                                        To
                                    </label>

                                    <input
                                        type="text"
                                        placeholder="Example: Hubli"
                                        value={to}
                                        onChange={(event) =>
                                            setTo(
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>

                            </div>


                            <div className="admin-form-row">

                                <div className="admin-form-group">

                                    <label>
                                        Departure Time
                                    </label>

                                    <input
                                        type="time"
                                        value={departure}
                                        onChange={(event) =>
                                            setDeparture(
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>


                                <div className="admin-form-group">

                                    <label>
                                        Arrival Time
                                    </label>

                                    <input
                                        type="time"
                                        value={arrival}
                                        onChange={(event) =>
                                            setArrival(
                                                event.target.value
                                            )
                                        }
                                    />

                                </div>

                            </div>


                            <div className="admin-form-group">

                                <label>
                                    Status
                                </label>

                                <select
                                    value={status}
                                    onChange={(event) =>
                                        setStatus(
                                            event.target.value
                                        )
                                    }
                                >

                                    <option value="Active">
                                        Active
                                    </option>

                                    <option value="Inactive">
                                        Inactive
                                    </option>

                                </select>

                            </div>


                            {error && (

                                <div className="admin-form-error">
                                    {error}
                                </div>

                            )}


                            <div className="admin-modal-actions">

                                <button
                                    type="button"
                                    className="admin-cancel-button"
                                    onClick={closeAddTrainForm}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="admin-save-button"
                                >
                                    {editingTrain
                                        ? "Save Changes"
                                        : "Add Train"}
                                </button>

                            </div>

                        </form>

                    </div>

                </div>

            )}
            {deletingTrain && (

    <div
        className="admin-modal-overlay"
        onClick={() => setDeletingTrain(null)}
    >

        <div
            className="admin-delete-modal"
            onClick={(event) =>
                event.stopPropagation()
            }
        >

            <div className="admin-delete-icon">
                !
            </div>

            <h2>
                Delete Train?
            </h2>

            <p>
                Are you sure you want to delete
                <strong>
                    {" "}{deletingTrain.name}
                </strong>
                {" "}({deletingTrain.number})?
            </p>

            <p className="admin-delete-warning">
                This action cannot be undone.
            </p>

            <div className="admin-modal-actions">

                <button
                    type="button"
                    className="admin-cancel-button"
                    onClick={() =>
                        setDeletingTrain(null)
                    }
                >
                    Cancel
                </button>

                <button
                    type="button"
                    className="admin-confirm-delete-button"
                    onClick={handleDeleteTrain}
                >
                    Delete Train
                </button>

            </div>

        </div>

    </div>

)}

        </div>
    );
}

export default AdminTrains;