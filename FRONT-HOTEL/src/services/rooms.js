import api, { logAxiosError } from "./api";

const getAll = async () => {
  try {
    const res = await api.get("/rooms");
    return res.data;
  } catch (err) { logAxiosError(err, "Rooms: getAll"); }
};

const getById = async (id) => {
  try {
    const res = await api.get(`/rooms/${id}`);
    return res.data;
  } catch (err) { logAxiosError(err, "Rooms: getById"); }
};

const create = async (room) => {
  // room: { numero_habitacion, tipo, precio_noche, disponible? }
  try {
    const res = await api.post("/rooms", room);
    return res.data;
  } catch (err) { logAxiosError(err, "Rooms: create"); }
};

const update = async (id, room) => {
  try {
    const res = await api.put(`/rooms/${id}`, room);
    return res.data;
  } catch (err) { logAxiosError(err, "Rooms: update"); }
};

const remove = async (id) => {
  try {
    const res = await api.delete(`/rooms/${id}`);
    return res.data;
  } catch (err) { logAxiosError(err, "Rooms: remove"); }
};

export default { getAll, getById, create, update, remove };
