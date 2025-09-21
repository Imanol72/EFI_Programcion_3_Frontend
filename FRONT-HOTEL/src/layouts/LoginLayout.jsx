// src/layouts/LoginLayout.jsx
import { useState } from "react";
import authService from "../services/auth";

export default function LoginLayout({ onLogin }) {
  const [form, setForm] = useState({ email: "", password: "" });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const data = await authService.login(form);
      onLogin(data);
    } catch (err) {
      alert("Login failed");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Login</h2>
        <input
          type="email"
          name="email"
          placeholder="Email"
          value={form.email}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
          required
        />
        <input
          type="password"
          name="password"
          placeholder="Password"
          value={form.password}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
          required
        />
        <button
          type="submit"
          className="bg-blue-500 text-white py-2 w-full rounded hover:bg-blue-600"
        >
          Sign In
        </button>
      </form>
    </div>
  );
}
