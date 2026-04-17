import { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { FiSun, FiMoon, FiMenu, FiX } from "react-icons/fi";

function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);

  useEffect(() => {
    const savedTheme = localStorage.getItem("theme");
    if (savedTheme === "dark") {
      setDarkMode(true);
      document.body.classList.add("dark");
    }
  }, []);

  useEffect(() => {
    if (!menuOpen) return;

    const handleClickOutside = (event) => {
        if (
        menuRef.current &&
        !menuRef.current.contains(event.target) &&
        !event.target.closest(".hamburger")
        ) {
        setMenuOpen(false);
        }
    };

    document.addEventListener("mousedown", handleClickOutside);

    return () => {
        document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [menuOpen]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark");

    localStorage.setItem("theme", !darkMode ? "dark" : "light");
  };

  return (
    <nav className="navbar">
      <div className="logo">✈️ Wanderlist</div>

        <div ref={menuRef} className={`links ${menuOpen ? "open" : ""}`}>
            <Link to="/" onClick={() => setMenuOpen(false)}>Explore</Link>
            <Link to="/" onClick={() => setMenuOpen(false)}>My Trips</Link>
            <Link to="/" onClick={() => setMenuOpen(false)}>Visited</Link>
        </div>

      <div className="actions">
        <button onClick={toggleTheme} className="theme-btn">
            {darkMode ? <FiSun /> : <FiMoon />}
        </button>

        <button 
            className="hamburger"
            onClick={() => setMenuOpen(!menuOpen)}
        >
            {menuOpen ? <FiX /> : <FiMenu />}
        </button>

      </div>
    </nav>
  );
}

export default Navbar;