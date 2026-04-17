import { FiHeart } from "react-icons/fi";
import { FaHeart } from "react-icons/fa";

function DestinationCard({ destination }) {
  return (
    <div className="card">
      <img src={destination.image} alt={destination.name} />
      <div className={`status ${destination.status.toLowerCase()}`}>
        {destination.status}
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
        <button className={`like ${destination.liked ? "active" : ""}`}>
            {destination.liked ? <FaHeart /> : <FiHeart />}
        </button>
      </div>
    </div>
  );
}

export default DestinationCard;