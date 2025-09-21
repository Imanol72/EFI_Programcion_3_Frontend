// src/services/users.js
import api from "./api";

const getAll = async () => {
  const res = await api.get("/users");
  return res.data;
};

const getById = async (id) => {
  const res = await api.get(`/users/${id}`);
  return res.data;
};

const create = async (user) => {
  const res = await api.post("/users", user);
  return res.data;
};

const update = async (id, user) => {
  const res = await api.put(`/users/${id}`, user);
  return res.data;
};

const remove = async (id) => {
  const res = await api.delete(`/users/${id}`);
  return res.data;
};

export default { getAll, getById, create, update, remove };
