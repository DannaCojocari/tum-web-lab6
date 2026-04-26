import { useState, useContext } from "react";
import { AppContext } from "../context/AppContext";
import DayCard from "./DayCard"; // 🔥 ASTA LIPSEA

function ItineraryBuilder({ destination }) {
  const { destinations, setDestinations } = useContext(AppContext);

  const [days, setDays] = useState(3);

  const current = Array.isArray(destination.itinerary)
    ? destination.itinerary
    : [];

  const updateDestination = (newItinerary) => {
    const updated = destinations.map((d) =>
      d.id === destination.id
        ? { ...d, itinerary: newItinerary }
        : d
    );

    setDestinations(updated);
    localStorage.setItem("destinations", JSON.stringify(updated));
  };

  const generateItinerary = () => {
    const newItinerary = [];

    for (let i = 1; i <= days; i++) {
      newItinerary.push({
        day: i,
        activities: []
      });
    }

    updateDestination(newItinerary);
  };

  const addActivity = (dayIndex, text) => {
    if (!text) return;

    const updated = [...current];
    updated[dayIndex].activities.push({
      text,
      done: false
    });

    updateDestination(updated);
  };

  const toggleActivity = (dayIndex, actIndex) => {
    const updated = [...current];
    updated[dayIndex].activities[actIndex].done =
      !updated[dayIndex].activities[actIndex].done;

    updateDestination(updated);
  };

  const deleteActivity = (dayIndex, actIndex) => {
    const updated = [...current];
    updated[dayIndex].activities.splice(actIndex, 1);

    updateDestination(updated);
  };

  return (
    <div className="itinerary">
      <h3>Day-by-Day Itinerary</h3>

      <div className="itinerary-top">
        <span>How many days?</span>

        <input
          type="number"
          value={days}
          onChange={(e) => setDays(Number(e.target.value))}
        />

        <button onClick={generateItinerary}>
          Generate Itinerary
        </button>
      </div>

      {current.map((day, i) => (
        <DayCard
          key={i}
          day={day}
          index={i}
          addActivity={addActivity}
          toggleActivity={toggleActivity}
          deleteActivity={deleteActivity}
        />
      ))}

      <p className="itinerary-note">
        Your itinerary is saved locally in your browser
      </p>
    </div>
  );
}

export default ItineraryBuilder;