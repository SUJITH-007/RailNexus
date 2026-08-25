import { Navigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";

function AdminRoute({ children }) {

    const { isLoggedIn, userRole } = useAuth();

    if (!isLoggedIn) {
        return <Navigate to="/admin/login" replace />;
    }

    if (userRole !== "ADMIN") {
        return <Navigate to="/" replace />;
    }

    return children;
}

export default AdminRoute;