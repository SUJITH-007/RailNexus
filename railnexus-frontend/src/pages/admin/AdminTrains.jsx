import { useEffect, useState } from "react";
import { useSearchParams } from "react-router-dom";
import "../../styles/AdminTrains.css";

function AdminTrains() {
    const [search, setSearch] = useState("");
    const [searchParams, setSearchParams] = useSearchParams();

    const [trains, setTrains] = useState([]);

    const [showAddTrain, setShowAddTrain] = useState(false);
    const [editingTrain, setEditingTrain] = useState(null);
    const [deletingTrain, setDeletingTrain] = useState(null);

    const [trainNumber, setTrainNumber] = useState("");
    const [trainName, setTrainName] = useState("");
    const [trainType, setTrainType] = useState("EXPRESS");
    const [from, setFrom] = useState("");
    const [to, setTo] = useState("");
    const [status, setStatus] = useState("ACTIVE");
    const [trainClassIds, setTrainClassIds] = useState([1, 2, 3, 4, 5, 6, 7]);
    const [trainJourneyDate, setTrainJourneyDate] = useState("");

    const [error, setError] = useState("");
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);

    const [showRouteModal, setShowRouteModal] = useState(false);
    const [selectedTrain, setSelectedTrain] = useState(null);
    const [stations, setStations] = useState([]);
    const [routes, setRoutes] = useState([]);
    const [routeLoading, setRouteLoading] = useState(false);
    const [routeSaving, setRouteSaving] = useState(false);
    const [editingRoute, setEditingRoute] = useState(null);
    const [showCoachModal, setShowCoachModal] = useState(false);
    const [coaches, setCoaches] = useState([]);
    const [coachLoading, setCoachLoading] = useState(false);
    const [coachSaving, setCoachSaving] = useState(false);
    const [editingCoach, setEditingCoach] = useState(null);
    const [coachEditNumber, setCoachEditNumber] = useState("");
    const [coachEditSaving, setCoachEditSaving] = useState(false);
    const [showSeatModal, setShowSeatModal] = useState(false);
    const [selectedCoach, setSelectedCoach] = useState(null);
    const [seats, setSeats] = useState([]);
    const [seatLoading, setSeatLoading] = useState(false);
    const [selectedSeat, setSelectedSeat] = useState(null);
    const [blockReason, setBlockReason] = useState("Maintenance");
    const [blockSaving, setBlockSaving] = useState(false);

    const [coachClassId, setCoachClassId] = useState("");
    const [coachConfigurationId, setCoachConfigurationId] = useState("");
    const [coachConfigurations, setCoachConfigurations] = useState([]);
    const [coachNumber, setCoachNumber] = useState("");

    const [routeStationId, setRouteStationId] = useState("");
    const [routeStopOrder, setRouteStopOrder] = useState("");
    const [routeJourneyDate, setRouteJourneyDate] = useState("");
    const [routeArrivalTime, setRouteArrivalTime] = useState("");
    const [routeDepartureTime, setRouteDepartureTime] = useState("");
    const [routeDistance, setRouteDistance] = useState("");
    const [coachClassOpen, setCoachClassOpen] = useState(false);
    const token = localStorage.getItem("token");

    const [seatRoutes, setSeatRoutes] = useState([]);
    const [seatJourneyDate, setSeatJourneyDate] = useState("");
    const [seatFrom, setSeatFrom] = useState("");
    const [seatTo, setSeatTo] = useState("");


    useEffect(() => {
        fetchTrains();
    }, []);

    useEffect(() => {
        if (searchParams.get("action") === "add") {
            openAddTrainForm();
            setSearchParams({});
        }
    }, [searchParams, setSearchParams]);

    async function fetchTrains() {
        try {
            setLoading(true);
            setError("");

            const response = await fetch(
                "http://localhost:8080/api/trains",
                {
                    method: "GET",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load trains.");
            }

            const data = await response.json();
            setTrains(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }


    function openAddTrainForm() {
        resetForm();
        setEditingTrain(null);
        setError("");
        setShowAddTrain(true);
    }


    async function openEditTrainForm(train) {
    setEditingTrain(train);

    setTrainNumber(train.number);
    setTrainName(train.name);
    setTrainType(train.type);
    setFrom(train.source);
    setTo(train.destination);
    setStatus(train.status);
    setTrainClassIds(train.classIds || []);
    setTrainJourneyDate("");

    setError("");
    await fetchStations();
    setShowAddTrain(true);

    try {
            const response = await fetch(
                `http://localhost:8080/api/admin/train-routes/train/${train.id}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load train journey date.");
            }

            const routeData = await response.json();

            if (routeData.length > 0) {
                setTrainJourneyDate(routeData[0].journeyDate);
            }
        } catch (err) {
            setError(err.message);
        }
    }



    function closeAddTrainForm() {
        setShowAddTrain(false);
        setEditingTrain(null);
        setError("");
        resetForm();
    }

    function resetForm() {
        setTrainNumber("");
        setTrainName("");
        setTrainType("EXPRESS");
        setFrom("");
        setTo("");
        setStatus("ACTIVE");
        setTrainClassIds([1, 2, 3, 4, 5, 6, 7]);
        setTrainJourneyDate("");
    }
    async function fetchStations() {
        try {
            const response = await fetch(
                "http://localhost:8080/api/stations",
                {
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
        }
    }

    async function fetchRoutes(trainId) {
        try {
            setRouteLoading(true);
            setError("");

            const response = await fetch(
                `http://localhost:8080/api/admin/train-routes/train/${trainId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load train route.");
            }

            const data = await response.json();
            setRoutes(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setRouteLoading(false);
        }
    }

    async function openRouteModal(train) {
        setSelectedTrain(train);
        setEditingRoute(null);
        setError("");
        setShowRouteModal(true);

        await Promise.all([
            fetchStations(),
            fetchRoutes(train.id),
        ]);
    }

    function resetRouteForm() {
        setEditingRoute(null);
        setRouteStationId("");
        setRouteStopOrder("");
        setRouteJourneyDate("");
        setRouteArrivalTime("");
        setRouteDepartureTime("");
        setRouteDistance("");
    }

    async function selectCoachClass(classId) {
        const value = String(classId);

        setCoachClassId(value);
        setCoachClassOpen(false);
        setCoachConfigurationId("");
        setCoachConfigurations([]);

        if (!value) {
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:8080/api/admin/coach-configurations/class/${value}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load coach configurations.");
            }

            const data = await response.json();
            setCoachConfigurations(data);
        } catch (err) {
            setError(err.message);
        }
    }

    function closeRouteModal() {
        setShowRouteModal(false);
        setSelectedTrain(null);
        setRoutes([]);
        resetRouteForm();
        setError("");
    }

    function openEditCoach(coach) {
        setEditingCoach(coach);
        setCoachEditNumber(coach.coachNumber);
        setError("");
    }

    function closeEditCoach() {
        setEditingCoach(null);
        setCoachEditNumber("");
        setError("");
    }

    function resetCoachForm() {
        setCoachClassId("");
        setCoachConfigurationId("");
        setCoachConfigurations([]);
        setCoachNumber("");
    }

    function closeCoachModal() {
        setShowCoachModal(false);
        setSelectedTrain(null);
        setCoaches([]);
        resetCoachForm();
        setError("");
    }

    async function fetchCoaches(trainId) {
        try {
            setCoachLoading(true);
            setError("");

            const response = await fetch(
                `http://localhost:8080/api/admin/coaches/train/${trainId}`,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                throw new Error("Failed to load coaches.");
            }

            const data = await response.json();
            setCoaches(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setCoachLoading(false);
        }
    }

    async function openCoachModal(train) {
        setSelectedTrain(train);
        resetCoachForm();
        setError("");
        setShowCoachModal(true);

        await fetchCoaches(train.id);
    }

    function getLocalDateString() {
        const today = new Date();

        const year = today.getFullYear();
        const month = String(today.getMonth() + 1).padStart(2, "0");
        const day = String(today.getDate()).padStart(2, "0");

        return `${year}-${month}-${day}`;
    }

    async function fetchSeatRoutes(trainId) {
        const response = await fetch(
            `http://localhost:8080/api/admin/train-routes/train/${trainId}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            throw new Error("Failed to load train routes.");
        }

        return await response.json();
    }

    async function fetchSeatStatus(
        coachId,
        journeyDate,
        from,
        to
    ) {
        const response = await fetch(
            `http://localhost:8080/api/admin/seats/coach/${coachId}/status?journeyDate=${encodeURIComponent(journeyDate)}&from=${encodeURIComponent(from)}&to=${encodeURIComponent(to)}`,
            {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            }
        );

        if (!response.ok) {
            const message = await response.text();
            throw new Error(message || "Failed to load seat status.");
        }

        return await response.json();
    }

    async function openSeatModal(coach) {
        setSelectedCoach(coach);
        setShowSeatModal(true);
        setSeats([]);
        setSeatRoutes([]);
        setSeatLoading(true);
        setError("");

        const journeyDate = getLocalDateString();

        setSeatJourneyDate(journeyDate);
        setSeatFrom("");
        setSeatTo("");

        try {
            const routeData = await fetchSeatRoutes(coach.trainId);

            if (routeData.length < 2) {
                throw new Error(
                    "Train must have at least two route stops."
                );
            }

            const defaultFrom = routeData[0].stationCode;
            const defaultTo =
                routeData[routeData.length - 1].stationCode;

            setSeatRoutes(routeData);
            setSeatFrom(defaultFrom);
            setSeatTo(defaultTo);

            const seatData = await fetchSeatStatus(
                coach.id,
                journeyDate,
                defaultFrom,
                defaultTo
            );

            setSeats(seatData);
        } catch (err) {
            setError(err.message);
        } finally {
            setSeatLoading(false);
        }
    }

    async function handleSeatStatusSearch() {
        if (!selectedCoach) {
            return;
        }

        if (!seatJourneyDate || !seatFrom || !seatTo) {
            setError("Journey date, from station and to station are required.");
            return;
        }

        setSeatLoading(true);
        setError("");
        setSeats([]);

        try {
            const seatData = await fetchSeatStatus(
                selectedCoach.id,
                seatJourneyDate,
                seatFrom,
                seatTo
            );

            setSeats(seatData);
        } catch (err) {
            setError(err.message);
        } finally {
            setSeatLoading(false);
        }
    }

    function openSeatAction(seat) {
        setSelectedSeat(seat);
        setBlockReason("Maintenance");
        setError("");
    }

    function closeSeatAction() {
        setSelectedSeat(null);
        setBlockReason("Maintenance");
        setError("");
    }

    async function handleBlockSeat() {
        if (!selectedSeat) {
            return;
        }

        if (!seatJourneyDate) {
            setError("Journey date is required.");
            return;
        }

        try {
            setBlockSaving(true);
            setError("");

            const response = await fetch(
                "http://localhost:8080/api/admin/seat-blocks",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        seatId: selectedSeat.id,
                        journeyDate: seatJourneyDate,
                        reason: blockReason,
                    }),
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    data?.error ||
                    "Failed to block seat."
                );
            }

            const seatData = await fetchSeatStatus(
                selectedCoach.id,
                seatJourneyDate,
                seatFrom,
                seatTo
            );

            setSeats(seatData);
            closeSeatAction();
        } catch (err) {
            setError(err.message);
        } finally {
            setBlockSaving(false);
        }
    }

    function getSeatStatusClass(status) {
        if (!status) {
            return "";
        }

        return `admin-seat-status-${status.toLowerCase()}`;
    }

    async function handleUnblockSeat() {
        if (!selectedSeat || !selectedSeat.blockId) {
            return;
        }

        try {
            setBlockSaving(true);
            setError("");

            const response = await fetch(
                `http://localhost:8080/api/admin/seat-blocks/${selectedSeat.blockId}`,
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
                    "Failed to unblock seat."
                );
            }

            const seatData = await fetchSeatStatus(
                selectedCoach.id,
                seatJourneyDate,
                seatFrom,
                seatTo
            );

            setSeats(seatData);
            closeSeatAction();
        } catch (err) {
            setError(err.message);
        } finally {
            setBlockSaving(false);
        }
    }

    async function handleGenerateSeats() {
        try {
            setSeatLoading(true);
            setError("");

            const response = await fetch(
                `http://localhost:8080/api/admin/seats/generate/coach/${selectedCoach.id}`,
                {
                    method: "POST",
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );

            if (!response.ok) {
                const message = await response.text();
                throw new Error(message || "Failed to generate seats.");
            }

            const data = await response.json();
            setSeats(data);
        } catch (err) {
            setError(err.message);
        } finally {
            setSeatLoading(false);
        }
    }

    async function handleAddCoach(event) {
        event.preventDefault();

        if (!coachClassId || !coachConfigurationId || !coachNumber.trim()) {
            setError("Please fill in all coach fields.");
            return;
        }

        try {
            setCoachSaving(true);
            setError("");

            const response = await fetch(
                "http://localhost:8080/api/admin/coaches",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        trainId: selectedTrain.id,
                        classId: Number(coachClassId),
                        configurationId: Number(coachConfigurationId),
                        coachNumber: coachNumber.trim(),
                    }),
                }
            );

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    data?.error ||
                    "Failed to add coach."
                );
            }

            setCoaches((currentCoaches) => [
                ...currentCoaches,
                data,
            ]);

            resetCoachForm();
        } catch (err) {
            setError(err.message);
        } finally {
            setCoachSaving(false);
        }
    }

    async function handleDeleteCoach(coach) {
        const confirmed = window.confirm(
            `Are you sure you want to delete coach ${coach.coachNumber}?`
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            const response = await fetch(
                `http://localhost:8080/api/admin/coaches/${coach.id}`,
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
                    "Failed to delete coach."
                );
            }

            setCoaches((currentCoaches) =>
                currentCoaches.filter(
                    (currentCoach) => currentCoach.id !== coach.id
                )
            );
        } catch (err) {
            setError(err.message);
        }
    }

    function openEditRoute(route) {
        setEditingRoute(route);
        setRouteStationId(String(route.stationId));
        setRouteStopOrder(String(route.stopOrder));
        setRouteJourneyDate(route.journeyDate);
        setRouteArrivalTime(route.arrivalTime || "");
        setRouteDepartureTime(route.departureTime || "");
        setRouteDistance(String(route.distance));
        setError("");
    }

    async function handleSaveRoute(event) {
        event.preventDefault();

        if (
            !routeStationId ||
            !routeStopOrder ||
            !routeJourneyDate ||
            !routeDistance
        ) {
            setError("Please fill in all required route fields.");
            return;
        }

        const routeRequest = {
            trainId: selectedTrain.id,
            stationId: Number(routeStationId),
            stopOrder: Number(routeStopOrder),
            journeyDate: routeJourneyDate,
            arrivalTime: routeArrivalTime || null,
            departureTime: routeDepartureTime || null,
            distance: Number(routeDistance),
        };

        try {
            setRouteSaving(true);
            setError("");

            const url = editingRoute
                ? `http://localhost:8080/api/admin/train-routes/${editingRoute.id}`
                : "http://localhost:8080/api/admin/train-routes";

            const method = editingRoute ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(routeRequest),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    data?.error ||
                    "Failed to save route."
                );
            }

            if (editingRoute) {
                setRoutes((currentRoutes) =>
                    currentRoutes.map((route) =>
                        route.id === data.id ? data : route
                    )
                );
            } else {
                setRoutes((currentRoutes) =>
                    [...currentRoutes, data].sort(
                        (a, b) => a.stopOrder - b.stopOrder
                    )
                );
            }

            resetRouteForm();
        } catch (err) {
            setError(err.message);
        } finally {
            setRouteSaving(false);
        }
    }

    async function handleDeleteRoute(routeId) {
        const confirmed = window.confirm(
            "Are you sure you want to delete this route stop?"
        );

        if (!confirmed) {
            return;
        }

        try {
            setError("");

            const response = await fetch(
                `http://localhost:8080/api/admin/train-routes/${routeId}`,
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
                    "Failed to delete route."
                );
            }

            setRoutes((currentRoutes) =>
                currentRoutes.filter(
                    (route) => route.id !== routeId
                )
            );
        } catch (err) {
            setError(err.message);
        }
    }


    async function handleAddTrain(event) {
        event.preventDefault();

        setError("");

        if (
            trainNumber.trim() === "" ||
            trainName.trim() === "" ||
            from.trim() === "" ||
            to.trim() === ""
        ) {
            setError("Please fill in all fields.");
            return;
        }

        const trainRequest = {
            number: trainNumber.trim(),
            name: trainName.trim(),
            type: trainType,
            source: from.trim(),
            destination: to.trim(),
            status: status,
            classIds: trainClassIds,
        };

        try {
            setSaving(true);

            const url = editingTrain
                ? `http://localhost:8080/api/trains/${editingTrain.number}`
                : "http://localhost:8080/api/trains";

            const method = editingTrain ? "PUT" : "POST";

            const response = await fetch(url, {
                method,
                headers: {
                    "Content-Type": "application/json",
                    Authorization: `Bearer ${token}`,
                },
                body: JSON.stringify(trainRequest),
            });

            const data = await response.json().catch(() => null);

            if (!response.ok) {
                throw new Error(
                    data?.message ||
                    data?.error ||
                    "Failed to save train."
                );
            }

            if (editingTrain) {
                const dateResponse = await fetch(
                    `http://localhost:8080/api/admin/train-routes/train/${editingTrain.id}/journey-date?journeyDate=${encodeURIComponent(trainJourneyDate)}`,
                    {
                        method: "PUT",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                if (!dateResponse.ok) {
                    const message = await dateResponse.text();

                    throw new Error(
                        message || "Failed to update journey date."
                    );
                }

                setTrains((currentTrains) =>
                    currentTrains.map((train) =>
                        train.id === data.id ? data : train
                    )
                );
            } else {
                setTrains((currentTrains) => [
                    ...currentTrains,
                    data,
                ]);
            }

            closeAddTrainForm();
        } catch (err) {
            setError(err.message);
        } finally {
            setSaving(false);
        }
    }


    async function handleDeleteTrain() {
        if (!deletingTrain) {
            return;
        }

        try {
            setError("");

            const response = await fetch(
                `http://localhost:8080/api/trains/${deletingTrain.number}`,
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
                    "Failed to delete train."
                );
            }

            setTrains((currentTrains) =>
                currentTrains.filter(
                    (train) =>
                        train.number !== deletingTrain.number
                )
            );

            setDeletingTrain(null);
        } catch (err) {
            setError(err.message);
        }
    }


    const filteredTrains = trains.filter((train) => {
        const value = search.toLowerCase();

        return (
            train.number.toLowerCase().includes(value) ||
            train.name.toLowerCase().includes(value) ||
            train.source.toLowerCase().includes(value) ||
            train.destination.toLowerCase().includes(value)
        );
    });

    const selectedCoachConfiguration = coachConfigurations.find(
        (configuration) =>
            String(configuration.id) === coachConfigurationId
    );


    return (
        <div className="admin-page">

            <div className="admin-page-header">

                <div>
                    <p className="admin-page-label">
                        MANAGEMENT
                    </p>

                    <h1>Trains</h1>

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
                        <h2>Train List</h2>

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

                {error && !showAddTrain && (
                    <div className="admin-form-error">
                        {error}
                    </div>
                )}

                <div className="admin-table-wrapper">

                    <table className="admin-table">

                        <thead>
                            <tr>
                                <th>Train</th>
                                <th>Route</th>
                                <th>Type</th>
                                <th>Status</th>
                                <th>Action</th>
                            </tr>
                        </thead>

                        <tbody>

                            {loading ? (

                                <tr>
                                    <td colSpan="5">
                                        Loading trains...
                                    </td>
                                </tr>

                            ) : filteredTrains.length === 0 ? (

                                <tr>
                                    <td colSpan="5">
                                        No trains found.
                                    </td>
                                </tr>

                            ) : (

                                filteredTrains.map((train) => (

                                    <tr key={train.id}>

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

                                            {train.source}

                                            <span className="route-arrow">
                                                →
                                            </span>

                                            {train.destination}

                                        </td>

                                        <td>
                                            {train.type}
                                        </td>

                                        <td>

                                            <span
                                                className={
                                                    train.status === "ACTIVE"
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
                                                    onClick={() => openRouteModal(train)}
                                                >
                                                    Route & Schedule
                                                </button>

                                                <button
                                                    onClick={() =>
                                                        openCoachModal(train)
                                                    }
                                                >
                                                    Coaches
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

                                ))
                            )}

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
                            placeholder="Example: 12627"
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
                            placeholder="Example: Karnataka Express"
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

                        <select
                            value={from}
                            onChange={(event) =>
                                setFrom(event.target.value)
                            }
                        >
                            <option value="">
                                Select departure station
                            </option>

                            {stations.map((station) => (
                                <option
                                    key={station.id}
                                    value={station.code}
                                >
                                    {station.name} ({station.code})
                                </option>
                            ))}
                        </select>

                    </div>

                    <div className="admin-form-group">

                        <label>
                            To
                        </label>

                        <select
                            value={to}
                            onChange={(event) =>
                                setTo(event.target.value)
                            }
                        >
                            <option value="">
                                Select destination station
                            </option>

                            {stations.map((station) => (
                                <option
                                    key={station.id}
                                    value={station.code}
                                >
                                    {station.name} ({station.code})
                                </option>
                            ))}
                        </select>

                    </div>

                </div>

                <div className="admin-form-row">

                    <div className="admin-form-group">

                        <label>
                            Journey Date
                        </label>

                        <input
                            type="date"
                            value={trainJourneyDate}
                            min={getLocalDateString()}
                            onChange={(event) =>
                                setTrainJourneyDate(
                                    event.target.value
                                )
                            }
                            disabled={!editingTrain}
                        />

                    </div>

                </div>

                <div className="admin-form-row">

                    <div className="admin-form-group">

                        <label>
                            Train Type
                        </label>

                        <select
                            value={trainType}
                            onChange={(event) =>
                                setTrainType(
                                    event.target.value
                                )
                            }
                        >

                            <option value="EXPRESS">
                                Express
                            </option>

                            <option value="SUPERFAST">
                                Superfast
                            </option>

                            <option value="PASSENGER">
                                Passenger
                            </option>

                        </select>

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

                            <option value="ACTIVE">
                                Active
                            </option>

                            <option value="INACTIVE">
                                Inactive
                            </option>

                        </select>

                    </div>

                </div>

                <div className="admin-form-group">

                    <label>
                        Supported Classes
                    </label>

                    <div className="admin-train-class-options">

                        {[
                            {
                                id: 1,
                                label: "1A — First AC"
                            },
                            {
                                id: 2,
                                label: "2A — AC 2 Tier"
                            },
                            {
                                id: 3,
                                label: "3A — AC 3 Tier"
                            },
                            {
                                id: 4,
                                label: "SL — Sleeper"
                            },
                            {
                                id: 5,
                                label: "CC — AC Chair Car"
                            },
                            {
                                id: 6,
                                label: "EC — Executive Chair Car"
                            },
                            {
                                id: 7,
                                label: "2S — Second Sitting"
                            },
                        ].map((trainClass) => (

                            <label
                                className="admin-train-class-option"
                                key={trainClass.id}
                            >

                                <input
                                    type="checkbox"
                                    checked={trainClassIds.includes(
                                        trainClass.id
                                    )}
                                    onChange={() => {
                                        setTrainClassIds(
                                            (currentIds) =>
                                                currentIds.includes(
                                                    trainClass.id
                                                )
                                                    ? currentIds.filter(
                                                        (id) =>
                                                            id !==
                                                            trainClass.id
                                                    )
                                                    : [
                                                        ...currentIds,
                                                        trainClass.id,
                                                    ]
                                        );
                                    }}
                                />

                                <span>
                                    {trainClass.label}
                                </span>

                            </label>

                        ))}

                    </div>

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
                        disabled={saving}
                    >
                        {saving
                            ? "Saving..."
                            : editingTrain
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

            {showRouteModal && selectedTrain && (
                <div className="admin-modal-overlay">
                    <div className="admin-route-modal">
                        <div className="admin-route-modal-header">
                            <div>
                                <p>ROUTE MANAGEMENT</p>
                                <h2>Route & Schedule</h2>
                                <span>
                                    {selectedTrain.number} — {selectedTrain.name}
                                </span>
                            </div>

                            <button
                                type="button"
                                className="admin-modal-close"
                                onClick={closeRouteModal}
                            >
                                ×
                            </button>
                        </div>

                        <div className="admin-route-modal-content">
                            <div className="admin-route-form-section">
                                <div className="admin-route-section-heading">
                                    <p>
                                        {editingRoute
                                            ? "EDIT ROUTE STOP"
                                            : "ADD ROUTE STOP"}
                                    </p>

                                    <h3>
                                        {editingRoute
                                            ? "Update Station"
                                            : "Add Station"}
                                    </h3>
                                </div>

                                <form onSubmit={handleSaveRoute}>
                                    <div className="admin-route-form-grid">
                                        <div className="admin-form-group">
                                            <label>Station</label>

                                            <select
                                                value={routeStationId}
                                                onChange={(event) =>
                                                    setRouteStationId(
                                                        event.target.value
                                                    )
                                                }
                                                required
                                            >
                                                <option value="">
                                                    Select station
                                                </option>

                                                {stations.map((station) => (
                                                    <option
                                                        key={station.id}
                                                        value={station.id}
                                                    >
                                                        {station.name} (
                                                        {station.code})
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="admin-form-group">
                                            <label>Stop Order</label>

                                            <input
                                                type="number"
                                                min="1"
                                                value={routeStopOrder}
                                                onChange={(event) =>
                                                    setRouteStopOrder(
                                                        event.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="admin-form-group">
                                            <label>Journey Date</label>

                                            <input
                                                type="date"
                                                value={routeJourneyDate}
                                                onChange={(event) =>
                                                    setRouteJourneyDate(
                                                        event.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="admin-form-group">
                                            <label>Distance From Origin (km)</label>

                                            <input
                                                type="number"
                                                min="0"
                                                step="0.1"
                                                value={routeDistance}
                                                onChange={(event) =>
                                                    setRouteDistance(
                                                        event.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="admin-form-group">
                                            <label>Arrival Time</label>

                                            <input
                                                type="time"
                                                value={routeArrivalTime}
                                                onChange={(event) =>
                                                    setRouteArrivalTime(
                                                        event.target.value
                                                    )
                                                }
                                            />
                                        </div>

                                        <div className="admin-form-group">
                                            <label>Departure Time</label>

                                            <input
                                                type="time"
                                                value={routeDepartureTime}
                                                onChange={(event) =>
                                                    setRouteDepartureTime(
                                                        event.target.value
                                                    )
                                                }
                                            />
                                        </div>
                                    </div>

                                    <div className="admin-route-form-actions">
                                        {editingRoute && (
                                            <button
                                                type="button"
                                                className="admin-route-cancel-button"
                                                onClick={resetRouteForm}
                                            >
                                                Cancel Edit
                                            </button>
                                        )}

                                        <button
                                            type="submit"
                                            className="admin-route-save-button"
                                            disabled={routeSaving}
                                        >
                                            {routeSaving
                                                ? "Saving..."
                                                : editingRoute
                                                    ? "Update Stop"
                                                    : "Add Stop"}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div className="admin-route-list-section">
                                <div className="admin-route-section-heading">
                                    <p>TRAIN ROUTE</p>
                                    <h3>Journey Stops</h3>
                                </div>

                                {routeLoading ? (
                                    <div className="admin-route-loading">
                                        Loading route...
                                    </div>
                                ) : routes.length === 0 ? (
                                    <div className="admin-route-empty">
                                        No route stops have been added yet.
                                    </div>
                                ) : (
                                    <div className="admin-route-list">
                                        {routes.map((route, index) => (
                                            <div
                                                className="admin-route-stop"
                                                key={route.id}
                                            >
                                                <div className="admin-route-stop-number">
                                                    {index + 1}
                                                </div>

                                                <div className="admin-route-stop-info">
                                                    <strong>
                                                        {route.stationName}
                                                    </strong>

                                                    <span>
                                                        {route.stationCode}
                                                    </span>
                                                </div>

                                                <div className="admin-route-stop-time">
                                                    <small>ARRIVAL</small>
                                                    <strong>
                                                        {route.arrivalTime
                                                            ? route.arrivalTime.substring(
                                                                0,
                                                                5
                                                            )
                                                            : "—"}
                                                    </strong>
                                                </div>

                                                <div className="admin-route-stop-time">
                                                    <small>DEPARTURE</small>
                                                    <strong>
                                                        {route.departureTime
                                                            ? route.departureTime.substring(
                                                                0,
                                                                5
                                                            )
                                                            : "—"}
                                                    </strong>
                                                </div>

                                                <div className="admin-route-stop-distance">
                                                    <small>DISTANCE</small>
                                                    <strong>
                                                        {route.distance} km
                                                    </strong>
                                                </div>

                                                <div className="admin-route-stop-actions">
                                                    <button
                                                        type="button"
                                                        onClick={() =>
                                                            openEditRoute(route)
                                                        }
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="delete-button"
                                                        onClick={() =>
                                                            handleDeleteRoute(
                                                                route.id
                                                            )
                                                        }
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {showCoachModal && selectedTrain && (
                <div className="admin-modal-overlay">
                    <div className="admin-coach-modal">
                        <div className="admin-coach-modal-header">
                            <div>
                                <p>COACH MANAGEMENT</p>
                                <h2>Coach Management</h2>
                                <span>
                                    {selectedTrain.number} — {selectedTrain.name}
                                </span>
                            </div>

                            <button
                                type="button"
                                className="admin-modal-close"
                                onClick={closeCoachModal}
                            >
                                ×
                            </button>
                        </div>

                        <div className="admin-coach-modal-content">
                            <div className="admin-coach-form-section">
                                <div className="admin-route-section-heading">
                                    <p>ADD COACH</p>
                                    <h3>New Coach</h3>
                                </div>

                                <form onSubmit={handleAddCoach}>
                                    <div className="admin-coach-form-grid">
                                        <div className="admin-form-group">
                                            <label>Class</label>

                                            <div className="admin-custom-select">
                                                <button
                                                    type="button"
                                                    className={`admin-custom-select-button ${coachClassOpen ? "open" : ""
                                                        }`}
                                                    onClick={() =>
                                                        setCoachClassOpen((current) => !current)
                                                    }
                                                >
                                                    <span>
                                                        {coachClassId === "1"
                                                            ? "1A — First AC"
                                                            : coachClassId === "2"
                                                                ? "2A — AC 2 Tier"
                                                                : coachClassId === "3"
                                                                    ? "3A — AC 3 Tier"
                                                                    : coachClassId === "4"
                                                                        ? "SL — Sleeper"
                                                                        : coachClassId === "5"
                                                                            ? "CC — AC Chair Car"
                                                                            : coachClassId === "6"
                                                                                ? "EC — Executive Chair Car"
                                                                                : coachClassId === "7"
                                                                                    ? "2S — Second Sitting"
                                                                                    : "Select class"}
                                                    </span>

                                                    <span className="admin-custom-select-arrow">
                                                        ▾
                                                    </span>
                                                </button>

                                                {coachClassOpen && (
                                                    <div className="admin-custom-select-options">
                                                        <button
                                                            type="button"
                                                            className="admin-custom-select-option"
                                                            onClick={() => selectCoachClass("")}
                                                        >
                                                            Select class
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="admin-custom-select-option"
                                                            onClick={() => selectCoachClass(1)}
                                                        >
                                                            1A — First AC
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="admin-custom-select-option"
                                                            onClick={() => selectCoachClass(2)}
                                                        >
                                                            2A — AC 2 Tier
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="admin-custom-select-option"
                                                            onClick={() => selectCoachClass(3)}
                                                        >
                                                            3A — AC 3 Tier
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="admin-custom-select-option"
                                                            onClick={() => selectCoachClass(4)}
                                                        >
                                                            SL — Sleeper
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="admin-custom-select-option"
                                                            onClick={() => selectCoachClass(5)}
                                                        >
                                                            CC — AC Chair Car
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="admin-custom-select-option"
                                                            onClick={() => selectCoachClass(6)}
                                                        >
                                                            EC — Executive Chair Car
                                                        </button>

                                                        <button
                                                            type="button"
                                                            className="admin-custom-select-option"
                                                            onClick={() => selectCoachClass(7)}
                                                        >
                                                            2S — Second Sitting
                                                        </button>
                                                    </div>
                                                )}
                                            </div>
                                        </div>

                                        <div className="admin-form-group">
                                            <label>Coach Number</label>

                                            <input
                                                type="text"
                                                placeholder="Example: A1"
                                                value={coachNumber}
                                                onChange={(event) =>
                                                    setCoachNumber(
                                                        event.target.value
                                                    )
                                                }
                                                required
                                            />
                                        </div>

                                        <div className="admin-form-group">
                                            <label>Configuration</label>
                                            <select
                                                value={coachConfigurationId}
                                                onChange={(event) => setCoachConfigurationId(event.target.value)}
                                                disabled={!coachClassId}
                                                required
                                            >
                                                <option value="">
                                                    {coachClassId ? "Select configuration" : "Select class first"}
                                                </option>
                                                {coachConfigurations.map((configuration) => (
                                                    <option key={configuration.id} value={configuration.id}>
                                                        {configuration.configurationCode} — {configuration.name}
                                                    </option>
                                                ))}
                                            </select>
                                        </div>

                                        <div className="admin-form-group">
                                            <label>Physical Capacity</label>
                                            <input
                                                type="text"
                                                value={
                                                    selectedCoachConfiguration
                                                        ? `${selectedCoachConfiguration.physicalCapacity} seats`
                                                        : ""
                                                }
                                                placeholder="Select configuration"
                                                readOnly
                                            />
                                        </div>
                                    </div>

                                    {error && (
                                        <div className="admin-form-error">
                                            {error}
                                        </div>
                                    )}

                                    <div className="admin-route-form-actions">
                                        <button
                                            type="submit"
                                            className="admin-route-save-button"
                                            disabled={coachSaving}
                                        >
                                            {coachSaving
                                                ? "Adding..."
                                                : "Add Coach"}
                                        </button>
                                    </div>
                                </form>
                            </div>

                            <div className="admin-route-list-section">
                                <div className="admin-route-section-heading">
                                    <p>TRAIN COACHES</p>
                                    <h3>Coach List</h3>
                                </div>

                                {coachLoading ? (
                                    <div className="admin-route-loading">
                                        Loading coaches...
                                    </div>
                                ) : coaches.length === 0 ? (
                                    <div className="admin-route-empty">
                                        No coaches have been added yet.
                                    </div>
                                ) : (
                                    <div className="admin-coach-list">
                                        {coaches.map((coach) => (
                                            <div
                                                className="admin-coach-card"
                                                key={coach.id}
                                            >
                                                <div className="admin-coach-number">
                                                    <strong>
                                                        {coach.coachNumber}
                                                    </strong>

                                                    <span>
                                                        Coach
                                                    </span>
                                                </div>

                                                <div className="admin-coach-info">
                                                    <strong>
                                                        {coach.classCode}
                                                    </strong>

                                                    <span>
                                                        {coach.className}
                                                    </span>

                                                    <span>
                                                        {coach.configurationCode} — {coach.configurationName}
                                                    </span>
                                                </div>

                                                <div className="admin-coach-capacity">
                                                    <small>
                                                        PHYSICAL CAPACITY
                                                    </small>

                                                    <strong>
                                                        {coach.physicalCapacity} seats
                                                    </strong>
                                                </div>

                                                <div className="admin-coach-actions">
                                                    <button
                                                        type="button"
                                                        className="admin-coach-edit-button"
                                                        onClick={() => openEditCoach(coach)}
                                                    >
                                                        Edit
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="admin-coach-seat-button"
                                                        onClick={() => openSeatModal(coach)}
                                                    >
                                                        Manage Seats
                                                    </button>

                                                    <button
                                                        type="button"
                                                        className="admin-coach-delete-button"
                                                        onClick={() => handleDeleteCoach(coach)}
                                                    >
                                                        Delete
                                                    </button>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </div>
                        </div>
                    </div>
                </div>
            )}

            {editingCoach && (
                <div
                    className="admin-modal-overlay"
                    onClick={closeEditCoach}
                >
                    <div
                        className="admin-coach-edit-modal"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="admin-coach-modal-header">
                            <div>
                                <p>COACH MANAGEMENT</p>
                                <h2>Edit Coach</h2>
                                <span>
                                    {editingCoach.classCode} — {editingCoach.className}
                                </span>
                            </div>

                            <button
                                type="button"
                                className="admin-modal-close"
                                onClick={closeEditCoach}
                            >
                                ×
                            </button>
                        </div>

                        <form
                            onSubmit={async (event) => {
                                event.preventDefault();

                                if (!coachEditNumber.trim()) {
                                    setError("Coach number is required.");
                                    return;
                                }

                                try {
                                    setCoachEditSaving(true);
                                    setError("");

                                    const response = await fetch(
                                        `http://localhost:8080/api/admin/coaches/${editingCoach.id}`,
                                        {
                                            method: "PUT",
                                            headers: {
                                                "Content-Type": "application/json",
                                                Authorization: `Bearer ${token}`,
                                            },
                                            body: JSON.stringify({
                                                coachNumber: coachEditNumber.trim(),
                                            }),
                                        }
                                    );

                                    const data = await response
                                        .json()
                                        .catch(() => null);

                                    if (!response.ok) {
                                        throw new Error(
                                            data?.message ||
                                            data?.error ||
                                            "Failed to update coach."
                                        );
                                    }

                                    setCoaches((currentCoaches) =>
                                        currentCoaches
                                            .map((coach) =>
                                                coach.id === data.id
                                                    ? data
                                                    : coach
                                            )
                                            .sort((coach1, coach2) => {
                                                const number1 =
                                                    coach1.coachNumber;
                                                const number2 =
                                                    coach2.coachNumber;

                                                const prefix1 =
                                                    number1.replace(/\d+$/, "");
                                                const prefix2 =
                                                    number2.replace(/\d+$/, "");

                                                const prefixComparison =
                                                    prefix1.localeCompare(prefix2);

                                                if (prefixComparison !== 0) {
                                                    return prefixComparison;
                                                }

                                                const numeric1 = Number(
                                                    number1.substring(
                                                        prefix1.length
                                                    )
                                                );

                                                const numeric2 = Number(
                                                    number2.substring(
                                                        prefix2.length
                                                    )
                                                );

                                                return numeric1 - numeric2;
                                            })
                                    );

                                    closeEditCoach();
                                } catch (err) {
                                    setError(err.message);
                                } finally {
                                    setCoachEditSaving(false);
                                }
                            }}
                        >
                            <div className="admin-coach-edit-content">
                                <div className="admin-form-group">
                                    <label>Coach Number</label>

                                    <input
                                        type="text"
                                        value={coachEditNumber}
                                        onChange={(event) =>
                                            setCoachEditNumber(
                                                event.target.value
                                            )
                                        }
                                        placeholder="Example: A10"
                                        autoFocus
                                        required
                                    />
                                </div>

                                <div className="admin-coach-edit-details">
                                    <div>
                                        <small>CLASS</small>
                                        <strong>
                                            {editingCoach.classCode}
                                        </strong>
                                    </div>

                                    <div>
                                        <small>CONFIGURATION</small>
                                        <strong>
                                            {editingCoach.configurationCode}
                                        </strong>
                                    </div>

                                    <div>
                                        <small>CAPACITY</small>
                                        <strong>
                                            {editingCoach.physicalCapacity} seats
                                        </strong>
                                    </div>
                                </div>

                                {error && (
                                    <div className="admin-form-error">
                                        {error}
                                    </div>
                                )}
                            </div>

                            <div className="admin-modal-actions">
                                <button
                                    type="button"
                                    className="admin-cancel-button"
                                    onClick={closeEditCoach}
                                    disabled={coachEditSaving}
                                >
                                    Cancel
                                </button>

                                <button
                                    type="submit"
                                    className="admin-save-button"
                                    disabled={coachEditSaving}
                                >
                                    {coachEditSaving
                                        ? "Saving..."
                                        : "Save Changes"}
                                </button>
                            </div>
                        </form>
                    </div>
                </div>
            )}

            {showSeatModal && selectedCoach && (
                <div className="admin-modal-overlay">
                    <div className="admin-seat-modal">
                        <div className="admin-seat-modal-header">
                            <div>
                                <p>SEAT MANAGEMENT</p>
                                <h2>Manage Seats</h2>
                                <span>
                                    {selectedCoach.coachNumber} — {selectedCoach.classCode} — {selectedCoach.className}
                                </span>
                            </div>

                            <button
                                type="button"
                                className="admin-modal-close"
                                onClick={() => {
                                    setShowSeatModal(false);
                                    setSelectedCoach(null);
                                    setSeats([]);
                                    setError("");
                                }}
                            >
                                ×
                            </button>
                        </div>

                        <div className="admin-seat-modal-content">
                            {error && (
                                <div className="admin-form-error">
                                    {error}
                                </div>
                            )}

                            <div className="admin-seat-filters">

                                <div className="admin-form-group">
                                    <label>Journey Date</label>
                                    <input
                                        type="date"
                                        value={seatJourneyDate}
                                        min={getLocalDateString()}
                                        onChange={(e) =>
                                            setSeatJourneyDate(e.target.value)
                                        }
                                    />
                                </div>

                                <div className="admin-form-group">
                                    <label>From</label>
                                    <select
                                        value={seatFrom}
                                        onChange={(e) =>
                                            setSeatFrom(e.target.value)
                                        }
                                    >
                                        <option value="">Select From</option>

                                        {seatRoutes.map((route) => (
                                            <option
                                                key={route.id}
                                                value={route.stationCode}
                                            >
                                                {route.stationCode}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <div className="admin-form-group">
                                    <label>To</label>
                                    <select
                                        value={seatTo}
                                        onChange={(e) =>
                                            setSeatTo(e.target.value)
                                        }
                                    >
                                        <option value="">Select To</option>

                                        {seatRoutes.map((route) => (
                                            <option
                                                key={route.id}
                                                value={route.stationCode}
                                            >
                                                {route.stationCode}
                                            </option>
                                        ))}
                                    </select>
                                </div>

                                <button
                                    type="button"
                                    className="admin-primary-button"
                                    onClick={handleSeatStatusSearch}
                                    disabled={seatLoading}
                                >
                                    {seatLoading ? "Loading..." : "Load Seat Status"}
                                </button>

                            </div>

                            <div className="admin-seat-summary">
                                <div>
                                    <small>COACH</small>
                                    <strong>
                                        {selectedCoach.coachNumber}
                                    </strong>
                                </div>

                                <div>
                                    <small>CLASS</small>
                                    <strong>
                                        {selectedCoach.classCode}
                                    </strong>
                                </div>

                                <div>
                                    <small>PHYSICAL CAPACITY</small>
                                    <strong>
                                        {selectedCoach.physicalCapacity} seats
                                    </strong>
                                </div>

                                <div>
                                    <small>SEATS</small>
                                    <strong>
                                        {seats.length}
                                    </strong>
                                </div>
                            </div>

                            {seatLoading ? (
                                <div className="admin-route-loading">
                                    Loading seats...
                                </div>
                            ) : seats.length === 0 ? (
                                <div className="admin-seat-empty">
                                    <h3>No seats generated</h3>

                                    <p>
                                        This coach does not have any seats yet.
                                    </p>

                                    <button
                                        type="button"
                                        className="admin-primary-button"
                                        onClick={handleGenerateSeats}
                                    >
                                        Generate Seats
                                    </button>
                                </div>
                            ) : (
                                <div className="admin-seat-list-section">
                                    <div className="admin-route-section-heading">
                                        <p>COACH SEATS</p>
                                        <h3>Seat List</h3>
                                    </div>

                                    {selectedCoach.classCode === "SL" ||
                                        selectedCoach.classCode === "3A" ? (
                                        <div className="admin-sleeper-layout">
                                            <div className="admin-coach-end">
                                                <div className="admin-toilet">TOILET</div>
                                                <div className="admin-toilet">TOILET</div>
                                            </div>

                                            <div className="admin-coach-doors">
                                                <span>ENTRY / EXIT</span>
                                                <span>ENTRY / EXIT</span>
                                            </div>

                                            <div className="admin-sleeper-bays">
                                                {Array.from(
                                                    { length: Math.ceil(seats.length / 8) },
                                                    (_, bayIndex) => {
                                                        const baySeats = seats.slice(
                                                            bayIndex * 8,
                                                            bayIndex * 8 + 8
                                                        );

                                                        const mainSeats = baySeats.slice(0, 6);
                                                        const sideSeats = baySeats.slice(6, 8).reverse();

                                                        return (
                                                            <div
                                                                className="admin-sleeper-bay"
                                                                key={bayIndex}
                                                            >
                                                                <div className="admin-sleeper-main">
                                                                    <div className="admin-sleeper-row">
                                                                        {mainSeats
                                                                            .slice(0, 3)
                                                                            .map((seat) => (
                                                                                <div
                                                                                    className={`admin-sleeper-seat admin-berth-${seat.berthType.toLowerCase()} ${getSeatStatusClass(seat.status)}`}
                                                                                    key={seat.id}
                                                                                    onClick={() => openSeatAction(seat)}
                                                                                >
                                                                                    <strong>
                                                                                        {seat.seatNumber}
                                                                                    </strong>
                                                                                    <span>
                                                                                        {seat.berthType.replace(
                                                                                            "_",
                                                                                            " "
                                                                                        )}
                                                                                    </span>
                                                                                </div>
                                                                            ))}
                                                                    </div>

                                                                    <div className="admin-sleeper-row">
                                                                        {mainSeats
                                                                            .slice(3, 6)
                                                                            .map((seat) => (
                                                                                <div
                                                                                    className={`admin-sleeper-side-seat admin-berth-${seat.berthType.toLowerCase()} ${getSeatStatusClass(seat.status)}`}
                                                                                    key={seat.id}
                                                                                    onClick={() => openSeatAction(seat)}
                                                                                >
                                                                                    <strong>
                                                                                        {seat.seatNumber}
                                                                                    </strong>
                                                                                    <span>
                                                                                        {seat.berthType.replace(
                                                                                            "_",
                                                                                            " "
                                                                                        )}
                                                                                    </span>
                                                                                </div>
                                                                            ))}
                                                                    </div>
                                                                </div>

                                                                <div className="admin-sleeper-side">
                                                                    {sideSeats.map((seat) => (
                                                                        <div
                                                                            className={`admin-sleeper-side-seat admin-berth-${seat.berthType.toLowerCase()} ${getSeatStatusClass(seat.status)}`}
                                                                            key={seat.id}
                                                                            onClick={() => openSeatAction(seat)}
                                                                        >
                                                                            <strong>
                                                                                {seat.seatNumber}
                                                                            </strong>
                                                                            <span>
                                                                                {seat.berthType.replace(
                                                                                    "_",
                                                                                    " "
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>

                                            <div className="admin-coach-end">
                                                <div className="admin-toilet">TOILET</div>
                                                <div className="admin-toilet">TOILET</div>
                                            </div>

                                            <div className="admin-coach-doors">
                                                <span>ENTRY / EXIT</span>
                                                <span>ENTRY / EXIT</span>
                                            </div>
                                        </div>
                                    ) : selectedCoach.classCode === "2A" ? (
                                        <div className="admin-two-tier-layout">
                                            <div className="admin-coach-end">
                                                <div className="admin-toilet">TOILET</div>
                                                <div className="admin-toilet">TOILET</div>
                                            </div>

                                            <div className="admin-coach-doors">
                                                <span>ENTRY / EXIT</span>
                                                <span>ENTRY / EXIT</span>
                                            </div>

                                            <div className="admin-two-tier-bays">
                                                {Array.from(
                                                    { length: Math.ceil(seats.length / 6) },
                                                    (_, bayIndex) => {
                                                        const baySeats = seats.slice(
                                                            bayIndex * 6,
                                                            bayIndex * 6 + 6
                                                        );

                                                        const mainSeats = baySeats.slice(0, 4);
                                                        const sideSeats = baySeats
                                                            .slice(4, 6)
                                                            .reverse();

                                                        return (
                                                            <div
                                                                className="admin-two-tier-bay"
                                                                key={bayIndex}
                                                            >
                                                                <div className="admin-two-tier-main">
                                                                    <div className="admin-two-tier-row">
                                                                        {mainSeats.map((seat) => (
                                                                            <div
                                                                                className={`admin-sleeper-seat admin-berth-${seat.berthType.toLowerCase()} ${getSeatStatusClass(seat.status)}`}
                                                                                key={seat.id}
                                                                                onClick={() => openSeatAction(seat)}
                                                                            >
                                                                                <strong>
                                                                                    {seat.seatNumber}
                                                                                </strong>
                                                                                <span>
                                                                                    {seat.berthType.replace("_", " ")}
                                                                                </span>
                                                                            </div>
                                                                        ))}
                                                                    </div>
                                                                </div>

                                                                <div className="admin-two-tier-side">
                                                                    {sideSeats.map((seat) => (
                                                                        <div
                                                                            className={`admin-sleeper-side-seat admin-berth-${seat.berthType.toLowerCase()} ${getSeatStatusClass(seat.status)}`}
                                                                            key={seat.id}
                                                                            onClick={() => openSeatAction(seat)}
                                                                        >
                                                                            <strong>
                                                                                {seat.seatNumber}
                                                                            </strong>
                                                                            <span>
                                                                                {seat.berthType.replace(
                                                                                    "_",
                                                                                    " "
                                                                                )}
                                                                            </span>
                                                                        </div>
                                                                    ))}
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>

                                            <div className="admin-coach-end">
                                                <div className="admin-toilet">TOILET</div>
                                                <div className="admin-toilet">TOILET</div>
                                            </div>

                                            <div className="admin-coach-doors">
                                                <span>ENTRY / EXIT</span>
                                                <span>ENTRY / EXIT</span>
                                            </div>
                                        </div>
                                    ) : selectedCoach.classCode === "1A" ? (
                                        <div className="admin-first-ac-layout">
                                            <div className="admin-coach-end">
                                                <div className="admin-toilet">TOILET</div>
                                                <div className="admin-toilet">TOILET</div>
                                            </div>

                                            <div className="admin-coach-doors">
                                                <span>ENTRY / EXIT</span>
                                                <span>ENTRY / EXIT</span>
                                            </div>

                                            <div className="admin-first-ac-interior">
                                                <div className="admin-first-ac-cabin-section">
                                                    {Array.from(
                                                        { length: 4 },
                                                        (_, cabinIndex) => {
                                                            const cabinSeats = seats.slice(
                                                                cabinIndex * 4,
                                                                cabinIndex * 4 + 4
                                                            );

                                                            return (
                                                                <div
                                                                    className="admin-first-ac-compartment"
                                                                    key={`cabin-${cabinIndex}`}
                                                                >
                                                                    <div className="admin-first-ac-berth-area">
                                                                        <div className="admin-first-ac-berth-row">
                                                                            {cabinSeats.slice(0, 2).map((seat) => (
                                                                                <div
                                                                                    className={`admin-first-ac-seat admin-berth-${seat.berthType.toLowerCase()} ${getSeatStatusClass(seat.status)}`}
                                                                                    key={seat.id}
                                                                                    onClick={() => openSeatAction(seat)}
                                                                                >
                                                                                    <strong>{seat.seatNumber}</strong>
                                                                                    <span>
                                                                                        {seat.berthType.replace("_", " ")}
                                                                                    </span>
                                                                                </div>
                                                                            ))}
                                                                        </div>

                                                                        <div className="admin-first-ac-berth-row">
                                                                            {cabinSeats.slice(2, 4).map((seat) => (
                                                                                <div
                                                                                    className={`admin-first-ac-seat admin-berth-${seat.berthType.toLowerCase()} ${getSeatStatusClass(seat.status)}`}
                                                                                    key={seat.id}
                                                                                    onClick={() => openSeatAction(seat)}
                                                                                >
                                                                                    <strong>{seat.seatNumber}</strong>
                                                                                    <span>
                                                                                        {seat.berthType.replace("_", " ")}
                                                                                    </span>
                                                                                </div>
                                                                            ))}
                                                                        </div>
                                                                    </div>

                                                                    <div className="admin-first-ac-cabin-marker">
                                                                        <span>CABIN {cabinIndex + 1}</span>
                                                                        <small>DOOR</small>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </div>

                                                <div className="admin-first-ac-coupe-section">
                                                    {Array.from(
                                                        { length: 4 },
                                                        (_, coupeIndex) => {
                                                            const coupeSeats = seats.slice(
                                                                16 + coupeIndex * 2,
                                                                16 + coupeIndex * 2 + 2
                                                            );

                                                            return (
                                                                <div
                                                                    className="admin-first-ac-coupe"
                                                                    key={`coupe-${coupeIndex}`}
                                                                >
                                                                    <div className="admin-first-ac-coupe-berths">
                                                                        {coupeSeats.map((seat) => (
                                                                            <div
                                                                                className={`admin-first-ac-seat admin-berth-${seat.berthType.toLowerCase()} ${getSeatStatusClass(seat.status)}`}
                                                                                key={seat.id}
                                                                                onClick={() => openSeatAction(seat)}
                                                                            >
                                                                                <strong>{seat.seatNumber}</strong>
                                                                                <span>
                                                                                    {seat.berthType.replace("_", " ")}
                                                                                </span>
                                                                            </div>
                                                                        ))}
                                                                    </div>

                                                                    <div className="admin-first-ac-coupe-marker">
                                                                        <span>COUPE {coupeIndex + 1}</span>
                                                                        <small>DOOR</small>
                                                                    </div>
                                                                </div>
                                                            );
                                                        }
                                                    )}
                                                </div>
                                            </div>

                                            <div className="admin-coach-doors">
                                                <span>ENTRY / EXIT</span>
                                                <span>ENTRY / EXIT</span>
                                            </div>

                                            <div className="admin-coach-end">
                                                <div className="admin-toilet">TOILET</div>
                                                <div className="admin-toilet">TOILET</div>
                                            </div>
                                        </div>
                                    ) : selectedCoach.classCode === "CC" ? (
                                        <div className="admin-chair-car-layout">
                                            <div className="admin-coach-end">
                                                <div className="admin-toilet">TOILET</div>
                                                <div className="admin-toilet">TOILET</div>
                                            </div>

                                            <div className="admin-coach-doors">
                                                <span>ENTRY / EXIT</span>
                                                <span>ENTRY / EXIT</span>
                                            </div>

                                            <div className="admin-chair-car-rows">
                                                {Array.from(
                                                    { length: Math.ceil(seats.length / 5) },
                                                    (_, rowIndex) => {
                                                        const rowSeats = seats.slice(
                                                            rowIndex * 5,
                                                            rowIndex * 5 + 5
                                                        );

                                                        return (
                                                            <div
                                                                className="admin-chair-car-row"
                                                                key={rowIndex}
                                                            >
                                                                <div className="admin-chair-car-side">
                                                                    {rowSeats
                                                                        .slice(0, 3)
                                                                        .map((seat) => (
                                                                            <div
                                                                                className={`admin-chair-seat ${getSeatStatusClass(seat.status)}`}
                                                                                key={seat.id}
                                                                                onClick={() => openSeatAction(seat)}
                                                                            >
                                                                                <strong>
                                                                                    {seat.seatNumber}
                                                                                </strong>

                                                                                <span>
                                                                                    {seat.berthType.replace(
                                                                                        "_",
                                                                                        " "
                                                                                    )}
                                                                                </span>
                                                                            </div>
                                                                        ))}
                                                                </div>

                                                                <div className="admin-chair-car-aisle">
                                                                    <span>
                                                                        AISLE
                                                                    </span>
                                                                </div>

                                                                <div className="admin-chair-car-side">
                                                                    {rowSeats
                                                                        .slice(3, 5)
                                                                        .map((seat) => (
                                                                            <div
                                                                                className={`admin-chair-seat ${getSeatStatusClass(seat.status)}`}
                                                                                key={seat.id}
                                                                                onClick={() => openSeatAction(seat)}
                                                                            >
                                                                                <strong>
                                                                                    {seat.seatNumber}
                                                                                </strong>

                                                                                <span>
                                                                                    {seat.berthType.replace(
                                                                                        "_",
                                                                                        " "
                                                                                    )}
                                                                                </span>
                                                                            </div>
                                                                        ))}
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>

                                            <div className="admin-coach-doors">
                                                <span>ENTRY / EXIT</span>
                                                <span>ENTRY / EXIT</span>
                                            </div>

                                            <div className="admin-coach-end">
                                                <div className="admin-toilet">TOILET</div>
                                                <div className="admin-toilet">TOILET</div>
                                            </div>
                                        </div>

                                    ) : selectedCoach.classCode === "EC" ? (
                                        <div className="admin-executive-car-layout">
                                            <div className="admin-coach-end">
                                                <div className="admin-toilet">TOILET</div>
                                                <div className="admin-toilet">TOILET</div>
                                            </div>

                                            <div className="admin-coach-doors">
                                                <span>ENTRY / EXIT</span>
                                                <span>ENTRY / EXIT</span>
                                            </div>

                                            <div className="admin-executive-car-rows">
                                                {Array.from(
                                                    { length: Math.ceil(seats.length / 4) },
                                                    (_, rowIndex) => {
                                                        const rowSeats = seats.slice(
                                                            rowIndex * 4,
                                                            rowIndex * 4 + 4
                                                        );

                                                        return (
                                                            <div
                                                                className="admin-executive-car-row"
                                                                key={rowIndex}
                                                            >
                                                                <div className="admin-executive-car-side">
                                                                    {rowSeats
                                                                        .slice(0, 2)
                                                                        .map((seat) => (
                                                                            <div
                                                                                className={`admin-executive-seat ${getSeatStatusClass(seat.status)}`}
                                                                                key={seat.id}
                                                                                onClick={() => openSeatAction(seat)}
                                                                            >
                                                                                <strong>
                                                                                    {seat.seatNumber}
                                                                                </strong>

                                                                                <span>
                                                                                    {seat.berthType.replace(
                                                                                        "_",
                                                                                        " "
                                                                                    )}
                                                                                </span>
                                                                            </div>
                                                                        ))}
                                                                </div>

                                                                <div className="admin-executive-car-aisle">
                                                                    <span>
                                                                        AISLE
                                                                    </span>
                                                                </div>

                                                                <div className="admin-executive-car-side">
                                                                    {rowSeats
                                                                        .slice(2, 4)
                                                                        .map((seat) => (
                                                                            <div
                                                                                className={`admin-executive-seat ${getSeatStatusClass(seat.status)}`}
                                                                                key={seat.id}
                                                                                onClick={() => openSeatAction(seat)}
                                                                            >
                                                                                <strong>
                                                                                    {seat.seatNumber}
                                                                                </strong>

                                                                                <span>
                                                                                    {seat.berthType.replace(
                                                                                        "_",
                                                                                        " "
                                                                                    )}
                                                                                </span>
                                                                            </div>
                                                                        ))}
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>

                                            <div className="admin-coach-doors">
                                                <span>ENTRY / EXIT</span>
                                                <span>ENTRY / EXIT</span>
                                            </div>

                                            <div className="admin-coach-end">
                                                <div className="admin-toilet">TOILET</div>
                                                <div className="admin-toilet">TOILET</div>
                                            </div>
                                        </div>

                                    ) : selectedCoach.classCode === "2S" ? (
                                        <div className="admin-second-sitting-layout">
                                            <div className="admin-coach-end">
                                                <div className="admin-toilet">TOILET</div>
                                                <div className="admin-toilet">TOILET</div>
                                            </div>

                                            <div className="admin-coach-doors">
                                                <span>ENTRY / EXIT</span>
                                                <span>ENTRY / EXIT</span>
                                            </div>

                                            <div className="admin-second-sitting-rows">
                                                {Array.from(
                                                    { length: Math.ceil(seats.length / 6) },
                                                    (_, rowIndex) => {
                                                        const rowSeats = seats.slice(
                                                            rowIndex * 6,
                                                            rowIndex * 6 + 6
                                                        );

                                                        return (
                                                            <div
                                                                className="admin-second-sitting-row"
                                                                key={rowIndex}
                                                            >
                                                                <div className="admin-second-sitting-side">
                                                                    {rowSeats
                                                                        .slice(0, 3)
                                                                        .map((seat) => (
                                                                            <div
                                                                                className={`admin-second-sitting-seat ${getSeatStatusClass(seat.status)}`}
                                                                                key={seat.id}
                                                                                onClick={() => openSeatAction(seat)}
                                                                            >
                                                                                <strong>
                                                                                    {seat.seatNumber}
                                                                                </strong>

                                                                                <span>
                                                                                    SEAT
                                                                                </span>
                                                                            </div>
                                                                        ))}
                                                                </div>

                                                                <div className="admin-second-sitting-aisle">
                                                                    <span>
                                                                        AISLE
                                                                    </span>
                                                                </div>

                                                                <div className="admin-second-sitting-side">
                                                                    {rowSeats
                                                                        .slice(3, 6)
                                                                        .map((seat) => (
                                                                            <div
                                                                                className={`admin-second-sitting-seat ${getSeatStatusClass(seat.status)}`}
                                                                                key={seat.id}
                                                                                onClick={() => openSeatAction(seat)}
                                                                            >
                                                                                <strong>
                                                                                    {seat.seatNumber}
                                                                                </strong>

                                                                                <span>
                                                                                    SEAT
                                                                                </span>
                                                                            </div>
                                                                        ))}
                                                                </div>
                                                            </div>
                                                        );
                                                    }
                                                )}
                                            </div>

                                            <div className="admin-coach-doors">
                                                <span>ENTRY / EXIT</span>
                                                <span>ENTRY / EXIT</span>
                                            </div>

                                            <div className="admin-coach-end">
                                                <div className="admin-toilet">TOILET</div>
                                                <div className="admin-toilet">TOILET</div>
                                            </div>
                                        </div>

                                    ) : (
                                        <div className="admin-seat-grid">
                                            {seats.map((seat) => (
                                                <div
                                                    className={`admin-seat-card ${getSeatStatusClass(seat.status)}`}
                                                    key={seat.id}
                                                    onClick={() => openSeatAction(seat)}
                                                >
                                                    <strong>
                                                        {seat.seatNumber}
                                                    </strong>
                                                    <span>
                                                        {seat.berthType.replace(
                                                            "_",
                                                            " "
                                                        )}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    )}
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {selectedSeat && (
                <div
                    className="admin-seat-action-overlay"
                    onClick={closeSeatAction}
                >
                    <div
                        className="admin-seat-action-panel"
                        onClick={(event) => event.stopPropagation()}
                    >
                        <div className="admin-seat-action-header">
                            <div>
                                <p>SEAT ACTION</p>

                                <h3>
                                    Seat {selectedSeat.seatNumber}
                                </h3>

                                <span>
                                    {selectedSeat.berthType.replace("_", " ")}
                                </span>
                            </div>

                            <button
                                type="button"
                                className="admin-modal-close"
                                onClick={closeSeatAction}
                            >
                                ×
                            </button>
                        </div>

                        <div className="admin-seat-action-content">

                            <div className="admin-seat-action-status">
                                <small>CURRENT STATUS</small>

                                <strong>
                                    {selectedSeat.status}
                                </strong>
                            </div>

                            {selectedSeat.status === "AVAILABLE" ? (
                                <>
                                    <div className="admin-form-group">
                                        <label>Action</label>

                                        <select defaultValue="BLOCK">
                                            <option value="BLOCK">
                                                Block Seat
                                            </option>
                                        </select>
                                    </div>

                                    <div className="admin-form-group">
                                        <label>Reason</label>

                                        <select
                                            value={blockReason}
                                            onChange={(event) =>
                                                setBlockReason(event.target.value)
                                            }
                                        >
                                            <option value="Maintenance">
                                                Maintenance
                                            </option>

                                            <option value="Security Seat">
                                                Security Seat
                                            </option>

                                            <option value="VIP Traveling Seat">
                                                VIP Traveling Seat
                                            </option>
                                        </select>
                                    </div>

                                    <div className="admin-seat-action-actions">
                                        <button
                                            type="button"
                                            className="admin-cancel-button"
                                            onClick={closeSeatAction}
                                            disabled={blockSaving}
                                        >
                                            Cancel
                                        </button>

                                        <button
                                            type="button"
                                            className="admin-seat-block-button"
                                            onClick={handleBlockSeat}
                                            disabled={blockSaving}
                                        >
                                            {blockSaving
                                                ? "Blocking..."
                                                : "Block Seat"}
                                        </button>
                                    </div>
                                </>
                            ) : (
                                selectedSeat.status === "BLOCKED" ? (
                                    <>
                                        <div className="admin-seat-action-message">
                                            This seat is currently blocked by the admin.
                                        </div>

                                        <div className="admin-seat-action-reason">
                                            <small>BLOCK REASON</small>

                                            <strong>
                                                {selectedSeat.blockReason}
                                            </strong>
                                        </div>

                                        <div className="admin-seat-action-actions">
                                            <button
                                                type="button"
                                                className="admin-cancel-button"
                                                onClick={closeSeatAction}
                                                disabled={blockSaving}
                                            >
                                                Cancel
                                            </button>

                                            <button
                                                type="button"
                                                className="admin-seat-unblock-button"
                                                onClick={handleUnblockSeat}
                                                disabled={blockSaving}
                                            >
                                                {blockSaving
                                                    ? "Unblocking..."
                                                    : "Unblock Seat"}
                                            </button>
                                        </div>
                                    </>
                                ) : (
                                    <div className="admin-seat-action-message">
                                        This seat cannot be modified because its current
                                        status is {selectedSeat.status}.
                                    </div>
                                )
                            )}

                        </div>
                    </div>
                </div>
            )}

        </div>
    );
}

export default AdminTrains;