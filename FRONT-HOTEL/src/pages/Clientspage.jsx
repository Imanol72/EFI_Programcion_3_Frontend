import React, { useState } from "react";
import { useClients } from "../context/ClientsContext";

const ClientsPage = () => {
  const { clients, loading, addClient, editClient, removeClient } = useClients();
  const [form, setForm] = useState({ name: "", email: "" });
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      editClient(editingId, form);
      setEditingId(null);
    } else {
      addClient(form);
    }
    setForm({ name: "", email: "" });
  };

  const handleEdit = (client) => {
    setForm({ name: client.name, email: client.email });
    setEditingId(client.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this client?")) removeClient(id);
  };

  if (loading) return <p>Loading clients...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Clients Management</h1>

      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="email" placeholder="Email" value={form.email} onChange={handleChange} />
        <button type="submit">{editingId ? "Update" : "Add"}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: "", email: "" }); }}>Cancel</button>}
      </form>

      <ul>
        {clients.map((client) => (
          <li key={client.id}>
            {client.name} - {client.email}{" "}
            <button onClick={() => handleEdit(client)}>Edit</button>
            <button onClick={() => handleDelete(client.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ClientsPage;
