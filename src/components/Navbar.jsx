import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  // Hide Navbar on login page or if not authenticated
  if (location.pathname === "/" || !isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    navigate("/");
  };

  return (
    <nav className="bg-gray-200 py-4">
      <div className="mx-auto px-4" style={{ maxWidth: "1140px" }}>
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <Link
              to="/dashboard"
              className="text-3xl font-bold text-blue-600 hover:text-blue-700"
            >
              BGIC
            </Link>
            {/* <Link to="/data" className="text-blue-600 hover:underline">
              Data List
            </Link>
            <Link to="/data/new" className="text-blue-600 hover:underline">
              Add Data
            </Link> */}
          </div>
          <div>
            <button
              onClick={handleLogout}
              className="bg-red-500 text-white px-3 py-1 rounded hover:bg-red-600 cursor-pointer"
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
