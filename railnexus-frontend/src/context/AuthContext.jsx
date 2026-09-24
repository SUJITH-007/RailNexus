import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

function getStoredToken() {
    return localStorage.getItem("token");
}

function getRoleFromToken(token) {
    if (!token) {
        return null;
    }

    try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        return payload.role || null;
    } catch (error) {
        return null;
    }
}

export function AuthProvider({ children }) {
    const [token, setToken] = useState(getStoredToken);

    const [userRole, setUserRole] = useState(() =>
        getRoleFromToken(getStoredToken())
    );

    const isLoggedIn = !!token;

    function login(loginResponse) {
        const receivedToken = loginResponse.token;

        localStorage.setItem("token", receivedToken);

        if (loginResponse.tokenType) {
            localStorage.setItem("tokenType", loginResponse.tokenType);
        }

        const role = getRoleFromToken(receivedToken);

        if (role) {
            localStorage.setItem("userRole", role);
        }

        setToken(receivedToken);
        setUserRole(role);
    }

    function logout() {
        localStorage.removeItem("token");
        localStorage.removeItem("tokenType");
        localStorage.removeItem("userRole");

        setToken(null);
        setUserRole(null);
    }

    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                token,
                userRole,
                login,
                logout,
            }}
        >
            {children}
        </AuthContext.Provider>
    );
}

export function useAuth() {
    return useContext(AuthContext);
}