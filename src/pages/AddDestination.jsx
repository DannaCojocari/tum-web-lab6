import { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";

function AddDestinationForm({ onClose }) {
  const { destinations, setDestinations } = useContext(AppContext);

  const [form, setForm] = useState({
    name: "",
    country: "",
    continent: "Europe",
    description: "",
    image: "",
    tags: []
  });

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

  // submit
  const handleSubmit = (e) => {
    e.preventDefault();

    const newDestination = {
      id: Date.now(),
      ...form,
      status: "Wishlist",
      liked: false,
      rating: 0,
      images: []
    };

    const updated = [...destinations, newDestination];

    setDestinations(updated);

    // 🔥 persist
    localStorage.setItem("destinations", JSON.stringify(updated));

    onClose();
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
          required
        />

        {/* COUNTRY */}
        <input
          name="country"
          placeholder="Country"
          value={form.country}
          onChange={handleChange}
          required
        />

        {/* CONTINENT */}
        <select
          name="continent"
          value={form.continent}
          onChange={handleChange}
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

        {/* IMAGE */}
        <input
          name="image"
          placeholder="Cover Image URL"
          value={form.image}
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
          <button type="submit">Add to Wishlist</button>

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