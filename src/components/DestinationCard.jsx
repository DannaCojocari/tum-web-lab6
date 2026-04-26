import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";
import { Link } from "react-router-dom";
import { useContext } from "react";
import { AppContext } from "../context/AppContext";

function DestinationCard({ destination }) {
  const { destinations, setDestinations } = useContext(AppContext);

  const toggleLike = () => {
    const updated = destinations.map((d) =>
        d.id === destination.id ? { ...d, liked: !d.liked } : d
    );

    setDestinations(updated);
  };

  return (
    <div className="card">
      <img src={destination.image} alt={destination.name} />
      <div className={`status ${destination.status.toLowerCase()}`}>
        {destination.status}
      </div>

      <div className="overlay">
        {destination.country}
      </div>

      <div className="card-body">
        <h3>{destination.name}</h3>
        <p>{destination.description}</p>

        <div className="tags">
            {destination.tags.map((tag) => (
                <span key={tag} className="tag">
                {tag}
                </span>
            ))}
        </div>
      </div>

      <div className="card-footer">
        <button
            className={`like ${destination.liked ? "active" : ""}`}
            onClick={toggleLike}
        >
            {destination.liked ? <FaHeart /> : <FiHeart />}
        </button>

        <Link to={`/destination/${destination.id}`} className="details-btn">
            View Details →
        </Link>
      </div>
    </div>
  );
}

export default DestinationCard;