import { createContext, useContext, useEffect, useState } from "react";
import reservationsService from "../services/reservations";

const ReservationsContext = createContext();

export const ReservationsProvider = ({ children }) => {
  const [reservations, setReservations] = useState([]);
  const [loading, setLoading] = useState(true);
  const [errorMsg, setErrorMsg] = useState(null);
  const [filters, setFilters] = useState({ from: "", to: "", roomId: "", status: "" });

  const fetchReservations = async (params = {}) => {
    setLoading(true);
    setErrorMsg(null);
    try {
      const data = await reservationsService.list(params);
      setReservations(data || []);
    } catch (e) {
      setErrorMsg(e?.response?.data?.message || "Error cargando reservas");
    } finally {
      setLoading(false);
    }
  };

  const addReservation = async (payload) => {
    setErrorMsg(null);
    const created = await reservationsService.create(payload);
    // refrescamos con filtros actuales
    await fetchReservations(filters);
    return created;
  };

  const editReservation = async (id, payload) => {
    setErrorMsg(null);
    const updated = await reservationsService.update(id, payload);
    await fetchReservations(filters);
    return updated;
  };

  const removeReservation = async (id) => {
    setErrorMsg(null);
    await reservationsService.remove(id);
    await fetchReservations(filters);
  };

  useEffect(() => {
    fetchReservations(filters);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <ReservationsContext.Provider
      value={{
        reservations, loading, errorMsg,
        filters, setFilters, fetchReservations,
        addReservation, editReservation, removeReservation,
      }}
    >
      {children}
    </ReservationsContext.Provider>
  );
};

export const useReservations = () => useContext(ReservationsContext);
