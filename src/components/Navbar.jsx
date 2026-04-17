import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { FiSun, FiMoon } from "react-icons/fi";

function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.body.classList.add("dark");
    }
  }, []);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark");

    localStorage.setItem("theme", !darkMode ? "dark" : "light");
  };

  return (
    <nav className="navbar">
      <div className="logo">✈️ Wanderlist</div>

      <div className={`links ${menuOpen ? "open" : ""}`}>
        <Link to="/">Explore</Link>
        <Link to="/">My Trips</Link>
        <Link to="/">Visited</Link>
      </div>

      <div className="actions">
        <button onClick={toggleTheme} className="theme-btn">
            {darkMode ? <FiSun /> : <FiMoon />}
        </button>

      </div>
    </nav>
  );
}

export default Navbar;