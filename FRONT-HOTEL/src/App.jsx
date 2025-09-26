// src/App.jsx
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// Contextos
import { AuthProvider } from "./context/AuthContext";
import { RoomsProvider } from "./context/RoomsContext";
import { ClientsProvider } from "./context/ClientsContext";
import { ReservationsProvider } from "./context/ReservationsContext";

// Rutas protegidas y públicas
import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";

// Componentes
import Navbar from "./components/Navbar";

// Layouts
import Home from "./layouts/home/Home";
import RoomsRoutes from "./layouts/rooms";
import ClientsRoutes from "./layouts/clients";
import ReservationsRoutes from "./layouts/reservations";

// Auth layouts
import Login from "./layouts/auth/Login";
import Register from "./layouts/auth/Register";
import ForgotPassword from "./layouts/auth/ForgotPassword";
import ResetPassword from "./layouts/auth/ResetPassword";

function App() {
  return (
    <AuthProvider>
      <RoomsProvider>
        <ClientsProvider>
          <ReservationsProvider>
            <Router>
              <Navbar />
              <Routes>
                {/* Home público */}
                <Route
                  path="/"
                  element={
                    <PublicRoute>
                      <Home />
                    </PublicRoute>
                  }
                />

                {/* Auth */}
                <Route
                  path="/inicio-sesion"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/registro"
                  element={
                    <PublicRoute>
                      <Register />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/recuperar-contraseña"
                  element={
                    <PublicRoute>
                      <ForgotPassword />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/restablecer-contraseña"
                  element={
                    <PublicRoute>
                      <ResetPassword />
                    </PublicRoute>
                  }
                />

                {/* Rutas privadas */}
                <Route
                  path="/habitaciones/*"
                  element={
                    <PrivateRoute>
                      <RoomsRoutes />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/clientes/*"
                  element={
                    <PrivateRoute>
                      <ClientsRoutes />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/reservas/*"
                  element={
                    <PrivateRoute>
                      <ReservationsRoutes />
                    </PrivateRoute>
                  }
                />
              </Routes>
            </Router>
          </ReservationsProvider>
        </ClientsProvider>
      </RoomsProvider>
    </AuthProvider>
  );
}

export default App;
