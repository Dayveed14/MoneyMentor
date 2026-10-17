import { Outlet, Navigate, useLocation } from "react-router-dom";
import { getToken, getUser, loggedOutManually } from "../utils/auth";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ requiredRole }) => {
  const location = useLocation();
  useAuth(); // subscribe so this re-renders on log in / log out
  // Read the session directly: right after login() the context may not have
  // re-rendered yet, and we must not bounce a just-logged-in user back to /login
  const user = getUser();

  if (!user || !getToken()) {
    if (loggedOutManually()) return <Navigate to="/" replace />;
    // Remember where they were going so Login can send them back
    return <Navigate to="/login" replace state={{ from: location.pathname + location.search }} />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/account" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
