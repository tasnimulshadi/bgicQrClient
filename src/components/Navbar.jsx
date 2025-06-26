import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

/**
 * Navbar component for navigation and logout functionality.
 * It hides itself on the login page or if the user is not authenticated.
 */
function Navbar() {
  const { isAuthenticated, logout } = useAuth(); // Get authentication status and logout function from AuthContext
  const navigate = useNavigate(); // Hook for programmatic navigation
  const location = useLocation(); // Hook to get the current URL location

  // Conditional rendering: Hide Navbar on login page or if not authenticated
  if (location.pathname === "/bgichologin" || !isAuthenticated) {
    return null; // Don't render the Navbar
  }

  /**
   * Handles the logout process.
   * Calls the logout function from AuthContext and navigates to the login page.
   */
  const handleLogout = () => {
    logout(); // Perform logout
    navigate("/bgichologin"); // Redirect to login page
  };

  return (
    <nav className="bg-blue-950 text-white py-4 shadow-md">
      {" "}
      {/* Darker background for navbar */}
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        {" "}
        {/* Wider max-width and more consistent padding */}
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Brand Logo/Link to Dashboard */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <Link
              to="/dashboard"
              className="text-4xl font-extrabold text-white hover:text-blue-300 transition-colors duration-200 ease-in-out tracking-wide" // Larger, bolder, and more vibrant text for logo
            >
              BGIC
            </Link>
          </div>

          {/* Logout Button */}
          <div>
            <button
              aria-label="Logout"
              onClick={handleLogout}
              className="px-5 py-2 bg-red-600 text-white font-semibold rounded-lg shadow-md hover:bg-red-700 cursor-pointer transition duration-300 ease-in-out transform hover:scale-105 flex items-center justify-center gap-2" // Enhanced button styling
            >
              Logout
            </button>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
