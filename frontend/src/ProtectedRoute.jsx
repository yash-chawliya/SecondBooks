import React from 'react';
import { useAuth } from './AuthContext';
import { Navigate, useLocation } from 'react-router-dom';

const ProtectedRoute = ({ children }) => {
    const { isLoggedIn, loading } = useAuth();
    const location = useLocation();

    // 1. While the initial session check is happening, show a loading screen.
    // This prevents the user from being prematurely redirected to /login.
    if (loading) {
        return (
            <div className="flex justify-center items-center h-screen">
                <div className="text-xl font-semibold">Loading...</div>
            </div>
        );
    }

    // 2. After the check, if the user is not logged in, redirect to the login page.
    //    We pass the current location in the state, so we can redirect back after a successful login.
    if (!isLoggedIn) {
        return <Navigate to="/login" state={{ from: location }} replace />;
    }

    // 3. If the loading is finished and the user is logged in, show the requested page.
    return children;
};

export default ProtectedRoute;