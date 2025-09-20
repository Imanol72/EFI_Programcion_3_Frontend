import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Cargando...</div>; 

  if (!user) {
    return <Navigate to="/inicio-sesion" />;
  }

  if (roles && !roles.includes(user.rol)) {
    return <div>No tienes permiso para acceder a esta página</div>;
  }

  return children;
};

export default PrivateRoute;
