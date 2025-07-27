import React, { createContext, useContext, useState, useEffect } from "react";
import axios from "../utils/axios";
import { AUTH_ENDPOINT } from "../constant";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  // Always fetch user on initial load (session based or cookie-based login)
  useEffect(() => {
    fetchUser();
  }, []);

  const fetchUser = async () => {
    try {
      const res = await axios.get("/auth/profile");
      if (res.data) {
        setUser(res.data);
        localStorage.setItem("user", JSON.stringify(res.data)); // optional
      } else {
        setUser(null);
        localStorage.removeItem("user");
      }
    } catch (err) {
      setUser(null);
      localStorage.removeItem("user");
    } finally {
      setLoading(false);
    }
  };

  const login = async (credentials) => {
    try {
      const res = await axios.post(`${AUTH_ENDPOINT}/login`, credentials);
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
      navigate("/dashboard");
    } catch (err) {
      throw new Error(err.response?.data?.message || "Login failed");
    }
  };

  const register = async (userData) => {
    try {
      const res = await axios.post(`${AUTH_ENDPOINT}/register`, userData);
      setUser(res.data.user);
      localStorage.setItem("user", JSON.stringify(res.data.user));
    } catch (err) {
      throw new Error(err.response?.data?.message || "Register failed");
    }
  };

  const logout = async () => {
    try {
      await axios.post(`${AUTH_ENDPOINT}/logout`);
    } catch (err) {
      console.error("Logout failed:", err);
    } finally {
      setUser(null);
      localStorage.removeItem("user");
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
