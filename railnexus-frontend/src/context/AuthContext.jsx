import { createContext, useContext, useState } from "react";

const AuthContext = createContext();

export function AuthProvider({ children }) {

    const [isLoggedIn, setIsLoggedIn] = useState(
        localStorage.getItem("isLoggedIn") === "true"
    );

    const [userRole, setUserRole] = useState(
        localStorage.getItem("userRole")
    );


    function login() {

        setIsLoggedIn(true);
        setUserRole("USER");

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", "USER");
    }


    function adminLogin() {

        setIsLoggedIn(true);
        setUserRole("ADMIN");

        localStorage.setItem("isLoggedIn", "true");
        localStorage.setItem("userRole", "ADMIN");
    }


    function logout() {

        setIsLoggedIn(false);
        setUserRole(null);

        localStorage.removeItem("isLoggedIn");
        localStorage.removeItem("userRole");
    }


    return (
        <AuthContext.Provider
            value={{
                isLoggedIn,
                userRole,
                login,
                adminLogin,
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