// src/context/AuthContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/auth"; // axios calls to backend

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);   // logged-in user data
  const [token, setToken] = useState(null); // JWT or similar
  const [loading, setLoading] = useState(true);

  // 🔑 Login
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
      console.error("Login error:", err);
      return {
        success: false,
        error: err.response?.data?.message || "Login failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // 📝 Register
  const register = async (userData) => {
    setLoading(true);
    try {
      const data = await authService.register(userData);
      return { success: true, data };
    } catch (err) {
      console.error("Register error:", err);
      return {
        success: false,
        error: err.response?.data?.message || "Registration failed",
      };
    } finally {
      setLoading(false);
    }
  };

  // 📧 Forgot password
  const forgotPassword = async (email) => {
    setLoading(true);
    try {
      await authService.forgotPassword(email);
      return { success: true };
    } catch (err) {
      console.error("Forgot password error:", err);
      return {
        success: false,
        error: err.response?.data?.message || "Error sending email",
      };
    } finally {
      setLoading(false);
    }
  };

  // 🔑 Reset password with token
  const resetPassword = async (token, newPassword) => {
    setLoading(true);
    try {
      await authService.resetPassword(token, newPassword);
      return { success: true };
    } catch (err) {
      console.error("Reset password error:", err);
      return {
        success: false,
        error: err.response?.data?.message || "Password reset failed",
      };
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

  // ♻️ Restore session from localStorage
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