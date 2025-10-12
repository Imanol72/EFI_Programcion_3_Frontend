// src/layouts/auth/Login.jsx
import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Divider } from "primereact/divider";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../../context/AuthContext";
import "./auth.css";

export default function Login() {
  const { login, loading } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ username: "", password: "" });
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    if (!form.username || !form.password) {
      setError("Completá usuario y contraseña");
      return;
    }
    const result = await login(form);
    if (result?.success) navigate("/rooms");
    else setError(result?.error || "Credenciales incorrectas");
  };

  return (
    <div className="auth-hero">
      <div className="auth-circle right">
        <form className="auth-content" onSubmit={handleSubmit}>
          <h1 className="auth-title">Iniciar sesión</h1>

          <div className="auth-field">
            <span className="p-float-label">
              <InputText
                id="username"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
              />
              <label htmlFor="username">Usuario</label>
            </span>
          </div>

          <div className="auth-field">
            <span className="p-float-label">
              <Password
                id="password"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                feedback={false}
                toggleMask
              />
              <label htmlFor="password">Contraseña</label>
            </span>
          </div>

          {error && <small className="p-error">{error}</small>}

          <div className="auth-actions">
            <Button type="submit" label="Ingresar" icon="pi pi-sign-in" loading={loading} />
            <Button type="button" label="Registrar" outlined onClick={() => navigate("/registro")} />
          </div>

          <Divider />

          <div className="auth-muted">
            ¿Olvidaste tu contraseña?{" "}
            <a onClick={() => navigate("/recuperar-contraseña")}>Recuperar</a>
          </div>
        </form>
      </div>
    </div>
  );
}
