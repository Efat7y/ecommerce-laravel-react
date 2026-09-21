import ErrorPage from "@/pages/ErrorPage";
import { Navigate, useLocation } from "react-router-dom";
import { getToken, hasDashboardAccess, getUser } from "@/utils/auth";

const ProtectedRoute = ({ children, adminOnly = false }) => {
  const location = useLocation();
  const token = getToken();
  const user = getUser();

  if (!token) {
    return <Navigate to={`/login?redirect=${location.pathname}`} replace />;
  }

  if (user && user.status === 'unverified') {
    return <Navigate to="/verify-otp" replace />;
  }

  if (adminOnly && !hasDashboardAccess()) {
    return <ErrorPage type="403" />;
  }

  return children;
};

export default ProtectedRoute;
