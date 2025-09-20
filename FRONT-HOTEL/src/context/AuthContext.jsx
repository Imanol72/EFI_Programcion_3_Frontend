import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/auth"; // acá irán las llamadas reales con axios

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);   // datos del usuario logueado
  const [token, setToken] = useState(null); // JWT o similar
  const [loading, setLoading] = useState(true);

  const login = async (credentials) => {
    setLoading(true);
    try {
      const data = await authService.login(credentials);
      setToken(data.token);
      setUser(data.user);
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return { success: true };
    } catch (err) {
      console.error("Error en login:", err);
      return { success: false, error: err.response?.data?.message || "Error en login" };
    } finally {
      setLoading(false);
    }
  };

  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await authService.register(userData);
      return { success: true, data };
    } catch (err) {
      console.error("Error en registro:", err);
      return { success: false, error: err.response?.data?.message || "Error en registro" };
    } finally {
      setLoading(false);
    }
  };

  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      return { success: true };
    } catch (err) {
      console.error("Error en forgotPassword:", err);
      return { success: false, error: err.response?.data?.message || "Error al enviar email" };
    } finally {
      setLoading(false);
    }
  };

  // 🔑 Resetear contraseña con token
  const resetPassword = async (token, newPassword) => {
    setLoading(true);
    try {
      await authService.resetPassword(token, newPassword);
      return { success: true };
    } catch (err) {
      console.error("Error en resetPassword:", err);
      return { success: false, error: err.response?.data?.message || "Error al restablecer contraseña" };
    } finally {
      setLoading(false);
    }
  };

  // 🚪 Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");

    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
    setLoading(false);
  }, []);

  return (
    <AuthContext.Provider
      value={{
        user,
        token,
        loading,
        isAuthenticated: !!token,
        login,
        register,
        forgotPassword,
        resetPassword,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);