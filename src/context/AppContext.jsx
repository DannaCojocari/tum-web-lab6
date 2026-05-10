import { createContext, useState, useEffect, useContext } from "react";
import { getDestinations } from "../services/api";
import { AuthContext } from "./AuthContext";

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    if (!token) return;
    const fetchDestinations = async () => {
      setLoading(true);
      try {
        const res = await getDestinations(100, 0);
        if (res.data) setDestinations(res.data);
      } catch (err) {
        console.error("Failed to fetch destinations:", err);
      } finally {
        setLoading(false);
      }
    };
    fetchDestinations();
  }, [token]);

  return (
    <AppContext.Provider value={{ destinations, setDestinations, loading }}>
      {children}
    </AppContext.Provider>
  );
}