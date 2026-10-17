import { Outlet, Navigate, useLocation } from "react-router-dom";
import { getUser, getToken } from "../utils/auth";

const PrivateRoute = ({ requiredRole }) => {
  const location = useLocation();
  const user = getUser();
  const token = getToken();

  if (!user || !token) {
    // Remember where they were going so Login can send them back
    return <Navigate to="/login" replace state={{ from: location.pathname }} />;
  }

  if (requiredRole && user.role !== requiredRole) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
