import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import { useAuth } from "../../context/AuthContext";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();

  const [credentials, setCredentials] = useState({ username: "", password: "" });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e) => {    
    e.preventDefault();
    setLoading(true);
    setError("");

    const result = await login(credentials);

    if (result.success) {
      navigate("/habitaciones"); // o a donde quieras mandar al user
    } else {
      setError(result.error || "Credenciales incorrectas");
    }

    setLoading(false);
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card title="Iniciar Sesión" className="w-96">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <InputText
            placeholder="Nombre de usuario"
            value={credentials.username}
            onChange={(e) =>
              setCredentials({ ...credentials, username: e.target.value })
            }
          />
          <Password
            placeholder="Contraseña"
            feedback={false}
            toggleMask
            value={credentials.password}
            onChange={(e) =>
              setCredentials({ ...credentials, password: e.target.value })
            }
          />
          {error && <small className="p-error">{error}</small>}
          <Button label="Ingresar" type="submit" loading={loading} />
        </form>
      </Card>
    </div>
  );
}
