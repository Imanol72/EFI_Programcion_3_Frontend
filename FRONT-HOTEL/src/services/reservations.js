import api, { logAxiosError } from "./api";

const list = async (params = {}) => {
  try {
    const res = await api.get("/reservations", { params });
    return res.data;
  } catch (err) { logAxiosError(err, "Reservations: list"); throw err; }
};

const getById = async (id) => {
  try {
    const res = await api.get(`/reservations/${id}`);
    return res.data;
  } catch (err) { logAxiosError(err, "Reservations: getById"); throw err; }
};

const create = async (payload) => {
  try {
    const res = await api.post("/reservations", payload);
    return res.data;
  } catch (err) { logAxiosError(err, "Reservations: create"); throw err; }
};

const update = async (id, payload) => {
  try {
    const res = await api.put(`/reservations/${id}`, payload);
    return res.data;
  } catch (err) { logAxiosError(err, "Reservations: update"); throw err; }
};

const remove = async (id) => {
  try {
    const res = await api.delete(`/reservations/${id}`);
    return res.data;
  } catch (err) { logAxiosError(err, "Reservations: remove"); throw err; }
};

export default { list, getById, create, update, remove };
