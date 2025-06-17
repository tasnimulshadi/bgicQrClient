/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable no-unused-vars */
// src/pages/Login.jsx
import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import config from "../utility/config";
import { toast } from "react-toastify";

function Login() {
  const [userId, setUserId] = useState("");
  const [password, setPassword] = useState("");
  const { login, token } = useAuth();
  const navigate = useNavigate();

  useEffect(() => {
    if (token) {
      navigate("/dashboard");
    }
  }, []);

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post(`${config.apiUrl}/auth/login`, {
        userid: userId,
        password: password,
      });
      login(res.data.token);
      window.location.href = "/dashboard";
    } catch (err) {
      toast.error(
        <div>
          <p className="font-bold">Login Failed.</p>
          <p>{err.message}</p>
        </div>
      );
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center w-full">
      <form
        onSubmit={handleLogin}
        className="max-w-md w-full p-6 bg-gray-200 rounded shadow-md"
      >
        <h1 className="text-center text-2xl mb-4 font-semibold">- LOGIN -</h1>
        <input
          type="text"
          placeholder="User ID"
          value={userId}
          onChange={(e) => setUserId(e.target.value)}
          className="w-full mb-4 px-4 py-2 border bg-gray-50  border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <input
          type="password"
          placeholder="Password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          className="w-full mb-6 px-4 py-2 border bg-gray-50   border-gray-300 rounded focus:outline-none focus:ring-2 focus:ring-blue-500"
        />
        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 transition font-semibold cursor-pointer"
        >
          Login
        </button>
      </form>
    </div>
  );
}

export default Login;
