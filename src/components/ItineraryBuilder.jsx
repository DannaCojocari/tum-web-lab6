import { useState, useEffect } from "react";
import {
  getItineraries,
  createItinerary,
  deleteItinerary,
  createActivity,
  updateActivity,
  deleteActivity,
} from "../services/api";
import DayCard from "./DayCard";

function ItineraryBuilder({ destination }) {
  const [days, setDays] = useState(3);
  const [itinerary, setItinerary] = useState([]);
  const [loading, setLoading] = useState(true);

  // Load itinerary from API on mount
  useEffect(() => {
    if (!destination?.id) return;
    const fetch = async () => {
      setLoading(true);
      try {
        const res = await getItineraries(destination.id);
        if (res.data) setItinerary(res.data);
      } catch (err) {
        console.error("Failed to load itinerary:", err);
      } finally {
        setLoading(false);
      }
    };
    fetch();
  }, [destination.id]);

  const generateItinerary = async () => {
    try {
      // Delete existing days first
      for (const day of itinerary) {
        await deleteItinerary(day.id);
      }

      // Create new days
      const newDays = [];
      for (let i = 1; i <= days; i++) {
        const day = await createItinerary({ destinationId: destination.id, day: i });
        newDays.push({ ...day, activities: [] });
      }

      setItinerary(newDays);
    } catch (err) {
      console.error("Failed to generate itinerary:", err);
    }
  };

  const handleAddActivity = async (dayIndex, text) => {
    if (!text) return;
    try {
      const itineraryId = itinerary[dayIndex].id;
      const activity = await createActivity({ itineraryId, text });
      const updated = [...itinerary];
      updated[dayIndex].activities.push(activity);
      setItinerary(updated);
    } catch (err) {
      console.error("Failed to add activity:", err);
    }
  };

  const handleToggleActivity = async (dayIndex, actIndex) => {
    try {
      const activity = itinerary[dayIndex].activities[actIndex];
      const updated = await updateActivity(activity.id, { done: !activity.done });
      const newItinerary = [...itinerary];
      newItinerary[dayIndex].activities[actIndex] = updated;
      setItinerary(newItinerary);
    } catch (err) {
      console.error("Failed to toggle activity:", err);
    }
  };

  const handleDeleteActivity = async (dayIndex, actIndex) => {
    try {
      const activity = itinerary[dayIndex].activities[actIndex];
      await deleteActivity(activity.id);
      const newItinerary = [...itinerary];
      newItinerary[dayIndex].activities.splice(actIndex, 1);
      setItinerary(newItinerary);
    } catch (err) {
      console.error("Failed to delete activity:", err);
    }
  };

  if (loading) return <p style={{ opacity: 0.5, marginTop: "16px" }}>Loading itinerary...</p>;

  return (
    <div className="itinerary">
      <h3>Day-by-Day Itinerary</h3>

      <div className="itinerary-top">
        <span>How many days?</span>
        <input
          type="number"
          value={days}
          min={1}
          max={30}
          onChange={(e) => setDays(Number(e.target.value))}
        />
        <button onClick={generateItinerary}>Generate Itinerary</button>
      </div>

      {itinerary.map((day, i) => (
        <DayCard
          key={day.id}
          day={day}
          index={i}
          addActivity={handleAddActivity}
          toggleActivity={handleToggleActivity}
          deleteActivity={handleDeleteActivity}
        />
      ))}

      <p className="itinerary-note">
        Your itinerary is saved to the cloud ☁️
      </p>
    </div>
  );
}

export default ItineraryBuilder;