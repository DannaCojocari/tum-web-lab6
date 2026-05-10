import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import DestinationDetails from "./pages/DestinationDetails";
import AddDestination from "./pages/AddDestination";
import WorldMap from "./pages/WorldMap";
import MyTrips from "./pages/MyTrips";
import Navbar from "./components/Navbar";
import AuthPage from "./pages/AuthPage";
import { useAuth } from "./context/AuthContext";

function ProtectedRoute({ children }) {
  const { user } = useAuth();
  if (!user) return <Navigate to="/auth" replace />;
  return children;
}

function App() {
  return (
    <HashRouter>
      <Routes>
        <Route path="/auth" element={<AuthPage />} />
        <Route
          path="/*"
          element={
            <ProtectedRoute>
              <Navbar />
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/destination/:id" element={<DestinationDetails />} />
                <Route path="/add" element={<AddDestination />} />
                <Route path="/map" element={<WorldMap />} />
                <Route path="/trips" element={<MyTrips />} />
              </Routes>
            </ProtectedRoute>
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default App;