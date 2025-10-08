import { useAuth } from "../../context/AuthContext";
import { Link } from "react-router-dom";
import { Card } from "primereact/card";
import { Button } from "primereact/button";

const Home = () => {
  const { user } = useAuth();

  return (
    <div className="flex justify-center items-center h-screen">
      <Card title="Hotel System" className="w-full max-w-lg text-center shadow-lg">
        {!user ? (
          <>
            <p className="mb-4">Please login or register to continue.</p>
            <div className="flex justify-center gap-4">
              <Link to="/inicio-sesion">
                <Button label="Login" className="p-button-primary" />
              </Link>
              <Link to="/registro">
                <Button label="Register" className="p-button-success" />
              </Link>
            </div>
          </>
        ) : (
          <>
            <p className="mb-4">
              Hello, <span className="font-semibold">{user.username}</span>! 👋
            </p>

            {user.rol === "cliente" && (
              <Link to="/reservas">
                <Button label="My Reservations" className="p-button-info" />
              </Link>
            )}

            {(user.rol === "admin" || user.rol === "empleado") && (
              <div className="flex justify-center gap-4">
                <Link to="/habitaciones">
                  <Button label="Manage Rooms" className="p-button-help" />
                </Link>
                <Link to="/clientes">
                  <Button label="Manage Clients" className="p-button-warning" />
                </Link>
              </div>
            )}
          </>
        )}
      </Card>
    </div>
  );
};

export default Home;
