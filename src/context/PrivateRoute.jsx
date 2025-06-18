// src/context/PrivateRoute.jsx
import { Navigate } from "react-router-dom";
import { useAuth } from "./AuthContext";

// PrivateRoute component to protect routes based on authentication status
const PrivateRoute = ({ children }) => {
  // Destructure authentication state from custom auth hook
  const { isAuthenticated, justLoggedOut } = useAuth(); // `isAuthenticated` = user is logged in, `justLoggedOut` = user recently logged out

  // If user is authenticated, allow access to the protected content
  if (isAuthenticated) {
    return children;
  }
  // If user is not authenticated and has just logged out, redirect to custom login page
  else if (!isAuthenticated && justLoggedOut) {
    return <Navigate to="/bgichologin" replace />;
  }
  // If user is not authenticated but not due to recent logout (e.g., page reload or expired session), redirect to default home
  else {
    return <Navigate to="/" replace />;
  }
};

export default PrivateRoute;
