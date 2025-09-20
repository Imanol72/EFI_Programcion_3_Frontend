import { createContext, useContext, useState, useEffect } from "react";
import authService from "../services/auth"; // lo armamos abajo

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);   // datos del usuario logueado
  const [token, setToken] = useState(null); // JWT o similar
  const [loading, setLoading] = useState(true);

  // Login
  const login = async (credentials) => {
    try {
      const data = await authService.login(credentials);
      setToken(data.token);
      setUser(data.user); // depende de lo que devuelva tu backend
      localStorage.setItem("token", data.token);
      localStorage.setItem("user", JSON.stringify(data.user));
      return true;
    } catch (err) {
      console.error("Error en login:", err);
      return false;
    }
  };

  // Logout
  const logout = () => {
    setToken(null);
    setUser(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
  };

  // Recuperar sesión si había un token guardado
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
      value={{ user, token, loading, login, logout, isAuthenticated: !!token }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
