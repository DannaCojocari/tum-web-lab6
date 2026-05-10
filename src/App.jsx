import { HashRouter, Routes, Route, Navigate } from "react-router-dom";
import Home from "./pages/Home";
import DestinationDetails from "./pages/DestinationDetails";
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
            <>
              <Navbar />
              <Routes>
                {/* Public routes — visitors can browse */}
                <Route path="/" element={<Home />} />
                <Route path="/destination/:id" element={<DestinationDetails />} />

                {/* Protected routes — require login */}
                <Route path="/map" element={<ProtectedRoute><WorldMap /></ProtectedRoute>} />
                <Route path="/trips" element={<ProtectedRoute><MyTrips /></ProtectedRoute>} />
              </Routes>
            </>
          }
        />
      </Routes>
    </HashRouter>
  );
}

export default App;