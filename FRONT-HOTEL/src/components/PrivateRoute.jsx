// src/components/PrivateRoute.jsx
import { useAuth } from "../context/AuthContext";
import { Navigate } from "react-router-dom";

const PrivateRoute = ({ children, roles }) => {
  const { user, loading } = useAuth();

  if (loading) return <div>Loading...</div>;

  if (!user) {
    return <Navigate to="/login" />;
  }

  if (roles && !roles.includes(user.rol)) {
    return <div>You do not have permission to access this page</div>;
  }

  return children;
};

export default PrivateRoute;
