import api, { logAxiosError } from "./api";

const getAll = async () => {
  try {
    const res = await api.get("/clients");
    return res.data;
  } catch (err) { logAxiosError(err, "Clients: getAll"); }
};

const getById = async (id) => {
  try {
    const res = await api.get(`/clients/${id}`);
    return res.data;
  } catch (err) { logAxiosError(err, "Clients: getById"); }
};

const create = async (client) => {
  // client: { documento_identidad, telefono?, id_usuario? }
  try {
    const res = await api.post("/clients", client);
    return res.data;
  } catch (err) { logAxiosError(err, "Clients: create"); }
};

const update = async (id, client) => {
  try {
    const res = await api.put(`/clients/${id}`, client);
    return res.data;
  } catch (err) { logAxiosError(err, "Clients: update"); }
};

const remove = async (id) => {
  try {
    const res = await api.delete(`/clients/${id}`);
    return res.data;
  } catch (err) { logAxiosError(err, "Clients: remove"); }
};

export default { getAll, getById, create, update, remove };
