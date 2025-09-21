import { createContext, useContext, useState, useEffect } from "react";
import reservationsService from "../services/reservations";

const ReservationsContext = createContext();

export const ReservationsProvider = ({ children }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchReservations = async () => {
    setLoading(true);
    try {
      const data = await reservationsService.getAll();
      setReservations(data);
    } catch (err) {
      console.error("Error fetching reservations:", err);
    } finally {
      setLoading(false);
    }
  };

  const addReservation = async (res) => {
    try {
      const newRes = await reservationsService.create(res);
      setReservations([...reservations, newRes]);
    } catch (err) {
      console.error("Error adding reservation:", err);
    }
  };

  const editReservation = async (id, updated) => {
    try {
      const updatedRes = await reservationsService.update(id, updated);
      setReservations(reservations.map(r => (r.id === id ? updatedRes : r)));
    } catch (err) {
      console.error("Error updating reservation:", err);
    }
  };

  const removeReservation = async (id) => {
    try {
      await reservationsService.remove(id);
      setReservations(reservations.filter(r => r.id !== id));
    } catch (err) {
      console.error("Error deleting reservation:", err);
    }
  };

  useEffect(() => {
    fetchReservations();
  }, []);

  return (
    <ReservationsContext.Provider value={{ reservations, loading, addReservation, editReservation, removeReservation }}>
      {children}
    </ReservationsContext.Provider>
  );
};

export const useReservations = () => useContext(ReservationsContext);
