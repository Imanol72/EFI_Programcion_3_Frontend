import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // 👇 Mandar al módulo principal si ya está logueado
  return user ? <Navigate to="/habitaciones" /> : children;
};

export default PublicRoute;
