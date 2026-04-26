import { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import { useNavigate } from 'react-router-dom';
import { getLocationImage } from '../utils/getImage';
import { getLocationInfo } from '../utils/getLocation';

function AddDestinationForm({ onClose }) {
  const { destinations, setDestinations } = useContext(AppContext);
  const navigate = useNavigate();

  const [form, setForm] = useState({
    name: "",
    country: "",
    continent: "Europe",
    description: "",
    tags: []
  });

  const [loading, setLoading] = useState(false);
  const [infoLoaded, setInfoLoaded] = useState(false);

  const continents = ["Europe", "Asia", "America", "Africa", "Oceania"];

  const tagsList = [
    { label: "Beach", icon: "🏖️" },
    { label: "Mountains", icon: "🏔️" },
    { label: "City", icon: "🏙️" },
    { label: "Food", icon: "🍕" },
    { label: "Adventure", icon: "🏕️" },
    { label: "Culture", icon: "🏛️" },
    { label: "Nature", icon: "🌿" }
  ];

  // input handler
  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value
    });
  };

  // tag select
  const toggleTag = (tag) => {
    setForm((prev) => ({
      ...prev,
      tags: prev.tags.includes(tag)
        ? prev.tags.filter((t) => t !== tag)
        : [...prev.tags, tag]
    }));
  };

  const handleCityBlur = async () => {
    if (!form.name) return;
    setLoading(true);
    
    const info = await getLocationInfo(form.name);
    
    setForm((prev) => ({
        ...prev,
        country: info.country || prev.country,
        continent: info.continent || prev.continent,
        description: info.description || prev.description,
    }));

    if (info.country) setInfoLoaded(true);
    setLoading(false);
  };

  // submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
        const imageUrl = await getLocationImage(form.name);

        const newDestination = {
        id: Date.now(),
        ...form,
        image: imageUrl,
        status: "Wishlist",
        liked: false,
        rating: 0,
        images: []
        };

        const updated = [...destinations, newDestination];
        setDestinations(updated);
        localStorage.setItem("destinations", JSON.stringify(updated));
        onClose();
    } catch (err) {
        console.error("Failed to fetch image:", err);
    } finally {
        setLoading(false);
    }
  };

  return (
    <div className="modal">
      <div className="modal-overlay" onClick={onClose}></div>

      <form className="modal-form" onSubmit={handleSubmit}>
        <h2>Add Destination</h2>

        {/* NAME */}
        <input
          name="name"
          placeholder="Destination Name"
          value={form.name}
          onChange={handleChange}
          onBlur={handleCityBlur}
          required
        />

        {/* COUNTRY */}
        <input
          name="country"
          placeholder="Country"
          value={form.country}
          onChange={handleChange}
          readOnly={infoLoaded}
          style={infoLoaded ? { opacity: 0.6, cursor: "not-allowed" } : {}}
          required
        />

        {/* CONTINENT */}
        <select
          name="continent"
          value={form.continent}
          onChange={handleChange}
          disabled={infoLoaded}
          style={infoLoaded ? { opacity: 0.6, cursor: "not-allowed" } : {}}
        >
          {continents.map((c) => (
            <option key={c}>{c}</option>
          ))}
        </select>

        {/* DESCRIPTION */}
        <textarea
          name="description"
          placeholder="Short description"
          value={form.description}
          onChange={handleChange}
          required
        />

        {/* TAGS */}
        <div className="tags-select">
          {tagsList.map((tag) => (
            <span
              key={tag.label}
              className={`tag ${
                form.tags.includes(tag.label) ? "active" : ""
              }`}
              onClick={() => toggleTag(tag.label)}
            >
              {tag.icon} {tag.label}
            </span>
          ))}
        </div>

        {/* ACTIONS */}
        <div className="form-actions">
          <button type="submit" disabled={loading}>
            {loading ? "Fetching image..." : "Add to Wishlist"}
          </button>

          <button
            type="button"
            className="cancel-btn"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </form>
    </div>
  );
}

export default AddDestinationForm;