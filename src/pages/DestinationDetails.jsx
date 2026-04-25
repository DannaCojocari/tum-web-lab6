import { useParams } from "react-router-dom";
import { useContext, useState } from "react";
import { AppContext } from "../context/AppContext";

function DestinationDetails() {
  const { id } = useParams();
  const { destinations, setDestinations } = useContext(AppContext);

  const destination = destinations.find((d) => d.id === Number(id));

  // local state (edit mode)
  const [status, setStatus] = useState(destination?.status || "Wishlist");
  const [rating, setRating] = useState(destination?.rating || 0);

  if (!destination) return <div>Not found</div>;

  const [images, setImages] = useState(destination?.images || []);

  // SAVE LOGIC
  const handleSave = () => {
    const updated = destinations.map((d) => {
      if (d.id === destination.id) {
        return {
          ...d,
          status: status,
          rating: rating,
          images: images
        };
      }
      return d;
    });

    setDestinations(updated);
  };

  // Image Upload
  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);

    files.forEach((file) => {
        const reader = new FileReader();

        reader.onloadend = () => {
        setImages((prev) => [...prev, reader.result]);
        };

        reader.readAsDataURL(file);
    });
    };

  return (
    <div className="details">
      {/* HERO IMAGE */}
      <img
        src={destination.image}
        alt={destination.name}
        className="details-hero"
      />

      {/* CARD */}
      <div className="details-card">
        <h2>{destination.name}</h2>
        <p>
          {destination.country} • {destination.continent}
        </p>

        {/* STATUS SELECTOR */}
        <div className="status-buttons">
          {["Wishlist", "Planned", "Visited"].map((s) => (
            <button
              key={s}
              className={`status-btn ${status === s ? "active " + s.toLowerCase() : ""}`}
              onClick={() => {
                setStatus(s);
                if (s !== "Visited") setRating(0); // reset rating dacă nu e visited
              }}
            >
              {s}
            </button>
          ))}
        </div>

        {/* DESCRIPTION */}
        <div className="about">
          <h4>About</h4>
          <p>{destination.description}</p>
        </div>

        {/* TAGS */}
        <div className="tags">
          {destination.tags.map((tag) => (
            <span key={tag} className="tag">
              {tag}
            </span>
          ))}
        </div>

        {/* ⭐ RATING (doar dacă Visited) */}
        {status === "Visited" && (
          <div className="rating">
            <h4>Your Rating</h4>
            {[1, 2, 3, 4, 5].map((star) => (
              <span
                key={star}
                onClick={() => setRating(star)}
                className={star <= rating ? "filled" : ""}
              >
                ⭐
              </span>
            ))}
          </div>
        )}

        {status === "Visited" && images.length > 0 && (
          <div className="gallery">
            {images.map((img, index) => (
                <img key={index} src={img} alt="uploaded" />
            ))}
          </div>
        )}

        {/* 📷 UPLOAD (doar dacă Visited) */}
        {status === "Visited" && (
          <div className="photos">
            <p>📷 Upload your photos</p>
            <input type="file" multiple onChange={handleImageUpload} />
            <small>Photos are saved locally in your browser</small>
          </div>
        )}

        {/* SAVE BUTTON */}
        <button
          onClick={handleSave}
          disabled={status === "Visited" && rating === 0}
        >
          Save
        </button>
      </div>
    </div>
  );
}

export default DestinationDetails;