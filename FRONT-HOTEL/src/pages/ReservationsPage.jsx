import React, { useEffect, useMemo, useState } from "react";
import { useReservations } from "../context/ReservationsContext";
import { useRooms } from "../context/RoomsContext";
import { useClients } from "../context/ClientsContext";
import { useAuth } from "../context/AuthContext";
import reservationsService from "../services/reservations";
import NiceSelect from "../components/NiceSelect";

const ESTADOS = [
  { value: "pendiente", label: "Pendiente" },
  { value: "confirmada", label: "Confirmada" },
  { value: "cancelada", label: "Cancelada" },
  { value: "finalizada", label: "Finalizada" },
];

const hoy = () => new Date().toISOString().slice(0, 10);

const diffDays = (a, b) => {
  if (!a || !b) return 0;
  const d1 = new Date(a + "T00:00:00");
  const d2 = new Date(b + "T00:00:00");
  return Math.max(0, Math.ceil((d2 - d1) / (1000 * 60 * 60 * 24)));
};

export default function ReservationsPage() {
  const { reservations, loading, errorMsg, filters, setFilters, fetchReservations, addReservation, editReservation, removeReservation } = useReservations();
  const { rooms, loading: loadingRooms } = useRooms();
  const { clients, loading: loadingClients } = useClients();
  const { user } = useAuth(); // { id, role, nombre, apellido, ... }

  const isCliente = (user?.role || "").toLowerCase() === "cliente";

  const [form, setForm] = useState({
    id_cliente: "",
    id_habitacion: "",
    check_in: hoy(),
    check_out: hoy(),
    estado: "pendiente",
    notas: "",
  });
  const [editingId, setEditingId] = useState(null);
  const [submitError, setSubmitError] = useState(null);

  const [conflict, setConflict] = useState(null);
  const [checking, setChecking] = useState(false);

  // si es cliente logueado, fijamos id_cliente y ocultamos el campo
  useEffect(() => {
    if (isCliente && user?.id) {
      setForm(f => ({ ...f, id_cliente: String(user.id) }));
    }
  }, [isCliente, user?.id]);

  const roomsById = useMemo(() => {
    const map = new Map();
    (rooms || []).forEach(r => map.set(r.id, r));
    return map;
  }, [rooms]);

  const roomSelected = roomsById.get(Number(form.id_habitacion));
  const noches = diffDays(form.check_in, form.check_out);
  const total = noches * Number(roomSelected?.precio_noche || 0);

  useEffect(() => {
    if (form.check_in && form.check_out && form.check_out <= form.check_in) {
      const d = new Date(form.check_in + "T00:00:00"); d.setDate(d.getDate() + 1);
      setForm((f) => ({ ...f, check_out: d.toISOString().slice(0, 10) }));
    }
  }, [form.check_in]);

  const onChange = (e) => {
    const { name, value } = e.target;
    setForm(f => ({ ...f, [name]: value }));
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    setSubmitError(null);
    try {
      const payload = {
        // cliente opcional (si es cliente, ya viene fijado)
        ...(form.id_cliente ? { id_cliente: Number(form.id_cliente) } : {}),
        id_habitacion: Number(form.id_habitacion),
        check_in: form.check_in,
        check_out: form.check_out,
        estado: form.estado,
        ...(form.notas ? { notas: form.notas } : {}),
      };
      if (editingId) {
        await editReservation(editingId, payload);
        setEditingId(null);
      } else {
        await addReservation(payload);
      }
      setForm({
        id_cliente: isCliente && user?.id ? String(user.id) : "",
        id_habitacion: "",
        check_in: hoy(),
        check_out: hoy(),
        estado: "pendiente",
        notas: "",
      });
      setConflict(null);
    } catch (e2) {
      setSubmitError(e2?.response?.data?.message || "Error guardando la reserva");
    }
  };

  const onEdit = (r) => {
    setEditingId(r.id);
    setForm({
      id_cliente: r.id_cliente ? String(r.id_cliente) : (isCliente && user?.id ? String(user.id) : ""),
      id_habitacion: String(r.id_habitacion || ""),
      check_in: r.check_in,
      check_out: r.check_out,
      estado: r.estado,
      notas: r.notas || "",
    });
    window.scrollTo({ top: 0, behavior: "smooth" });
  };

  const onDelete = async (id) => {
    if (window.confirm("¿Eliminar esta reserva?")) {
      await removeReservation(id);
    }
  };

  const applyFilters = (e) => {
    e.preventDefault();
    fetchReservations({
      ...filters,
      roomId: filters.roomId || undefined,
      status: filters.status || undefined,
      from: filters.from || undefined,
      to: filters.to || undefined,
    });
  };

  // chequeo “en vivo” de disponibilidad
  useEffect(() => {
    let cancelled = false;
    const check = async () => {
      setConflict(null);
      if (!form.id_habitacion || !form.check_in || !form.check_out) return;
      if (form.check_out <= form.check_in) return;

      setChecking(true);
      try {
        const conflicts = await reservationsService.list({
          from: form.check_in,
          to: form.check_out,
          roomId: form.id_habitacion,
        });
        const clash = conflicts.find(c => c.id !== editingId && (c.estado === "pendiente" || c.estado === "confirmada"));
        if (!cancelled) setConflict(clash || null);
      } catch {}
      finally {
        if (!cancelled) setChecking(false);
      }
    };
    check();
    return () => { cancelled = true; };
  }, [form.id_habitacion, form.check_in, form.check_out, editingId]);

  const clientOptions = useMemo(() => {
    return [
      { value: "", label: "Seleccionar cliente…" },
      ...clients.map(c => ({
        value: String(c.id),
        label: `${c.nombre} ${c.apellido}${c.email ? " · " + c.email : ""}`,
      })),
    ];
  }, [clients]);

  const roomOptions = useMemo(() => {
    // Formato: "Individual — $1500 (cap 1) · Hab 9"
    return [
      { value: "", label: "Seleccionar habitación…" },
      ...rooms.map(r => ({
        value: String(r.id),
        label: `${r.tipo} — $${r.precio_noche} (cap ${r.capacidad}) · Hab ${r.numero_habitacion || r.id}`,
      })),
    ];
  }, [rooms]);

  return (
    <div className="p-6 rooms-page">
      <h1 className="text-2xl font-bold mb-3">Reservas</h1>

      {/* Formulario */}
      <div className="card-elevated mb-6" style={{ padding: 14 }}>
        <form onSubmit={onSubmit} className="grid gap-3 rooms-form-grid" style={{ gridTemplateColumns: "1.5fr 1fr 1fr 1fr 1fr", alignItems: "end" }}>
          <div className="field">
            <label>Habitación</label>
            <NiceSelect
              className="ns-dark"
              name="id_habitacion"
              value={form.id_habitacion}
              options={roomOptions}
              onChange={(e) => setForm(f => ({ ...f, id_habitacion: e.target.value }))}
            />
          </div>

          {!isCliente ? (
            <div className="field">
              <label>Cliente (opcional)</label>
              <NiceSelect
                className="ns-dark"
                name="id_cliente"
                value={form.id_cliente}
                options={clientOptions}
                onChange={(e) => setForm(f => ({ ...f, id_cliente: e.target.value }))}
              />
            </div>
          ) : (
            <div className="field">
              <label>Cliente</label>
              <div className="p-inputtext" style={{ display: "flex", alignItems: "center" }}>
                {user?.nombre ? `${user.nombre} ${user.apellido || ""}`.trim() : `ID ${user?.id}`}
              </div>
            </div>
          )}

          <div className="field">
            <label>Check-in</label>
            <input type="date" name="check_in" className="p-inputtext" value={form.check_in} onChange={onChange} />
          </div>

          <div className="field">
            <label>Check-out</label>
            <input type="date" name="check_out" className="p-inputtext" value={form.check_out} onChange={onChange} />
          </div>

          <div className="field">
            <label>Estado</label>
            <NiceSelect
              className="ns-dark"
              name="estado"
              value={form.estado}
              options={ESTADOS.map(s => ({ value: s.value, label: s.label }))}
              onChange={(e) => setForm(f => ({ ...f, estado: e.target.value }))}
            />
          </div>

          <div className="field" style={{ gridColumn: "1 / span 4" }}>
            <label>Notas (opcional)</label>
            <input name="notas" className="p-inputtext" placeholder="Observaciones…" value={form.notas} onChange={onChange} />
          </div>

          <div className="field">
            <label>Total</label>
            <input className="p-inputtext" value={total ? `$${total}` : "-"} readOnly />
          </div>

          {checking && <div style={{ gridColumn: "1 / -1", color: "#94a3b8" }}>Comprobando disponibilidad…</div>}
          {conflict && (
            <div style={{ gridColumn: "1 / -1", color: "#fca5a5", fontWeight: 600 }}>
              Se solapa con la reserva #{conflict.id} ({conflict.check_in} → {conflict.check_out}).
            </div>
          )}
          {(submitError || errorMsg) && (
            <div className="text-red-400" style={{ gridColumn: "1 / -1" }}>
              {submitError || errorMsg}
            </div>
          )}

          <div className="flex gap-2">
            <button type="submit" className="p-button p-button-rounded" disabled={!!conflict || checking}>
              {editingId ? "Actualizar" : "Crear"}
            </button>
            {editingId && (
              <button
                type="button"
                className="p-button p-button-rounded p-button-secondary"
                onClick={() => {
                  setEditingId(null);
                  setForm({
                    id_cliente: isCliente && user?.id ? String(user.id) : "",
                    id_habitacion: "",
                    check_in: hoy(),
                    check_out: hoy(),
                    estado: "pendiente",
                    notas: "",
                  });
                  setConflict(null);
                }}
              >
                Cancelar
              </button>
            )}
            </div> 
        </form>

        {/* Info de la habitación seleccionada */}
        {roomSelected && (
          <div className="mt-3 text-sm" style={{ opacity: .85 }}>
            Seleccionada: <strong>{roomSelected.tipo}</strong> — ${roomSelected.precio_noche} (cap {roomSelected.capacidad}) · Hab {roomSelected.numero_habitacion || roomSelected.id}
          </div>
        )}
      </div>

      {/* Filtros */}
      <form onSubmit={applyFilters} className="card-elevated mb-4" style={{ padding: 14 }}>
        <div className="grid gap-3" style={{ gridTemplateColumns: "repeat(6, 1fr)" }}>
          <div>
            <label>Desde</label>
            <input type="date" className="p-inputtext" value={filters.from} onChange={e => setFilters(f => ({ ...f, from: e.target.value }))} />
          </div>
          <div>
            <label>Hasta</label>
            <input type="date" className="p-inputtext" value={filters.to} onChange={e => setFilters(f => ({ ...f, to: e.target.value }))} />
          </div>
          <div>
            <label>Habitación</label>
            <NiceSelect
              className="ns-dark"
              name="filter_room"
              value={filters.roomId}
              options={[
                { value: "", label: "Todas" },
                ...rooms.map(r => ({
                  value: String(r.id),
                  label: `${r.tipo} — $${r.precio_noche} (cap ${r.capacidad}) · Hab ${r.numero_habitacion || r.id}`,
                })),
              ]}
              onChange={(e) => setFilters(f => ({ ...f, roomId: e.target.value }))}
            />
          </div>
          <div>
            <label>Estado</label>
            <NiceSelect
              className="ns-dark"
              name="filter_status"
              value={filters.status}
              options={[{ value: "", label: "Todos" }, ...ESTADOS]}
              onChange={(e) => setFilters(f => ({ ...f, status: e.target.value }))}
            />
          </div>
          <div className="flex items-end">
            <button className="p-button p-button-rounded" type="submit">Filtrar</button>
          </div>
        </div>
      </form>

      {/* Tabla */}
      {loading || loadingRooms || loadingClients ? (
        <p>Cargando...</p>
      ) : (
        <div className="card-elevated table-clean" style={{ padding: 14 }}>
          <table className="w-full">
            <thead>
              <tr>
                <th align="left">#</th>
                <th align="left">Habitación</th>
                <th align="left">Cliente</th>
                <th align="left">Check-in</th>
                <th align="left">Check-out</th>
                <th align="left">Estado</th>
                <th align="left">Total</th>
                <th></th>
              </tr>
            </thead>
            <tbody>
              {reservations.map(r => (
                <tr key={r.id}>
                  <td>#{r.id}</td>
                  <td>{r.room ? `${r.room.tipo} — $${r.room.precio_noche} (cap ${r.room.capacidad}) · Hab ${r.room.numero_habitacion || r.id_habitacion}` : `Hab ${r.id_habitacion}`}</td>
                  <td>{r.client ? `${r.client.nombre} ${r.client.apellido}` : "-"}</td>
                  <td>{r.check_in}</td>
                  <td>{r.check_out}</td>
                  <td><span className="type-chip">{r.estado}</span></td>
                  <td>${r.total_calculado || 0}</td>
                  <td>
                    <button className="p-button p-button-rounded" onClick={() => onEdit(r)}>Editar</button>{" "}
                    <button className="p-button p-button-rounded" onClick={() => onDelete(r.id)}>Borrar</button>
                  </td>
                </tr>
              ))}
              {!reservations.length && (
                <tr><td colSpan={8} style={{ opacity: .75, padding: "8px 0" }}>Sin registros</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
