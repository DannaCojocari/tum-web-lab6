import { useParams } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import ItineraryBuilder from "../components/ItineraryBuilder";

function DestinationDetails() {
  const { id } = useParams();
  const { destinations, setDestinations } = useContext(AppContext);

  const destination = destinations.find((d) => d.id === Number(id));

  const [status, setStatus] = useState(destination?.status || "Wishlist");
  const [rating, setRating] = useState(destination?.rating || 0);
  const [images, setImages] = useState(destination?.images || []);
  const [toast, setToast] = useState(false);

  if (!destination) return <div>Not found</div>;

  const handleSave = () => {
    const updated = destinations.map((d) => {
      if (d.id === destination.id) {
        return { ...d, status, rating, images };
      }
      return d;
    });
    setDestinations(updated);
    setToast(true);
    setTimeout(() => setToast(false), 3000);
  };

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

  const handleDeleteImage = (indexToDelete) => {
    setImages((prev) => prev.filter((_, i) => i !== indexToDelete));
  };

  useEffect(() => {
    if (destination) {
      setImages(destination.images || []);
      setStatus(destination.status);
      setRating(destination.rating || 0);
    }
  }, [destination]);

  return (
    <div className="details">
      <img src={destination.image} alt={destination.name} className="details-hero" />

      <div className="details-card">
        <h2>{destination.name}</h2>
        <p>{destination.country} • {destination.continent}</p>

        <div className="status-buttons">
          {["Wishlist", "Planned", "Visited"].map((s) => (
            <button
              key={s}
              className={`status-btn ${status === s ? "active " + s.toLowerCase() : ""}`}
              onClick={() => {
                setStatus(s);
                if (s !== "Visited") setRating(0);
              }}
            >
              {s}
            </button>
          ))}
        </div>

        <div className="about">
          <h4>About</h4>
          <p>{destination.description}</p>
        </div>

        <div className="tags">
          {destination.tags.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>

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
              <div className="img-wrapper" key={index}>
                <img src={img} alt="uploaded" />
                <button className="delete-btn" onClick={() => handleDeleteImage(index)}>✕</button>
              </div>
            ))}
          </div>
        )}

        {status === "Visited" && (
          <div className="photos">
            <p>📷 Upload your photos</p>
            <input type="file" multiple onChange={handleImageUpload} />
            <small>Photos are saved locally in your browser</small>
          </div>
        )}

        {status === "Planned" && (
          <ItineraryBuilder destination={destination} />
        )}

        <button onClick={handleSave} disabled={(status === "Visited" && rating === 0) || toast}>
            Save
        </button>
      </div>

      {/* Toast */}
      {toast && (
        <div style={{
          position: "fixed", top: "80px", right: "24px", minWidth: "300px",
          background: "var(--card)", color: "var(--text)",
          padding: "12px 20px", borderRadius: "12px",
          boxShadow: "0 6px 24px rgba(0,0,0,0.15)",
          borderLeft: "4px solid #2A6496",
          fontSize: "14px", fontWeight: 500, zIndex: 9999,
          animation: "slideIn 0.3s ease"
        }}>
          ✅ Changes saved!
        </div>
      )}
    </div>
  );
}

export default DestinationDetails;