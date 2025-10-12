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

// Layouts / Pages
import Home from "./layouts/home/Home";
import RoomsPage from "./pages/RoomsPage";
import ReservationsPage from "./pages/ReservationsPage";
import ClientsPage from "./pages/ClientsPage";

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
             {/*  <div style={{ maxWidth: "1200px", margin: "0 auto" }} className="p-3"> */}
                <Routes>
                  {/* ✅ Home público (SIN PublicRoute) */}
                  <Route path="/" element={<Home />} />
                  {/* (Opcional) alias canónico si te gusta /home */}
                  {/* <Route path="/home" element={<Home />} /> */}

                  {/* Auth (sí usan PublicRoute) */}
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

                  {/* Privadas */}
                  <Route
                    path="/rooms/*"
                    element={
                      <PrivateRoute>
                        <RoomsPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/clients/*"
                    element={
                      <PrivateRoute>
                        <ClientsPage />
                      </PrivateRoute>
                    }
                  />
                  <Route
                    path="/reservations/*"
                    element={
                      <PrivateRoute>
                        <ReservationsPage />
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
