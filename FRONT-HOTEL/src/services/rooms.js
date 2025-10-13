// src/services/rooms.js
import api, { logAxiosError } from "./api";

const base = "/rooms"; // api ya debería tener el prefix /api

const getAll = async () => {
  try {
    const { data } = await api.get(base);
    return data;
  } catch (err) {
    logAxiosError?.(err, "Rooms: getAll");
    throw err;
  }
};

const getById = async (id) => {
  try {
    const { data } = await api.get(`${base}/${id}`);
    return data;
  } catch (err) {
    logAxiosError?.(err, "Rooms: getById");
    throw err;
  }
};

const create = async (room) => {
  try {
    const { data } = await api.post(base, room);
    return data;
  } catch (err) {
    logAxiosError?.(err, "Rooms: create");
    throw err;
  }
};

const update = async (id, room) => {
  try {
    const { data } = await api.put(`${base}/${id}`, room);
    return data;
  } catch (err) {
    logAxiosError?.(err, "Rooms: update");
    throw err;
  }
};

const remove = async (id) => {
  try {
    const { data } = await api.delete(`${base}/${id}`);
    return data;
  } catch (err) {
    logAxiosError?.(err, "Rooms: remove");
    throw err;
  }
};

const uploadImage = async (id, file) => {
  try {
    const form = new FormData();
    form.append("image", file);
    const { data } = await api.post(`${base}/${id}/image`, form, {
      headers: { "Content-Type": "multipart/form-data" },
    });
    return data; // { image_url, roomId }
  } catch (err) {
    logAxiosError?.(err, "Rooms: uploadImage");
    throw err;
  }
};

export default { getAll, getById, create, update, remove, uploadImage };
