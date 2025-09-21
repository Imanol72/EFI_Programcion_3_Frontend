// src/components/NavBar.jsx
import { Link } from "react-router-dom";
import { useAuth } from "../context/AuthContext"; // solo un ".." es suficiente
import { Button } from "primereact/button";

const Navbar = () => {
  const { user, logout } = useAuth();

  return (
    <nav className="navbar p-3 bg-gray-100 flex justify-between items-center shadow-md">
      <div className="flex gap-4">
        <Link to="/">Home</Link>

        {user && (
          <>
            <Link to="/rooms">Rooms</Link>

            {/* Only for client */}
            {user.rol === "client" && <Link to="/reservations">My Reservations</Link>}

            {/* Only for admin or employee */}
            {(user.rol === "admin" || user.rol === "employee") && (
              <Link to="/clients">Clients</Link>
            )}

            {/* Only admin */}
            {user.rol === "admin" && <Link to="/users">Users</Link>}
          </>
        )}
      </div>

      <div className="flex gap-4">
        {!user ? (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
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
