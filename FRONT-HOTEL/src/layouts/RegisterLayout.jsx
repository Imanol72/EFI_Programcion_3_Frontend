// src/layouts/RegisterLayout.jsx
import { useState } from "react";
import authService from "../services/auth";

export default function RegisterLayout() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
  });

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await authService.register(form);
      alert("User registered successfully!");
    } catch (err) {
      alert("Registration failed");
    }
  };

  return (
    <div className="flex h-screen items-center justify-center bg-gray-100">
      <form
        onSubmit={handleSubmit}
        className="bg-white p-6 rounded-xl shadow-md w-96"
      >
        <h2 className="text-2xl font-bold mb-4">Register</h2>
        <input
          type="text"
          name="name"
          placeholder="Full name"
          value={form.name}
          onChange={handleChange}
          className="border p-2 w-full mb-3 rounded"
          required
        />
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
          className="bg-green-500 text-white py-2 w-full rounded hover:bg-green-600"
        >
          Sign Up
        </button>
      </form>
    </div>
  );
}
