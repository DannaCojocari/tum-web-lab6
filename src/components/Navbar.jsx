import { useState, useEffect, useRef } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { FiSun, FiMoon, FiMenu, FiX, FiLogOut } from "react-icons/fi";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const [darkMode, setDarkMode] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const menuRef = useRef(null);
  const navigate = useNavigate();
  const location = useLocation();
  const { user, logout } = useAuth();

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
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [menuOpen]);

  const toggleTheme = () => {
    setDarkMode(!darkMode);
    document.body.classList.toggle("dark");
    localStorage.setItem("theme", !darkMode ? "dark" : "light");
  };

  const handleLogout = () => {
    logout();
    navigate("/auth");
  };

  const close = () => setMenuOpen(false);
  const isActive = (path) => location.pathname === path;
  const initial = user?.firstName?.[0]?.toUpperCase() || "?";

  return (
    <nav className="navbar">
      <Link to="/" className="logo" style={{ textDecoration: "none", color: "inherit" }}>
        ✈️ Wanderlist
      </Link>

      <div ref={menuRef} className={`links ${menuOpen ? "open" : ""}`}>
        <Link to="/" className={`nav-link ${isActive("/") ? "active" : ""}`} onClick={close}>Explore</Link>
        <Link to="/trips" className={`nav-link ${isActive("/trips") ? "active" : ""}`} onClick={close}>My Trips</Link>
        <Link to="/map" className={`nav-link ${isActive("/map") ? "active" : ""}`} onClick={close}>My Map</Link>
      </div>

      <div className="actions">
        {user && (
          <div className="navbar-user-pill">
            <div className="navbar-avatar">{initial}</div>
            <span className="navbar-username">{user.firstName}</span>
          </div>
        )}

        <button onClick={toggleTheme} className="icon-btn theme-btn" title="Toggle theme">
          {darkMode ? <FiSun /> : <FiMoon />}
        </button>

        <button onClick={handleLogout} className="icon-btn logout-btn" title="Logout">
          <FiLogOut />
        </button>

        <button className="hamburger" onClick={() => setMenuOpen(!menuOpen)}>
          {menuOpen ? <FiX /> : <FiMenu />}
        </button>
      </div>
    </nav>
  );
}

export default Navbar;