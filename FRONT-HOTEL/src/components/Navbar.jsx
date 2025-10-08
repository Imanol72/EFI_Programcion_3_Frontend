import { Menubar } from "primereact/menubar";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const items = [
    { label: "Inicio", command: () => navigate("/") },
    ...(user
      ? [
          { label: "Habitaciones", command: () => navigate("/habitaciones") },
          ...(user.rol === "cliente"
            ? [{ label: "Mis Reservas", command: () => navigate("/reservas") }]
            : []),
          ...(user.rol === "admin" || user.rol === "empleado"
            ? [{ label: "Clientes", command: () => navigate("/clientes") }]
            : []),
          ...(user.rol === "admin"
            ? [{ label: "Usuarios", command: () => navigate("/usuarios") }]
            : []),
        ]
      : [
          { label: "Login", command: () => navigate("/inicio-sesion") },
          { label: "Registro", command: () => navigate("/registro") },
        ]),
  ];

  const end = user && (
    <button onClick={logout} className="p-button p-button-danger p-button-sm">
      Logout
    </button>
  );

  return <Menubar model={items} end={end} />;
};

export default Navbar;
