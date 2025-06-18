/* eslint-disable react-hooks/exhaustive-deps */
/* eslint-disable react-refresh/only-export-components */
// src/context/AuthContext.jsx
import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(localStorage.getItem("token") || null);
  const [justLoggedOut, setJustLoggedOut] = useState(false);

  const login = (newToken) => {
    localStorage.setItem("token", newToken);
    setToken(newToken);
    setJustLoggedOut(false);
  };

  const logout = () => {
    localStorage.removeItem("token");
    setToken(null);
    setJustLoggedOut(true);
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    if (savedToken && !token) {
      setToken(savedToken);
    }
  }, []);

  return (
    <AuthContext.Provider
      value={{ token, login, logout, isAuthenticated: !!token, justLoggedOut }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
