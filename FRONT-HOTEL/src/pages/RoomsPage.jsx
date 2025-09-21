import React, { useState } from "react";
import { useRooms } from "../context/RoomsContext";

const RoomsPage = () => {
  const { rooms, loading, addRoom, editRoom, removeRoom } = useRooms();
  const [form, setForm] = useState({ name: "", type: "", price: "" });
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      editRoom(editingId, form);
      setEditingId(null);
    } else {
      addRoom(form);
    }
    setForm({ name: "", type: "", price: "" });
  };

  const handleEdit = (room) => {
    setForm({ name: room.name, type: room.type, price: room.price });
    setEditingId(room.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to delete this room?")) removeRoom(id);
  };

  if (loading) return <p>Loading rooms...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Rooms Management</h1>

      <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
        <input name="name" placeholder="Name" value={form.name} onChange={handleChange} />
        <input name="type" placeholder="Type" value={form.type} onChange={handleChange} />
        <input name="price" type="number" placeholder="Price" value={form.price} onChange={handleChange} />
        <button type="submit">{editingId ? "Update" : "Add"}</button>
        {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ name: "", type: "", price: "" }); }}>Cancel</button>}
      </form>

      <ul>
        {rooms.map((room) => (
          <li key={room.id}>
            {room.name} - {room.type} - ${room.price}{" "}
            <button onClick={() => handleEdit(room)}>Edit</button>
            <button onClick={() => handleDelete(room.id)}>Delete</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default RoomsPage;
