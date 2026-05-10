import { useState, useContext } from "react";
import DestinationCard from "../components/DestinationCard";
import { AppContext } from "../context/AppContext";
import { FiPlus, FiChevronLeft, FiChevronRight } from "react-icons/fi";
import AddDestination from "../pages/AddDestination";

const PAGE_SIZE = 12;

function Home() {
  const [search, setSearch] = useState("");
  const { destinations } = useContext(AppContext);
  const continents = ["All", "Europe", "Asia", "America", "Africa", "Oceania"];
  const [continent, setContinent] = useState("All");
  const [page, setPage] = useState(1);
  const [showForm, setShowForm] = useState(false);

  const filteredDestinations = destinations.filter((d) => {
    const matchesSearch = d.name.toLowerCase().includes(search.toLowerCase());
    const matchesCountry = d.country.toLowerCase().includes(search.toLowerCase());
    const matchesContinent = continent === "All" || d.continent === continent;
    return (matchesSearch || matchesCountry) && matchesContinent;
  });

  // Reset to page 1 when search or filter changes
  const handleSearch = (e) => {
    setSearch(e.target.value);
    setPage(1);
  };

  const handleContinent = (c) => {
    setContinent(c);
    setPage(1);
  };

  const totalPages = Math.ceil(filteredDestinations.length / PAGE_SIZE);
  const paginated = filteredDestinations.slice(
    (page - 1) * PAGE_SIZE,
    page * PAGE_SIZE
  );

  const visited = destinations.filter((d) => d.status === "Visited").length;
  const favorites = destinations.filter((d) => d.liked).length;
  const planned = destinations.filter((d) => d.status === "Planned").length;

  return (
    <div className="home">
      <section className="hero">
        <h1>Where to next?</h1>
        <p>Plan your dream destinations and track your journeys</p>

        <input
          type="text"
          placeholder="Search destinations..."
          value={search}
          onChange={handleSearch}
          className="search"
        />
        <div className="filters">
          {continents.map((c) => (
            <button
              key={c}
              className={`filter-btn ${continent === c ? "active" : ""}`}
              onClick={() => handleContinent(c)}
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
        <button className="add-btn" onClick={() => setShowForm(true)}>
          <FiPlus /> Add Destination
        </button>
      </div>

      <div className="grid">
        {paginated.map((d) => (
          <DestinationCard key={d.id} destination={d} />
        ))}
      </div>

      {totalPages > 1 && (
        <div className="pagination">
          <button
            className="pagination-btn"
            onClick={() => setPage((p) => p - 1)}
            disabled={page === 1}
          >
            <FiChevronLeft />
          </button>

          {Array.from({ length: totalPages }, (_, i) => i + 1).map((p) => (
            <button
              key={p}
              className={`pagination-btn ${page === p ? "active" : ""}`}
              onClick={() => setPage(p)}
            >
              {p}
            </button>
          ))}

          <button
            className="pagination-btn"
            onClick={() => setPage((p) => p + 1)}
            disabled={page === totalPages}
          >
            <FiChevronRight />
          </button>

          <span className="pagination-info">
            {(page - 1) * PAGE_SIZE + 1}–{Math.min(page * PAGE_SIZE, filteredDestinations.length)} of {filteredDestinations.length}
          </span>
        </div>
      )}

      {showForm && (
        <AddDestination onClose={() => setShowForm(false)} />
      )}
    </div>
  );
}

export default Home;