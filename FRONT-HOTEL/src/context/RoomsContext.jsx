// src/context/RoomsContext.jsx
import { createContext, useContext, useEffect, useMemo, useState } from "react";
import roomsService from "../services/rooms";

const RoomsContext = createContext();

export const RoomsProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState(null);

  const fetchRooms = async () => {
    setLoading(true);
    setErr(null);
    try {
      const data = await roomsService.getAll();
      setRooms(Array.isArray(data) ? data : []);
    } catch (e) {
      setErr(e);
    } finally {
      setLoading(false);
    }
  };

  const addRoom = async (room) => {
    setErr(null);
    const created = await roomsService.create(room);
    setRooms((rs) => [...rs, created]);
    return created;
  };

  const editRoom = async (id, updated) => {
    setErr(null);
    const saved = await roomsService.update(id, updated);
    setRooms((rs) => rs.map((r) => (r.id === id ? saved : r)));
    return saved;
  };

  const removeRoom = async (id) => {
    setErr(null);
    await roomsService.remove(id);
    setRooms((rs) => rs.filter((r) => r.id !== id));
  };

  const setRoomImage = async (id, file) => {
    setErr(null);
    const { image_url } = await roomsService.uploadImage(id, file);
    setRooms((rs) => rs.map((r) => (r.id === id ? { ...r, image_url } : r)));
    return image_url;
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const value = useMemo(
    () => ({
      rooms,
      loading,
      error: err,
      fetchRooms,
      addRoom,
      editRoom,
      removeRoom,
      setRoomImage,
    }),
    [rooms, loading, err]
  );

  return <RoomsContext.Provider value={value}>{children}</RoomsContext.Provider>;
};

export const useRooms = () => useContext(RoomsContext);
