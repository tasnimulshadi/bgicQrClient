import { Link, useLocation, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { useState, useRef, useEffect } from "react";
import { FaUserCircle } from "react-icons/fa";

function Navbar() {
  const { isAuthenticated, user, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();

  const [dropdownOpen, setDropdownOpen] = useState(false);
  const dropdownRef = useRef(null);

  // Close dropdown if clicked outside
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  if (location.pathname === "/login" || !isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/login");
  };

  return (
    <nav className="bg-blue-950 text-white py-4 shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center gap-4">
          {/* Brand Logo/Link to Dashboard */}
          <Link to="/dashboard" className="text-3xl font-extrabold text-white">
            Claims App
          </Link>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center justify-center text-white cursor-pointer"
              aria-label="User menu"
            >
              <FaUserCircle className="text-3xl" />
            </button>

            {/* Animated Dropdown */}
            <div
              className={`absolute right-0 mt-2 w-48 bg-white text-gray-800 border border-gray-200 rounded-lg shadow-lg z-50 transform transition-all duration-300 origin-top-right
                ${
                  dropdownOpen
                    ? "opacity-100 scale-100 translate-y-0"
                    : "opacity-0 scale-95 -translate-y-2 pointer-events-none"
                }`}
            >
              <div className="px-4 py-3 border-b border-gray-100 cursor-default">
                <p className="font-semibold truncate">{user?.username}</p>
                <p className="text-xs text-gray-500 truncate">{user?.role}</p>
              </div>
              <div className="flex flex-col">
                <Link
                  to="/dashboard"
                  className="px-4 py-2 hover:bg-gray-100 transition duration-200"
                  onClick={() => setDropdownOpen(false)}
                >
                  Dashboard
                </Link>
                <Link
                  to="/fields"
                  className="px-4 py-2 hover:bg-gray-100 transition duration-200"
                  onClick={() => setDropdownOpen(false)}
                >
                  Data Sets
                </Link>
                {/* <Link
                  to="/profile"
                  className="px-4 py-2 hover:bg-gray-100 transition duration-200"
                  onClick={() => setDropdownOpen(false)}
                >
                  Profile
                </Link> */}
                {/* <Link
                  to="/settings"
                  className="px-4 py-2 hover:bg-gray-100 transition duration-200"
                  onClick={() => setDropdownOpen(false)}
                >
                  Settings
                </Link> */}
                <button
                  onClick={handleLogout}
                  className="w-full text-left px-4 py-2 text-red-600 font-semibold hover:bg-red-200 transition duration-200 rounded-b-lg cursor-pointer"
                >
                  Logout
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}

export default Navbar;
