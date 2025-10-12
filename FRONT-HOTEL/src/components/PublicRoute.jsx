import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  // Si está logueado, no tiene sentido ver login/register → lo mando a rooms
  return user ? <Navigate to="/rooms" replace /> : children;
};

export default PublicRoute;
