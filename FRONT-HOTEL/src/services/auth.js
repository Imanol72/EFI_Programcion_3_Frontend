// src/services/auth.js
import axios from "axios";

// Configuración base del backend
const API_URL = "http://localhost:8000/api"; // cambia según tu backend

const login = async (credentials) => {
  const res = await axios.post(`${API_URL}/auth/login`, credentials);
  return res.data;
};

const register = async (userData) => {
  const res = await axios.post(`${API_URL}/auth/register`, userData);
  return res.data;
};

const forgotPassword = async (email) => {
  const res = await axios.post(`${API_URL}/auth/forgot-password`, { email });
  return res.data;
};

const resetPassword = async (token, newPassword) => {
  const res = await axios.post(`${API_URL}/auth/reset-password`, {
    token,
    password: newPassword,
  });
  return res.data;
};

export default { login, register, forgotPassword, resetPassword };
