import { useState } from "react";

function DayCard({
  day,
  index,
  addActivity,
  toggleActivity,
  deleteActivity
}) {
  const [input, setInput] = useState("");

  return (
    <div className="day-card">
      <h4>Day {day.day}</h4>

      {day.activities.map((act, i) => (
        <div className="activity" key={i}>
          <input
            type="checkbox"
            checked={act.done}
            onChange={() => toggleActivity(index, i)}
          />

          <span className={act.done ? "done" : ""}>
            {act.text}
          </span>

          <button
            className="activity-delete"
            onClick={() => deleteActivity(index, i)}
          >
            ✕
          </button>
        </div>
      ))}

      <div className="activity-input">
        <input
          placeholder="Add an activity..."
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />

        <button
          onClick={() => {
            addActivity(index, input);
            setInput("");
          }}
        >
          + Add
        </button>
      </div>
    </div>
  );
}

export default DayCard;