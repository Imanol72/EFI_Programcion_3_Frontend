import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import authService from "../../services/auth";
import { useNavigate } from "react-router-dom";

export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "", name: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");

    try {
      await authService.register(form);
      navigate("/inicio-sesion");
    } catch (err) {
      setError("Error en el registro");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card title="Registro" className="w-96">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <InputText
            placeholder="Nombre"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
          />
          <InputText
            placeholder="Email"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
          />
          <Password
            placeholder="Contraseña"
            feedback={true}
            toggleMask
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
          />
          {error && <small className="p-error">{error}</small>}
          <Button label="Registrarse" type="submit" loading={loading} />
        </form>
      </Card>
    </div>
  );
}
