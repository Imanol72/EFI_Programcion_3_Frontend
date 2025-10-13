import api, { logAxiosError } from "./api";

const getAll = async () => {
  try {
    const res = await api.get("/reservations");
    return res.data;
  } catch (err) { logAxiosError(err, "Reservations: getAll"); }
};

const getById = async (id) => {
  try {
    const res = await api.get(`/reservations/${id}`);
    return res.data;
  } catch (err) { logAxiosError(err, "Reservations: getById"); }
};

const create = async (reservation) => {
  // reservation: { fecha_inicio, fecha_fin, estado?, id_cliente, id_habitacion, id_usuario }
  try {
    const res = await api.post("/reservations", reservation);
    return res.data;
  } catch (err) { logAxiosError(err, "Reservations: create"); }
};

const update = async (id, reservation) => {
  try {
    const res = await api.put(`/reservations/${id}`, reservation);
    return res.data;
  } catch (err) { logAxiosError(err, "Reservations: update"); }
};

const remove = async (id) => {
  try {
    const res = await api.delete(`/reservations/${id}`);
    return res.data;
  } catch (err) { logAxiosError(err, "Reservations: remove"); }
};

export default { getAll, getById, create, update, remove };