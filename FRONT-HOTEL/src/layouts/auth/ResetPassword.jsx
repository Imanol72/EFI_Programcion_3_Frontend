import { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Password } from "primereact/password";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import authService from "../../services/auth";

export default function ResetPassword() {
  const { token } = useParams();
  const navigate = useNavigate();

  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await authService.resetPassword(token, password);
      setMessage("Contraseña restablecida. Redirigiendo...");
      setTimeout(() => navigate("/inicio-sesion"), 2000);
    } catch (err) {
      setMessage("Error al restablecer la contraseña");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card title="Restablecer contraseña" className="w-96">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <Password
            placeholder="Nueva contraseña"
            feedback={true}
            toggleMask
            value={password}
            onChange={(e) => setPassword(e.target.value)}
          />
          <Button label="Restablecer" type="submit" loading={loading} />
          {message && <small>{message}</small>}
        </form>
      </Card>
    </div>
  );
}
