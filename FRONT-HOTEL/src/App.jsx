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
import ClientsPage from "./pages/Clientspage";

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
              {/* Contenedor de contenido (no afecta al Menubar) */}
              <div style={{ maxWidth: "1200px", margin: "0 auto" }} className="p-3">
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
                    path="/rooms/*"
                    element={
                      <PrivateRoute>
                        <RoomsPage />
                      </PrivateRoute>
                    }
                  />
                  {/* OJO: paths en español para que coincidan con el Navbar */}
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
              </div>
            </Router>
          </ReservationsProvider>
        </ClientsProvider>
      </RoomsProvider>
    </AuthProvider>
  );
}

export default App;
