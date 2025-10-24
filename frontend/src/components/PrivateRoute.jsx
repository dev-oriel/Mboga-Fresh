// frontend/src/components/PrivateRoute.jsx - MODIFIED

import React from "react";
import { useAuth } from "../context/AuthContext";
import { Navigate, Outlet, useLocation } from "react-router-dom";

/**
 * Maps a user role to its default dashboard path.
 */
const ROLE_REDIRECT_MAP = {
  buyer: "/marketplace",
  vendor: "/vendordashboard",
  farmer: "/supplierdashboard",
  rider: "/riderdashboard",
  admin: "/admindashboard",
};

/**
 * PrivateRoute component for role-based access control.
 *
 * @param {string[]} allowedRoles - An array of roles allowed to access this route.
 * @param {boolean} allowUnauthenticated - If true, non-authenticated users are allowed (e.g., login/signup pages).
 * @param {boolean} redirectIfAuthenticated - If true, authenticated users are redirected to their dashboard (used for / and /login).
 */
const PrivateRoute = ({
  allowedRoles = [],
  allowUnauthenticated = false,
  redirectIfAuthenticated = false, // <--- NEW PROP
}) => {
  const { user, loadingAuth } = useAuth();
  const location = useLocation();

  if (loadingAuth) {
    return (
      <div className="flex justify-center items-center h-screen">
        Loading...
      </div>
    );
  }

  const isAuthenticated = !!user;
  const userRole = user?.role?.toLowerCase();
  const targetPath = ROLE_REDIRECT_MAP[userRole] || "/";

  // --- NEW: Redirect if user is authenticated AND this route is marked for redirection ---
  if (isAuthenticated && redirectIfAuthenticated) {
    // Only redirect if the user's role is not 'buyer'.
    // Buyers are allowed to access / as it's their homepage.
    if (userRole !== "buyer") {
      return <Navigate to={targetPath} replace />;
    }
  }

  // --- 1. Handle unauthenticated access (same as before) ---
  if (!isAuthenticated) {
    if (allowUnauthenticated) {
      return <Outlet />;
    }
    // Redirect to login if accessing a protected route without login
    return <Navigate to="/login" state={{ from: location }} replace />;
  }

  // --- 2. Handle authenticated access with role checks (same as before) ---
  if (allowedRoles.length > 0) {
    if (allowedRoles.includes(userRole)) {
      return <Outlet />;
    } else {
      // User is logged in but has the wrong role (e.g., vendor trying to access buyer cart)
      console.warn(
        `User ${userRole} attempted to access restricted path. Redirecting to ${targetPath}`
      );
      return <Navigate to={targetPath} replace />;
    }
  }

  // Fallback: Allows any authenticated user if no specific roles were provided
  return <Outlet />;
};

export default PrivateRoute;
