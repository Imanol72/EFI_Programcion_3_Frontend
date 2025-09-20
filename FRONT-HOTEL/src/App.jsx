import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import { AuthProvider } from "./context/AuthContext";
import { RoomsProvider } from "./context/RoomsContext";
import { ClientsProvider } from "./context/ClientsContext";
import { ReservationsProvider } from "./context/ReservationsContext";

import PrivateRoute from "./components/PrivateRoute";
import PublicRoute from "./components/PublicRoute";

import Navbar from "./components/Navbar";

import Home from "./layouts/home/Home";
import Login from "./layouts/auth/Login";
import Register from "./layouts/auth/Register";
import ForgotPassword from "./layouts/auth/ForgotPassword";
import ResetPassword from "./layouts/auth/ResetPassword";

import RoomsRoutes from "./layouts/rooms";
import ClientsRoutes from "./layouts/clients";
import ReservationsRoutes from "./layouts/reservations";

function App() {
  return (
    <Router>
      <AuthProvider>
        <RoomsProvider>
          <ClientsProvider>
            <ReservationsProvider>
              <Navbar />
              <Routes>
                {/* Rutas públicas */}
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
                  path="/forgot-password"
                  element={
                    <PublicRoute>
                      <ForgotPassword />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/reset-password/:token"
                  element={
                    <PublicRoute>
                      <ResetPassword />
                    </PublicRoute>
                  }
                />

                {/* Rutas privadas */}
                <Route
                  path="/rooms/*"
                  element={
                    <PrivateRoute>
                      <RoomsRoutes />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/clients/*"
                  element={
                    <PrivateRoute>
                      <ClientsRoutes />
                    </PrivateRoute>
                  }
                />
                <Route
                  path="/reservations/*"
                  element={
                    <PrivateRoute>
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
