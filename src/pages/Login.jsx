/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// src/pages/Login.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import config from "../utility/config";
import { toast } from "react-toastify"; // Import toast for notifications

/**
 * Login component for user authentication.
 * Handles user input for ID and password, communicates with an authentication API,
 * and manages user session using AuthContext.
 */
function Login() {
  const [userId, setUserId] = useState(""); // State for user ID input
  const [password, setPassword] = useState(""); // State for password input
  const { login, token } = useAuth(); // Access login function and token from AuthContext
  const navigate = useNavigate(); // Hook for programmatic navigation

  // Effect hook to redirect to dashboard if already authenticated
  useEffect(() => {
    document.title = `BGIC - OMP Login`; // Set document title
    if (token) {
      navigate("/dashboard"); // Redirect if a token exists (user is already logged in)
    }
  }, [token, navigate]); // Dependencies: token and navigate

  /**
   * Handles the login form submission.
   * Prevents default form submission, sends login credentials to the API,
   * and handles success (login) or failure (error message).
   * @param {Event} e - The form submission event.
   */
  const handleLogin = async (e) => {
    e.preventDefault(); // Prevent default form submission behavior
    try {
      // Send a POST request to the login API endpoint with user ID and password
      const res = await axios.post(`${config.apiUrl}/auth/login`, {
        userid: userId,
        password: password,
      });

      login(res.data.token); // Call the login function from AuthContext with the received token
      window.location.href = "/dashboard"; // Redirect using window.location.href to force a full page reload,
      // which helps in re-initializing the AuthContext and other global states.
    } catch (err) {
      console.error("Login error:", err); // Log the error for debugging purposes

      // Display a user-friendly error message using react-toastify
      toast.error(
        <div>
          <p className="font-bold">Login Failed.</p>
          <p>
            {err.response && err.response.data && err.response.data.error
              ? err.response.data.error // Specific error message from backend
              : "An unexpected error occurred. Please try again."}{" "}
            {/* Generic error message */}
          </p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full p-4">
      {" "}
      {/* Enhanced background */}
      <form
        onSubmit={handleLogin}
        className="max-w-md w-full p-8 bg-white rounded-xl shadow-2xl space-y-6 transform transition-all duration-300 ease-in-out hover:scale-105" // Modernized form styling
      >
        <h1 className="text-center text-4xl font-extrabold text-gray-800 mb-6">
          {" "}
          {/* Larger, bolder title */}
          Welcome Back!
        </h1>
        <p className="text-center text-gray-600 mb-6">
          Please log in to your account.
        </p>

        {/* User ID Input */}
        <div>
          <label htmlFor="userId" className="sr-only">
            User ID
          </label>{" "}
          {/* Accessible label */}
          <input
            type="text"
            id="userId"
            placeholder="User ID"
            value={userId}
            onChange={(e) => setUserId(e.target.value)}
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-gray-800"
            required
            autoComplete="username" // For better browser autofill
          />
        </div>

        {/* Password Input */}
        <div>
          <label htmlFor="password" className="sr-only">
            Password
          </label>{" "}
          {/* Accessible label */}
          <input
            type="password"
            id="password"
            placeholder="Password"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            className="w-full px-5 py-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500 placeholder-gray-400 text-gray-800"
            required
            autoComplete="current-password" // For better browser autofill
          />
        </div>

        {/* Login Button */}
        <button
          type="submit"
          className="w-full bg-blue-600 text-white font-bold py-3 px-4 rounded-lg hover:bg-blue-700 transition duration-300 ease-in-out transform hover:scale-95 shadow-lg" // Enhanced button styling
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
