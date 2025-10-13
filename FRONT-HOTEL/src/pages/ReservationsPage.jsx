import React, { useState } from "react";
import { useReservations } from "../context/ReservationsContext";
import { useAuth } from "../context/AuthContext";

const ReservationsPage = () => {
  const { reservations, loading, addReservation, editReservation, removeReservation } = useReservations();
  const { user } = useAuth();

  const [form, setForm] = useState({ room: "", date: "", guests: 1 });
  const [editingId, setEditingId] = useState(null);

  const handleChange = (e) => setForm({ ...form, [e.target.name]: e.target.value });

  const handleSubmit = (e) => {
    e.preventDefault();
    if (editingId) {
      editReservation(editingId, form);
      setEditingId(null);
    } else {
      addReservation({ ...form, user: user.id });
    }
    setForm({ room: "", date: "", guests: 1 });
  };

  const handleEdit = (res) => {
    setForm({ room: res.room, date: res.date, guests: res.guests });
    setEditingId(res.id);
  };

  const handleDelete = (id) => {
    if (window.confirm("Are you sure you want to cancel this reservation?")) removeReservation(id);
  };

  if (loading) return <p>Loading reservations...</p>;

  return (
    <div className="p-6">
      <h1 className="text-2xl font-bold mb-4">Reservations Management</h1>

      {(user.rol !== "client") && (
        <form onSubmit={handleSubmit} className="mb-6 flex gap-2">
          <input name="room" placeholder="Room" value={form.room} onChange={handleChange} />
          <input name="date" type="date" value={form.date} onChange={handleChange} />
          <input name="guests" type="number" min="1" value={form.guests} onChange={handleChange} />
          <button type="submit">{editingId ? "Update" : "Add"}</button>
          {editingId && <button type="button" onClick={() => { setEditingId(null); setForm({ room: "", date: "", guests: 1 }); }}>Cancel</button>}
        </form>
      )}

      <ul>
        {reservations.map((res) => (
          <li key={res.id}>
            Room: {res.room} | Date: {res.date} | Guests: {res.guests}{" "}
            {(user.rol !== "client") && (
              <>
                <button onClick={() => handleEdit(res)}>Edit</button>
                <button onClick={() => handleDelete(res.id)}>Cancel</button>
              </>
            )}
          </li>
        ))}
      </ul>
    </div>
  );
};

export default ReservationsPage;