import { createContext, useState, useEffect } from "react";
import initialData from "../data/destination";

export const AppContext = createContext();

export function AppProvider({ children }) {
  const [destinations, setDestinations] = useState([]);

  // Load from localStorage or fallback to initial data
  useEffect(() => {
    const saved = localStorage.getItem("destinations");
    if (saved) {
      setDestinations(JSON.parse(saved));
    } else {
      setDestinations(initialData);
    }
  }, []);

  // Save to localStorage
  useEffect(() => {
    if (destinations.length > 0) {
      localStorage.setItem("destinations", JSON.stringify(destinations));
    }
  }, [destinations]);

  return (
    <AppContext.Provider value={{ destinations, setDestinations }}>
      {children}
    </AppContext.Provider>
  );
}