import { Menubar } from "primereact/menubar";
import { Button } from "primereact/button";
import { useAuth } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";
import { useMemo } from "react";

const Navbar = () => {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const isLogged = !!(user && (user.id || user.username || user.email || user.token));

  // Tomamos posibles campos donde podría venir el rol
  const rawRole = user?.role ?? user?.rol ?? user?.roles ?? user?.user?.role ?? user?.user?.rol ?? "";
  const rolesArr = Array.isArray(rawRole) ? rawRole : String(rawRole).split(",");
  const normRoles = rolesArr.map(r => String(r).trim().toLowerCase()).filter(Boolean);
  const hasRole = (r) => normRoles.includes(String(r).toLowerCase());

  // Para ver qué está llegando (déjalo unos minutos mientras depuras)
  if (isLogged) {
    // eslint-disable-next-line no-console
    console.log("DEBUG Navbar user:", user);
    // eslint-disable-next-line no-console
    console.log("DEBUG Navbar roles detectados:", normRoles);
  }

  // ¿Reconocimos algún rol esperado?
  const matchedKnownRole = useMemo(
    () => ["cliente", "empleado", "admin", "administrador"].some(r => hasRole(r)),
    [normRoles]
  );

  const items = [
     { label: "Inicio", icon: "pi pi-home", command: () => navigate("/") },


    ...(isLogged
      ? [
          ...(hasRole("admin") ? [{
            label: "Rooms",
             icon: "pi pi-th-large",
              command: () => navigate("/rooms"),
          }] : []),

          // --- Reglas por rol (ajusta a tus reglas reales) ---
          ...(hasRole("cliente") ? [{
            label: "My Reservations",
            icon: "pi pi-calendar",
            command: () => navigate("/reservations"),
          }] : []),

          ...(hasRole("empleado") || hasRole("admin") || hasRole("administrador") ? [{
            label: "Reservations",
            icon: "pi pi-calendar",
            command: () => navigate("/reservations"),
          }] : []),

          ...(hasRole("empleado") || hasRole("admin") || hasRole("administrador") ? [{
            label: "Clients",
            icon: "pi pi-users",
            command: () => navigate("/clients"),
          }] : []),

          // --- Fallback temporal: si no reconocemos rol, igual mostramos ---
          ...(!matchedKnownRole ? [
            { separator: true },
            { label: "Reservations (fallback)", icon: "pi pi-calendar", command: () => navigate("/reservations") },
            { label: "Clients (fallback)", icon: "pi pi-users", command: () => navigate("/clients") },
          ] : []),
        ]
      : [
          { label: "Login", icon: "pi pi-sign-in", command: () => navigate("/inicio-sesion") },
          { label: "Register", icon: "pi pi-user-plus", command: () => navigate("/registro") },
        ]),
  ];

  const start = (
    <div className="flex align-items-center gap-2 px-2">
      <i className="pi pi-building" />
      <span className="font-semibold">HotelApp</span>
      {isLogged && (
        <span className="text-xs p-1 border-round surface-200 ml-2">
          roles: {normRoles.length ? normRoles.join(", ") : "(ninguno)"}
        </span>
      )}
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
