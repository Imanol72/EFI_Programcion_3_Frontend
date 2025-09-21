import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import { Button } from "primereact/button";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar p-3 bg-gray-100 flex justify-between items-center shadow-md">
      <div className="flex gap-4">
        <Link to="/">Inicio</Link>

        {user && (
          <>
            <Link to="/habitaciones">Habitaciones</Link>

            {/* Solo si es cliente */}
            {user.rol === "cliente" && <Link to="/reservas">Mis Reservas</Link>}

            {/* Solo si es admin o empleado */}
            {(user.rol === "admin" || user.rol === "empleado") && (
              <Link to="/clientes">Clientes</Link>
            )}

            {/* Solo admin */}
            {user.rol === "admin" && <Link to="/usuarios">Usuarios</Link>}
          </>
        )}
      </div>

      <div className="flex gap-4">
        {!user ? (
          <>
            <Link to="/inicio-sesion">Login</Link>
            <Link to="/registro">Registro</Link>
          </>
        ) : (
          <Button
            label="Logout"
            className="p-button-sm p-button-danger"
            onClick={logout}
          />
        )}
      </div>
    </nav>
  );
};

export default Navbar;
