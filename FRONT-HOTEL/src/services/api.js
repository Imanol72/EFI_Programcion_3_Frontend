// src/services/api.js
import axios from "axios";

const api = axios.create({
  baseURL: import.meta.env?.VITE_API_URL || "http://localhost:3000/api",
  // Si tu backend usa cookie/sesión en vez de JWT, descomenta:
  withCredentials: true,
  headers: {
    "Content-Type": "application/json",
    Accept: "application/json",
  },
});

// Inyecta el token (JWT) si existe
api.interceptors.request.use((config) => {
  const token = localStorage.getItem("token");
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

// Logger de errores (útil para ver el body del backend)
export function logAxiosError(err, label = "Request error") {
  console.error(label, {
    message: err?.message,
    status: err?.response?.status,
    statusText: err?.response?.statusText,
    url: err?.config?.url,
    data: err?.response?.data,
  });
  throw err;
}

export default api;

