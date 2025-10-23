import React from "react";
import { Navigate } from "react-router-dom";

const ProtectedRoute = ({ children }) => {
    const authData = localStorage.getItem("auth");

    if (!authData) {
        return <Navigate to="/login" replace />;
    }

    try {
        const { token, expiresAt } = JSON.parse(authData);

        // нет токена → на логин
        if (!token) {
            return <Navigate to="/login" replace />;
        }

        // токен просрочен → чистим и редиректим
        if (Date.now() > expiresAt) {
            localStorage.removeItem("auth");
            return <Navigate to="/login" replace />;
        }
    } catch (e) {
        // если localStorage битый → очистим
        localStorage.removeItem("auth");
        return <Navigate to="/login" replace />;
    }

    return children;
};

export default ProtectedRoute;
