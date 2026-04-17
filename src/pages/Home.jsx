import { useState } from "react";

function Home() {
  const [search, setSearch] = useState("");
  const continents = ["All", "Europe", "Asia", "Americas", "Africa", "Oceania"];

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
                <button key={c} className="filter-btn">
                    {c}
                </button>
            ))}
        </div>
      </section>
    </div>
  );
}

export default Home;