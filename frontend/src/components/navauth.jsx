import React , {useState} from "react";
import logo from "../assets/logo.png"
import { Link } from "react-router-dom";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  return (
    <nav className="navbar">
      <div className="logo">
        <img src={logo} alt="CivicTrack Logo" />
        <div className="logo-text">
          <span className="civic">Civic</span>
         <span className="track">Track</span>

        </div>
      </div>
      
       <div className={`nav-links ${menuOpen ? "active" : ""}`}>
        <a href="/authority">Home</a>
        <Link to="/mapauthority">Map</Link>
      

      <button className="login-btn">Profile</button>
      </div>
       <div
        className="menu-icon"
        onClick={() => setMenuOpen(!menuOpen)}
      >
        ☰
      </div>
    </nav>
  );
}

export default Navbar;