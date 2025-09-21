import axios from "axios";

const API_URL = "http://localhost:8000/api/rooms";

const getAll = async () => {
  const res = await axios.get(API_URL);
  return res.data;
};

const getById = async (id) => {
  const res = await axios.get(`${API_URL}/${id}/`);
  return res.data;
};

const create = async (room) => {
  const res = await axios.post(API_URL, room);
  return res.data;
};

const update = async (id, room) => {
  const res = await axios.put(`${API_URL}/${id}/`, room);
  return res.data;
};

const remove = async (id) => {
  const res = await axios.delete(`${API_URL}/${id}/`);
  return res.data;
};

export default {
  getAll,
  getById,
  create,
  update,
  remove,
};
