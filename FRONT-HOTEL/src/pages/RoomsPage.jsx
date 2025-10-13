// src/pages/RoomsPage.jsx
import React, { useMemo, useState } from "react";
import { useRooms } from "../context/RoomsContext";
import { AMENITY_ICONS } from "../ui/amenities";
import AmenitiesChips from "../components/AmenitiesChips";
import TypeChip from "../components/TypeChip";
import Bed from "../components/icons/Bed";
import "../styles/rooms.css";
import NiceSelect from "../components/NiceSelect";

const TYPE_TO_CAP = { individual: 1, doble: 2, triple: 3, cuadruple: 4 };
const TYPE_OPTIONS = [
  { value: "individual", label: "Individual" },
  { value: "doble", label: "Doble" },
  { value: "triple", label: "Triple" },
  { value: "cuadruple", label: "Cuádruple" },
];

const EMPTY = {
  numero_habitacion: "",
  tipo: "individual",
  capacidad: 1,
  precio_noche: "",
  descripcion: "",
  amenities: [],
  disponible: true,
};

const currency = new Intl.NumberFormat("es-AR", { style: "currency", currency: "ARS", maximumFractionDigits: 0 });

function BedsRow({ count = 1 }) {
  const beds = Math.max(1, Number(count || 1));
  const max = 6;
  const visible = Math.min(beds, max);
  const extras = beds - visible;
  return (
    <div className="badges" title={`Capacidad: ${beds}`}>
      {Array.from({ length: visible }).map((_, i) => (
        <span key={i} className="badge" style={{ padding: "6px 8px" }}>
          <Bed size={16} />
        </span>
      ))}
      {extras > 0 && <span className="badge">+{extras}</span>}
    </div>
  );
}

export default function RoomsPage() {
  const { rooms, loading, error, addRoom, editRoom, removeRoom, setRoomImage } = useRooms();
  const [form, setForm] = useState(EMPTY);
  const [editingId, setEditingId] = useState(null);
  const amenityKeys = useMemo(() => Object.keys(AMENITY_ICONS), []);

  const onChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (name === "tipo") {
      const nextCap = TYPE_TO_CAP[value] ?? 1;
      setForm((f) => ({ ...f, tipo: value, capacidad: nextCap }));
      return;
    }
    if (type === "checkbox" && name === "disponible") setForm((f) => ({ ...f, disponible: checked }));
    else if (name === "capacidad" || name === "precio_noche") setForm((f) => ({ ...f, [name]: value === "" ? "" : Number(value) }));
    else setForm((f) => ({ ...f, [name]: value }));
  };

  const toggleAmenity = (key) => {
    setForm((f) => {
      const has = f.amenities.includes(key);
      return { ...f, amenities: has ? f.amenities.filter((k) => k !== key) : [...f.amenities, key] };
    });
  };

  const onSubmit = async (e) => {
    e.preventDefault();
    const payload = {
      numero_habitacion: form.numero_habitacion || null,
      tipo: form.tipo,
      capacidad: Number(form.capacidad || TYPE_TO_CAP[form.tipo] || 1),
      precio_noche: Number(form.precio_noche || 0),
      descripcion: form.descripcion || null,
      amenities: form.amenities,
      disponible: !!form.disponible,
    };
    if (!payload.tipo || !payload.precio_noche) {
      alert("Tipo y precio_noche son obligatorios.");
      return;
    }
    if (editingId) {
      await editRoom(editingId, payload);
      setEditingId(null);
    } else {
      await addRoom(payload);
    }
    setForm(EMPTY);
  };

  const onEdit = (room) => {
    setEditingId(room.id);
    setForm({
      numero_habitacion: room.numero_habitacion || "",
      tipo: (room.tipo || "individual").toLowerCase(),
      capacidad: room.capacidad ?? TYPE_TO_CAP[(room.tipo || "individual").toLowerCase()] ?? 1,
      precio_noche: room.precio_noche ?? "",
      descripcion: room.descripcion || "",
      amenities: Array.isArray(room.amenities) ? room.amenities : [],
      disponible: !!room.disponible,
    });
  };

  const onCancel = () => { setEditingId(null); setForm(EMPTY); };
  const onDelete = async (id) => { if (window.confirm("¿Eliminar la habitación?")) await removeRoom(id); };
  const onPickImage = async (id, file) => { if (file) { try { await setRoomImage(id, file); } catch { alert("No se pudo subir la imagen."); } } };

  if (loading) return <div className="rooms-page">Cargando habitaciones…</div>;
  if (error) return <div className="rooms-page">Error: {String(error?.message || "desconocido")}</div>;

  return (
    <div className="rooms-page">
      <h1 className="section-title">Rooms</h1>

      {/* FORM */}
      <form onSubmit={onSubmit} className="rooms-form-grid card-elevated">
        <div className="field">
          <label>Número de habitación (opcional)</label>
          <input className="control" name="numero_habitacion" placeholder="Ej: 101A" value={form.numero_habitacion} onChange={onChange} />
        </div>

        <div className="field">
  <label>Tipo</label>
  <NiceSelect
    name="tipo"
    value={form.tipo}
    options={[
      { value: "individual", label: "Individual" },
      { value: "doble", label: "Doble" },
      { value: "triple", label: "Triple" },
      { value: "cuadruple", label: "Cuádruple" },
    ]}
    onChange={(e, opt) => {
      const nextTipo = e.target.value;
      const map = { individual: 1, doble: 2, triple: 3, cuadruple: 4 };
      const nextCap = map[nextTipo] ?? 1;
      setForm((f) => ({ ...f, tipo: nextTipo, capacidad: nextCap }));
    }}
  />
</div>


        <div className="field">
          <label>Capacidad</label>
          <input className="control" name="capacidad" type="number" min={1} placeholder="1" value={form.capacidad} onChange={onChange} />
          <small style={{ color: "#a7adbb" }}>Se ajusta automáticamente según el tipo (podés modificarlo).</small>
        </div>

        <div className="field">
          <label>Precio por noche</label>
          <input className="control" name="precio_noche" type="number" min={0} placeholder="0" value={form.precio_noche} onChange={onChange} required />
        </div>

        <div className="field col-span-2">
          <label>Descripción</label>
          <input className="control" name="descripcion" placeholder="Breve descripción" value={form.descripcion} onChange={onChange} />
        </div>

        <div className="field checkbox">
          <label className="inline">
            <input type="checkbox" name="disponible" checked={form.disponible} onChange={onChange} />
            <span>Disponible</span>
          </label>
        </div>

        {/* Amenities */}
        <div className="field col-span-3">
          <label>Amenities</label>
          <div className="amenities-grid">
            {amenityKeys.map((key) => {
              const a = AMENITY_ICONS[key];
              const checked = form.amenities.includes(key);
              return (
                <label key={key} className={`amenity-pill ${checked ? "on" : ""}`}>
                  <input type="checkbox" checked={checked} onChange={() => toggleAmenity(key)} />
                  <span>{a?.label || key}</span>
                </label>
              );
            })}
          </div>
        </div>

        <div className="actions col-span-3">
          <button type="submit" className="btn solid">
            {editingId ? "Actualizar" : "Agregar"}
          </button>
          {editingId && (
            <button type="button" className="btn ghost" onClick={onCancel}>
              Cancelar
            </button>
          )}
        </div>
      </form>

      {/* LISTA */}
      <div className="rooms-list">
        {rooms.map((room) => (
          <article key={room.id} className="room-card card-elevated">
            {/* thumb */}
            <div className="thumb-col">
              {room.image_url ? (
                <img src={room.image_url} alt="room" className="room-thumb-lg" />
              ) : (
                <div className="room-thumb--empty">Sin foto</div>
              )}
              <label className="filepick mt-2">
                <span>Subir foto</span>
                <input type="file" accept="image/jpeg,image/png,image/webp" onChange={(e) => onPickImage(room.id, e.target.files?.[0])} />
              </label>
            </div>

            {/* info */}
            <div className="info-col">
              <div className="room-title">
                #{room.numero_habitacion || "—"} · <TypeChip value={room.tipo} /> · cap {room.capacidad}
              </div>
              <div className="room-sub">
                <span className="price">{currency.format(room.precio_noche || 0)}</span>
                {room.descripcion ? <> · {room.descripcion}</> : null}
              </div>

              <BedsRow count={room.capacidad} />

              <div className="mt-2">
                <AmenitiesChips list={Array.isArray(room.amenities) ? room.amenities : []} />
              </div>

              <label className="available-toggle">
                <input type="checkbox" checked={!!room.disponible} onChange={(e) => editRoom(room.id, { disponible: e.target.checked })} />
                <span>Disponible</span>
              </label>

              <div className={`badge ${room.disponible ? "ok" : "no"}`}>
                <span className="dot" />
                {room.disponible ? "Disponible" : "No disponible"}
              </div>
            </div>

            {/* acciones */}
            <div className="actions-col">
              <button className="btn ghost" onClick={() => onEdit(room)}>Editar</button>
              <button className="btn danger" onClick={() => onDelete(room.id)}>Eliminar</button>
            </div>
          </article>
        ))}
      </div>
    </div>
  );
}
