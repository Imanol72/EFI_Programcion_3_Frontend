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

// Layouts (que internamente llaman a sus Pages)
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
                  path="/login"
                  element={
                    <PublicRoute>
                      <Login />
                    </PublicRoute>
                  }
                />
                <Route
                  path="/register"
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
                  path="/reset-password"
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
              </Routes>
            </Router>
          </ReservationsProvider>
        </ClientsProvider>
      </RoomsProvider>
    </AuthProvider>
  );
}

export default App;
