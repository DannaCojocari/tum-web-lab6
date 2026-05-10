import { useParams, useNavigate, Link } from "react-router-dom";
import { useContext, useState, useEffect } from "react";
import { AppContext } from "../context/AppContext";
import { useAuth } from "../context/AuthContext";
import { updateDestination } from "../services/api";
import { getPhotos, addPhoto, deletePhoto } from "../services/photoDB";
import ItineraryBuilder from "../components/ItineraryBuilder";

function DestinationDetails() {
  const { id } = useParams();
  const { destinations, setDestinations } = useContext(AppContext);
  const { user } = useAuth();
  const navigate = useNavigate();

  const destination = destinations.find((d) => d.id === Number(id) || d.id === id);

  const [status, setStatus] = useState(destination?.status || "Wishlist");
  const [rating, setRating] = useState(destination?.rating || 0);
  const [photos, setPhotos] = useState([]);
  const [toast, setToast] = useState(false);
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!destination) return;
    getPhotos(destination.id).then(setPhotos);
  }, [destination?.id]);

  if (!destination) return <div>Not found</div>;

  const handleSave = async () => {
    setSaving(true);
    try {
      const updated = await updateDestination(destination.id, { status, rating });
      if (updated.error) { console.error(updated.error); return; }
      setDestinations((prev) =>
        prev.map((d) => (d.id === destination.id ? { ...d, status, rating } : d))
      );
      setToast(true);
      setTimeout(() => setToast(false), 3000);
    } catch (err) {
      console.error("Failed to save:", err);
    } finally {
      setSaving(false);
    }
  };

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files);
    files.forEach((file) => {
      const reader = new FileReader();
      reader.onloadend = async () => {
        const newId = await addPhoto(destination.id, reader.result);
        setPhotos((prev) => [...prev, { id: newId, destinationId: destination.id, data: reader.result }]);
      };
      reader.readAsDataURL(file);
    });
  };

  const handleDeletePhoto = async (photoId) => {
    await deletePhoto(photoId);
    setPhotos((prev) => prev.filter((p) => p.id !== photoId));
  };

  return (
    <div className="details">
      <img src={destination.image} alt={destination.name} className="details-hero" />

      <div className="details-card">
        <h2>{destination.name}</h2>
        <p>{destination.country} • {destination.continent}</p>

        {!user && (
          <div className="visitor-banner">
            🔒 <Link to="/auth">Login</Link> to save status, rate and build itineraries
          </div>
        )}

        <div className="status-buttons">
          {["Wishlist", "Planned", "Visited"].map((s) => (
            <button
              key={s}
              className={`status-btn ${status === s ? "active " + s.toLowerCase() : ""}`}
              onClick={() => {
                if (!user) { navigate("/auth"); return; }
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
          {destination.tags?.map((tag) => (
            <span key={tag} className="tag">{tag}</span>
          ))}
        </div>

        {status === "Visited" && (
          <div className="rating">
            <h4>Your Rating</h4>
            {[1, 2, 3, 4, 5].map((star) => (
              <span key={star} onClick={() => setRating(star)} className={star <= rating ? "filled" : ""}>⭐</span>
            ))}
          </div>
        )}

        {status === "Visited" && photos.length > 0 && (
          <div className="gallery">
            {photos.map((photo) => (
              <div className="img-wrapper" key={photo.id}>
                <img src={photo.data} alt="uploaded" />
                <button className="delete-btn" onClick={() => handleDeletePhoto(photo.id)}>✕</button>
              </div>
            ))}
          </div>
        )}

        {status === "Visited" && (
          <div className="photos">
            <p>📷 Upload your photos</p>
            <input type="file" multiple accept="image/*" onChange={handleImageUpload} />
            <small>Photos are saved in your browser's IndexedDB</small>
          </div>
        )}

        {status === "Planned" && user && (
          <ItineraryBuilder destination={destination} />
        )}

        {user && (
          <button onClick={handleSave} disabled={(status === "Visited" && rating === 0) || saving || toast}>
            {saving ? "Saving..." : "Save"}
          </button>
        )}
      </div>

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