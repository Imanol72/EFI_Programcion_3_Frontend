import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { RoomsProvider } from "./context/RoomsContext";
import { ClientsProvider } from "./context/ClientsContext";
import { ReservationsProvider } from "./context/ReservationsContext";

import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";

import Navbar from "./components/Navbar"; // corregido: Navbar con N mayúscula y b minúscula

import Home from "./layouts/Home"; // corregido: Home con H mayúscula
import LoginLayout from "./layouts/LoginLayout";
import RegisterLayout from "./layouts/RegisterLayout";
import ForgotPasswordLayout from "./layouts/ForgotPasswordLayout";
import ResetPasswordLayout from "./layouts/ResetPasswordLayout";

import RoomsRoutes from "./layouts/Rooms"; // Rooms con R mayúscula
import ClientsRoutes from "./layouts/Clients"; // Clients con C mayúscula
import ReservationsRoutes from "./layouts/Reservations"; // Reservations con R mayúscula

function App() {
  return (
    <Router>
      <AuthProvider>
        <RoomsProvider>
          <ClientsProvider>
            <ReservationsProvider>
              <Navbar />

              <Routes>
                {/* Public routes */}
                <Route
                  path="/inicio-sesion"
                  element={
                    <PublicRoute>
                      <LoginLayout />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/registro"
                  element={
                    <PublicRoute>
                      <RegisterLayout />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/forgot-password"
                  element={
                    <PublicRoute>
                      <ForgotPasswordLayout />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/reset-password/:token"
                  element={
                    <PublicRoute>
                      <ResetPasswordLayout />
                    </PublicRoute>
                  }
                />

                {/* Private routes */}
                <Route
                  path="/rooms/*"
                  element={
                    <PrivateRoute roles={["admin", "empleado"]}>
                      <RoomsRoutes />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/clients/*"
                  element={
                    <PrivateRoute roles={["admin", "empleado"]}>
                      <ClientsRoutes />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/reservations/*"
                  element={
                    <PrivateRoute roles={["admin", "empleado", "cliente"]}>
                      <ReservationsRoutes />
                    </PrivateRoute>
                  }
                />

                {/* Home */}
                <Route path="/" element={<Home />} />
              </Routes>
            </ReservationsProvider>
          </ClientsProvider>
        </RoomsProvider>
      </AuthProvider>
    </Router>
  );
}

export default App;
