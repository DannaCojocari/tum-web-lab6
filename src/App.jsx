import { BrowserRouter, Routes, Route } from "react-router-dom";
import Home from "./pages/Home";
import DestinationDetails from "./pages/DestinationDetails";
import AddDestination from "./pages/AddDestination";
import WorldMap from "./pages/WorldMap";
import MyTrips from "./pages/MyTrips";
import Navbar from "./components/Navbar";

function App() {
  return (
    <BrowserRouter>
      <Navbar />
      <Routes>
        <Route path="/" element={<Home />} />
        <Route path="/destination/:id" element={<DestinationDetails />} />
        <Route path="/add" element={<AddDestination />} />
        <Route path="/map" element={<WorldMap />} />
        <Route path="/trips" element={<MyTrips />} />
      </Routes>
    </BrowserRouter>
  );
}

export default App;