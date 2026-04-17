import { useState } from "react";
import DestinationCard from "../components/DestinationCard";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

function Home() {
  const [search, setSearch] = useState("");
  const { destinations } = useContext(AppContext);
  const continents = ["All", "Europe", "Asia", "Americas", "Africa", "Oceania"];
  const [continent, setContinent] = useState("All");

  const filteredDestinations = destinations.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchesContinent =
        continent === "All" || d.continent === continent;

    return matchesSearch && matchesContinent;
  });

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
            <div>🌍 12 Countries Visited</div>
            <div>❤️ 8 Favorites</div>
            <div>📌 5 Planned</div>
      </section>
      <div className="grid">
        {filteredDestinations.map((d) => (
            <DestinationCard key={d.id} destination={d} />
        ))}
      </div>
    </div>
  );
}

export default Home;