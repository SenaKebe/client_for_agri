import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import LoginRegister from "./LoginRegister";

const API_BASE_URL = "https://fa495a956f79.ngrok-free.app/api/v1";

const AuthContext = React.createContext();

export const AuthProvider = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Start with false
  const navigate = useNavigate();

  // Clear token on page unload or refresh
  useEffect(() => {
    const handleBeforeUnload = () => {
      localStorage.removeItem("token"); // Clear token on refresh or close
    };
    window.addEventListener("beforeunload", handleBeforeUnload);
    return () => window.removeEventListener("beforeunload", handleBeforeUnload);
  }, []);

  // Verify token on mount, but don't rely on localStorage persistence
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      verifyToken(token);
    } else {
      setIsAuthenticated(false);
      navigate("/login");
    }
  }, [navigate]);

  const verifyToken = async (token) => {
    try {
      await axios.get(`${API_BASE_URL}/protected`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setIsAuthenticated(true);
    } catch (err) {
      setIsAuthenticated(false);
      localStorage.removeItem("token");
      navigate("/login");
    }
  };

  const handleLogin = async (email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/login`, {
        email,
        password,
      });
      const { access_token } = response.data;
      localStorage.setItem("token", access_token); // Store temporarily
      setIsAuthenticated(true);
      navigate("/");
    } catch (err) {
      throw new Error("Invalid email or password");
    }
  };

  const handleRegister = async (name, email, password) => {
    try {
      const response = await axios.post(`${API_BASE_URL}/register`, {
        name,
        email,
        password,
      });
      const { access_token } = response.data;
      localStorage.setItem("token", access_token); // Store temporarily
      setIsAuthenticated(true);
      navigate("/");
    } catch (err) {
      throw new Error("Registration failed. Email may already be in use.");
    }
  };

  const handleLogout = () => {
    localStorage.removeItem("token");
    setIsAuthenticated(false);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, handleLogout }}>
      {isAuthenticated ? (
        children
      ) : (
        <LoginRegister onLogin={handleLogin} onRegister={handleRegister} />
      )}
    </AuthContext.Provider>
  );
};
