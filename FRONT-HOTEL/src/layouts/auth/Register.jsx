// src/layouts/auth/Register.jsx
import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { useNavigate } from "react-router-dom";
import authService from "../../services/auth";
import "./auth.css";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setLoading(true);
    try {
      await authService.register(form);
      navigate("/inicio-sesion");
    } catch {
      setError("Error en el registro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-hero">
      <div className="auth-circle left">
        <form className="auth-content" onSubmit={handleSubmit}>
          <h1 className="auth-title">Registro</h1>

          <div className="auth-field">
            <span className="p-float-label">
              <InputText
                id="reg-username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
              <label htmlFor="reg-username">Ingrese un nombre de usuario</label>
            </span>
          </div>

          <div className="auth-field">
            <span className="p-float-label">
              <Password
                id="reg-password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                feedback
                toggleMask
              />
              <label htmlFor="reg-password">Ingrese una contraseña</label>
            </span>
          </div>

          {error && <small className="p-error">{error}</small>}

          <div className="auth-actions">
            <Button type="submit" label="Registrar" loading={loading} />
            <Button type="button" label="Volver a Login" outlined onClick={() => navigate("/inicio-sesion")} />
          </div>
        </form>
      </div>
    </div>
  );
}