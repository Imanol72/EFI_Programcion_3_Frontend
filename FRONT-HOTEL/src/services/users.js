import api, { logAxiosError } from "./api";

const getAll = async () => {
  try {
    const res = await api.get("/users");
    return res.data;
  } catch (err) { logAxiosError(err, "Users: getAll"); }
};

const getById = async (id) => {
  try {
    const res = await api.get(`/users/${id}`);
    return res.data;
  } catch (err) { logAxiosError(err, "Users: getById"); }
};

const create = async (user) => {
  // user: { username, password } si usás la misma tabla
  try {
    const res = await api.post("/users", user);
    return res.data;
  } catch (err) { logAxiosError(err, "Users: create"); }
};

const update = async (id, user) => {
  try {
    const res = await api.put(`/users/${id}`, user);
    return res.data;
  } catch (err) { logAxiosError(err, "Users: update"); }
};

const remove = async (id) => {
  try {
    const res = await api.delete(`/users/${id}`);
    return res.data;
  } catch (err) { logAxiosError(err, "Users: remove"); }
};

export default { getAll, getById, create, update, remove };
  