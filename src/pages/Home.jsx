import { useState } from "react";
import DestinationCard from "../components/DestinationCard";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";
import { FiPlus } from "react-icons/fi";
import AddDestination from "../pages/AddDestination";

function Home() {
  const [search, setSearch] = useState("");
  const { destinations } = useContext(AppContext);
  const continents = ["All", "Europe", "Asia", "America", "Africa", "Oceania"];
  const [continent, setContinent] = useState("All");

  const filteredDestinations = destinations.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchesCountry = d.country.toLowerCase().includes(search.toLowerCase());
    const matchesContinent =
        continent === "All" || d.continent === continent;

    return matchesSearch && matchesContinent || matchesCountry && matchesContinent;
  });

  const visited = destinations.filter((d) => d.status === "Visited").length;
  const favorites = destinations.filter((d) => d.liked).length;
  const planned = destinations.filter((d) => d.status === "Planned").length;

  const [showForm, setShowForm] = useState(false);

  return (
    <div className="home">
      <section className="hero">
        <h1>Where to next?</h1>
        <p>Plan your dream destinations and track your journeys</p>

        <input
          type="text"
          placeholder="Search destinations..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="search"
        />
        <div className="filters">
            {continents.map((c) => (
                <button
                    key={c}
                    className={`filter-btn ${continent === c ? "active" : ""}`}
                    onClick={() => setContinent(c)}
                >
                {c}
                </button>
            ))}
        </div>
      </section>
      <section className="stats">
            <div>🌍 {visited} Countries Visited</div>
            <div>❤️ {favorites} Favorites</div>
            <div>📌 {planned} Planned</div>
      </section>
      <div className="section-header">
        <h2>Explore Destinations</h2>

        <button 
            className="add-btn"
            onClick={() => setShowForm(true)}
        >
            <FiPlus /> Add Destination
        </button>
      </div>
      <div className="grid">
        {filteredDestinations.map((d) => (
            <DestinationCard key={d.id} destination={d} />
        ))}
      </div>
      {showForm && (
        <AddDestination onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}

export default Home;