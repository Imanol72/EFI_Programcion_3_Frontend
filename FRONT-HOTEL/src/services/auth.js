import axios from "axios";

const API_URL = "http://localhost:8000/api/auth"; 

const login = async (credentials) => {
  const res = await axios.post(`${API_URL}/login/`, credentials);
  return res.data; // { token, user }
};

const register = async (userData) => {
  const res = await axios.post(`${API_URL}/register/`, userData);
  return res.data; // depende de lo que devuelva el backend
};

const forgotPassword = async (email) => {
  const res = await axios.post(`${API_URL}/forgot-password/`, { email });
  return res.data;
};

const resetPassword = async (token, newPassword) => {
  const res = await axios.post(`${API_URL}/reset-password/`, {
    token,
    password: newPassword,
  });
  return res.data;
};

export default {
  login,
  register,
  forgotPassword,
  resetPassword,
};
