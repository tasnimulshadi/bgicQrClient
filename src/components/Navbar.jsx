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

  if (location.pathname === "/bgichologin" || !isAuthenticated) {
    return null;
  }

  const handleLogout = () => {
    logout();
    setDropdownOpen(false);
    navigate("/bgichologin");
  };

  return (
    <nav className="bg-blue-950 text-white py-4 shadow-md">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
          {/* Brand Logo/Link to Dashboard */}
          <div className="flex flex-col sm:flex-row gap-2 sm:gap-4">
            <Link
              to="/dashboard"
              className="text-4xl font-extrabold text-white hover:text-blue-300 transition-colors duration-200 tracking-wide"
            >
              BGIC
            </Link>
          </div>

          {/* User Dropdown */}
          <div className="relative" ref={dropdownRef}>
            <button
              onClick={() => setDropdownOpen((prev) => !prev)}
              className="flex items-center justify-center text-white hover:text-gray-200 transition duration-300 cursor-pointer"
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
              <div className="px-4 py-3 border-b border-gray-100 flex justify-between items-center cursor-default">
                <p className="font-semibold truncate">{user?.username}</p>
                <p className="text-sm text-gray-500 truncate">{user?.role}</p>
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
                  to="/field-settings"
                  className="px-4 py-2 hover:bg-gray-100 transition duration-200"
                  onClick={() => setDropdownOpen(false)}
                >
                  Field Settings
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
