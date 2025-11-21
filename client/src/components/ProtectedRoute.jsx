import React from 'react';
import { Navigate, Outlet } from 'react-router-dom';

const ProtectedRoute = () => {
    // Check karte hain ki token localStorage mein hai ya nahi
    const userInfo = localStorage.getItem('userInfo');
    const isAuthenticated = userInfo ? JSON.parse(userInfo).token : null;

    // Agar token hai, toh child routes (Dashboard) ko dikhao.
    // Agar nahi hai, toh use /login par bhej do.
    return isAuthenticated ? <Outlet /> : <Navigate to="/login" replace />;
};

export default ProtectedRoute;