// src/components/Navbar.jsx
import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  // ¿Está logueado? (evita contar {} como logueado)
  const isLogged = !!(
    user &&
    (user.id || user.username || user.email || user.token)
  );

  // role o rol, en minúsculas
  const role = ((user?.role ?? user?.rol) ?? "")
    .toString()
    .trim()
    .toLowerCase();

  const items = [
    { label: "Inicio", icon: "pi pi-home", command: () => navigate("/") },

    ...(isLogged
      ? [
          { label: "Rooms", icon: "pi pi-th-large", command: () => navigate("/rooms") },

          ...(role === "cliente"
            ? [{
                label: "My Reservations",
                icon: "pi pi-calendar",
                command: () => navigate("/reservations"),
              }]
            : []),

          ...(role === "admin" || role === "empleado"
            ? [{
                label: "Clients",
                icon: "pi pi-users",
                command: () => navigate("/clients"),
              }]
            : []),

          ...(role === "admin"
            ? [{
                label: "Users",
                icon: "pi pi-user",
                command: () => navigate("/users"),
              }]
            : []),
        ]
      : [
          {
            label: "Login",
            icon: "pi pi-sign-in",
            command: () => navigate("/inicio-sesion"),
          },
          {
            label: "Register",
            icon: "pi pi-user-plus",
            command: () => navigate("/registro"),
          },
        ]),
  ];

  const start = (
    <div className="flex align-items-center gap-2 px-2">
      <i className="pi pi-building" />
      <span className="font-semibold">HotelApp</span>
    </div>
  );

  const end = isLogged ? (
    <Button
      label="Logout"
      icon="pi pi-sign-out"
      severity="danger"
      size="small"
      onClick={logout}
      className="ml-2"
    />
  ) : null;

  return <Menubar model={items} start={start} end={end} />;
};

export default Navbar;
