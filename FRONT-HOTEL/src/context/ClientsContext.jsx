// src/context/ClientsContext.jsx
import { createContext, useContext, useState, useEffect } from "react";
import clientsService from "../services/clients";

const ClientsContext = createContext();

export const ClientsProvider = ({ children }) => {
  const [clients, setClients] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchClients = async () => {
    setLoading(true);
    try {
      const data = await clientsService.getAll();
      setClients(data);
    } catch (err) {
      console.error("Error fetching clients:", err);
    } finally {
      setLoading(false);
    }
  };

  const addClient = async (client) => {
    try {
      const newClient = await clientsService.create(client);
      setClients([...clients, newClient]);
    } catch (err) {
      console.error("Error adding client:", err);
    }
  };

  const editClient = async (id, updatedClient) => {
    try {
      const updated = await clientsService.update(id, updatedClient);
      setClients(clients.map(c => (c.id === id ? updated : c)));
    } catch (err) {
      console.error("Error updating client:", err);
    }
  };

  const removeClient = async (id) => {
    try {
      await clientsService.remove(id);
      setClients(clients.filter(c => c.id !== id));
    } catch (err) {
      console.error("Error deleting client:", err);
    }
  };

  useEffect(() => {
    fetchClients();
  }, []);

  return (
    <ClientsContext.Provider value={{ clients, loading, addClient, editClient, removeClient }}>
      {children}
    </ClientsContext.Provider>
  );
};

export const useClients = () => useContext(ClientsContext);
