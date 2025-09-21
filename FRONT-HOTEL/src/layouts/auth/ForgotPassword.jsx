import { useState } from "react";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Card } from "primereact/card";
import authService from "../../services/auth";

export default function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState("");

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setMessage("");

    try {
      await authService.forgotPassword(email);
      setMessage("Se envió un correo para restablecer tu contraseña");
    } catch (err) {
      setMessage("Error al enviar el correo");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="flex justify-center items-center h-screen">
      <Card title="Olvidé mi contraseña" className="w-96">
        <form onSubmit={handleSubmit} className="flex flex-col gap-3">
          <InputText
            placeholder="Ingresa tu email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
          />
          <Button label="Enviar" type="submit" loading={loading} />
          {message && <small>{message}</small>}
        </form>
      </Card>
    </div>
  );
}
