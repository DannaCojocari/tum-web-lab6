import { useState } from "react";

function Home() {
  const [search, setSearch] = useState("");

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
      </section>
    </div>
  );
}

export default Home;