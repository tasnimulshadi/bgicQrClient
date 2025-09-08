// src/context/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

const PrivateRoute = ({ children, allowedRoles }) => {
  const { isAuthenticated, justLoggedOut, user } = useAuth();

  // 1. Not logged in
  if (!isAuthenticated) {
    if (justLoggedOut) {
      return <Navigate to="/bgichologin" replace />;
    }
    return <Navigate to="/" replace />;
  }

  // 2. Logged in but no role info yet (still loading user)
  if (!user) {
    return <div>Loading...</div>; // or a spinner
  }

  // 3. Role check
  if (allowedRoles && !allowedRoles.includes(user.role)) {
    return <Navigate to="/dashboard" replace />; // or home page
  }

  // 4. All good → show protected content
  return children;
};

export default PrivateRoute;
