import { createContext, useContext, useState, useEffect } from "react";
import roomsService from "../services/rooms";

const RoomsContext = createContext();

export const RoomsProvider = ({ children }) => {
  const [rooms, setRooms] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRooms = async () => {
    setLoading(true);
    try {
      const data = await roomsService.getAll();
      setRooms(data);
    } catch (err) {
      console.error("Error fetching rooms:", err);
    } finally {
      setLoading(false);
    }
  };

  const addRoom = async (room) => {
    try {
      const newRoom = await roomsService.create(room);
      setRooms([...rooms, newRoom]);
    } catch (err) {
      console.error("Error adding room:", err);
    }
  };

  const editRoom = async (id, updated) => {
    try {
      const updatedRoom = await roomsService.update(id, updated);
      setRooms(rooms.map(r => (r.id === id ? updatedRoom : r)));
    } catch (err) {
      console.error("Error updating room:", err);
    }
  };

  const removeRoom = async (id) => {
    try {
      await roomsService.remove(id);
      setRooms(rooms.filter(r => r.id !== id));
    } catch (err) {
      console.error("Error deleting room:", err);
    }
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  return (
    <RoomsContext.Provider value={{ rooms, loading, addRoom, editRoom, removeRoom }}>
      {children}
    </RoomsContext.Provider>
  );
};

export const useRooms = () => useContext(RoomsContext);
