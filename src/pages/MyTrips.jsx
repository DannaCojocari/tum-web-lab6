import { useContext } from "react";
import { Link } from "react-router-dom";
import { AppContext } from "../context/AppContext";

function StarRating({ rating }) {
  return (
    <div className="trip-rating">
      {[1, 2, 3, 4, 5].map((s) => (
        <span key={s} style={{ opacity: s <= rating ? 1 : 0.2, fontSize: "16px" }}>
          ⭐
        </span>
      ))}
    </div>
  );
}

function MyTrips() {
  const { destinations } = useContext(AppContext);
  const visited = destinations.filter((d) => d.status === "Visited");

  return (
    <div className="trips-page">
      <div className="trips-header">
        <h1>My Travel Journal</h1>
        <p>Places you've already explored</p>
      </div>

      {visited.length === 0 ? (
        <div className="trips-empty">
          <div className="trips-empty-icon">🗺️</div>
          <h3>No trips yet</h3>
          <p>Start exploring and mark destinations as Visited!</p>
          <Link to="/" className="details-btn" style={{ display: "inline-block", marginTop: "16px" }}>
            Explore Destinations
          </Link>
        </div>
      ) : (
        <div className="trips-grid">
          {visited.map((d) => (
            <div key={d.id} className="trip-card">
              <div className="trip-img-wrap">
                <img src={d.image} alt={d.name} className="trip-img" />
                <div className="trip-country-badge">{d.country}</div>
              </div>
              <div className="trip-body">
                <div className="trip-meta">
                  <span className="trip-continent">{d.continent}</span>
                  {d.rating > 0 && <StarRating rating={d.rating} />}
                </div>
                <h2 className="trip-name">{d.name}</h2>
                <p className="trip-desc">{d.description}</p>
                <div className="tags" style={{ marginTop: "10px" }}>
                  {d.tags.map((tag) => (
                    <span key={tag} className="tag">{tag}</span>
                  ))}
                </div>
                <div className="trip-footer">
                  <Link to={`/destination/${d.id}`} className="details-btn">
                    View Details →
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

export default MyTrips;