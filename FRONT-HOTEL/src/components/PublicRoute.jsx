import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const PublicRoute = ({ children }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando...</div>; 

  return user ? <Navigate to="/" /> : children;
};

export default PublicRoute;
