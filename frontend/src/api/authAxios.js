import axios from "../utils/axios"; // your base axios instance
import { AUTH_ENDPOINT } from "../constant";

// Login user
export const loginUser = async (credentials) => {
  const response = await axios.post(`${AUTH_ENDPOINT}/login`, credentials);
  return response.data; // contains { user, token? }
};

// Register user
export const registerUser = async (userData) => {
  const response = await axios.post(`${AUTH_ENDPOINT}/register`, userData);
  return response.data;
};

// Logout user
export const logoutUser = async () => {
  const response = await axios.post(`${AUTH_ENDPOINT}/logout`);
  return response.data;
};

// Get current user (used for session persistence)
export const getProfile = async () => {
  const response = await axios.get(`${AUTH_ENDPOINT}/profile`);
  return response.data;
};
