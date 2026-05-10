import { createContext, useState, useEffect, useContext } from "react";
import { getDestinations } from "../services/api";
import { AuthContext } from "./AuthContext";

const BASE_URL = import.meta.env.VITE_API_URL || "http://localhost:3001/api";

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [destinations, setDestinations] = useState([]);
  const [loading, setLoading] = useState(false);
  const { token } = useContext(AuthContext);

  useEffect(() => {
    const fetchDestinations = async () => {
      setLoading(true);
      try {
        if (token) {
          // Logged in — fetch user's own destinations
          const res = await getDestinations(100, 0);
          if (res.data) setDestinations(res.data);
        } else {
          // Visitor — fetch public default destinations
          const res = await fetch(`${BASE_URL}/destinations/public?limit=100&offset=0`);
          const data = await res.json();
          if (data.data) setDestinations(data.data);
        }
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