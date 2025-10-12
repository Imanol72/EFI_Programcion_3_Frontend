// src/pages/ClientsPage.jsx
import { useEffect, useState, useCallback, useMemo } from "react";
import { Card } from "primereact/card";
import { DataTable } from "primereact/datatable";
import { Column } from "primereact/column";
import { InputText } from "primereact/inputtext";
import { Button } from "primereact/button";
import { Dialog } from "primereact/dialog";
import api from "../services/api";

export default function ClientsPage() {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [visible, setVisible] = useState(false);
  const [saving, setSaving] = useState(false);

  const [form, setForm] = useState({
    id: null,
    nombre: "",
    documento_identidad: "",
    telefono: "",
  });

  const load = useCallback(async () => {
    setLoading(true);
    try {
      const res = await api.get("/clients");
      const raw = res?.data ?? res;
      const list = Array.isArray(raw) ? raw : Array.isArray(raw?.data) ? raw.data : [];
      setClients(list);
      setError("");
    } catch (e) {
      setError(e?.response?.data?.message || e.message);
      setClients([]);
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => { load(); }, [load]);

  const openForm = useCallback(
    (client = { id: null, nombre: "", documento_identidad: "", telefono: "" }) => {
      setForm(client);
      setVisible(true);
    },
    []
  );

  const saveClient = useCallback(async () => {
    if (!form.documento_identidad?.trim()) return alert("Documento es obligatorio");
    setSaving(true);
    try {
      if (form.id) {
        await api.put(`/clients/${form.id}`, form);
      } else {
        await api.post("/clients", form);
      }
      setVisible(false);
      setForm({ id: null, nombre: "", documento_identidad: "", telefono: "" });
      load();
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    } finally {
      setSaving(false);
    }
  }, [form, load]);

  const deleteClient = useCallback(async (row) => {
    if (!window.confirm(`¿Eliminar cliente ${row.documento_identidad}?`)) return;
    try {
      await api.delete(`/clients/${row.id}`);
      load();
    } catch (e) {
      alert(e?.response?.data?.message || e.message);
    }
  }, [load]);

  // ✅ templates memoizados (evita nuevas funciones en cada render)
  const userTemplate = useCallback((r) => r?.usuario?.username ?? "-", []);
  const reservasTemplate = useCallback((r) => (Array.isArray(r?.reservas) ? r.reservas.length : 0), []);
  const actionsTemplate = useCallback((row) => (
    <div className="flex gap-2">
      <Button icon="pi pi-pencil" rounded text onClick={() => openForm(row)} />
      <Button icon="pi pi-trash" rounded text severity="danger" onClick={() => deleteClient(row)} />
    </div>
  ), [openForm, deleteClient]);

  // ✅ columnas estáticas (no cambian de identidad)
  const columns = useMemo(() => ([
    <Column key="id" field="id" header="ID" style={{ width: "4rem" }} />,
    <Column key="nombre" field="nombre" header="Nombre" />,
    <Column key="doc" field="documento_identidad" header="Documento" />,
    <Column key="tel" field="telefono" header="Teléfono" />,
    <Column key="usr" header="Usuario" body={userTemplate} />,
    <Column key="res" header="Reservas" body={reservasTemplate} />,
    <Column key="act" header="Acciones" body={actionsTemplate} style={{ width: "8rem" }} />,
  ]), [userTemplate, reservasTemplate, actionsTemplate]);

  return (
    <div className="p-3">
      <Card title="Clientes">
        <div className="flex justify-content-between mb-3">
          <Button label="Nuevo Cliente" icon="pi pi-plus" onClick={() => openForm()} />
        </div>

        {error && <div className="p-error mb-3">{error}</div>}

        <DataTable
          value={clients}
          dataKey="id"              // ✅ clave estable
          loading={loading}
          paginator
          rows={10}
          // responsiveLayout="scroll" // ⚠️ si en tu setup causa loop, dejalo comentado
        >
          {columns}
        </DataTable>

        <Dialog
          header={form.id ? "Editar Cliente" : "Nuevo Cliente"}
          visible={visible}
          onHide={() => {
            setVisible(false);
            setForm({ id: null, nombre: "", documento_identidad: "", telefono: "" });
          }}
          style={{ width: "420px" }}
          footer={
            <div className="flex justify-content-end gap-2">
              <Button label="Cancelar" text onClick={() => setVisible(false)} />
              <Button label="Guardar" onClick={saveClient} loading={saving} />
            </div>
          }
        >
          <div className="flex flex-column gap-3">
            <span className="p-float-label">
              <InputText
                id="nombre"
                value={form.nombre}
                onChange={(e) => setForm({ ...form, nombre: e.target.value })}
              />
              <label htmlFor="nombre">Nombre</label>
            </span>

            <span className="p-float-label">
              <InputText
                id="documento_identidad"
                value={form.documento_identidad}
                onChange={(e) => setForm({ ...form, documento_identidad: e.target.value })}
                required
              />
              <label htmlFor="documento_identidad">Documento</label>
            </span>

            <span className="p-float-label">
              <InputText
                id="telefono"
                value={form.telefono}
                onChange={(e) => setForm({ ...form, telefono: e.target.value })}
              />
              <label htmlFor="telefono">Teléfono</label>
            </span>
          </div>
        </Dialog>
      </Card>
    </div>
  );
}
