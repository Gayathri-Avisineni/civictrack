import React , {useState} from "react";
import logo from "../assets/logo.png"
import { Link } from "react-router-dom";
import "./navbar.css";
import axios from "axios";
function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const user = JSON.parse(localStorage.getItem("user"));
  const [showMenu, setShowMenu] = useState(false);
  const handleLogout = async () => {

  try {

    await axios.post("http://127.0.0.1:8000/api/logout/", {
      username: localStorage.getItem("username")
    });

  } catch (error) {
    console.log("Logout error", error);
  }

  localStorage.clear();
  window.location.href = "/home";
};
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
        <Link to="/home">Home</Link>
        <a href="#">Complaints</a>
        <a href="#">Map</a>
        <a href="#">Solved Issues</a>
      

      {user ? (
        <div className="profile-section">

          <div
            className="profile-avatar"
            onClick={() => setShowMenu(!showMenu)}
          >
            {user.username.charAt(0).toUpperCase()}
          </div>

          {showMenu && (
            <div className="dropdown-menu">

              <div className="dropdown-user">
                <div className="avatar-big">
                  {user.username.charAt(0).toUpperCase()}
                </div>

                <div>
                  <p className="user-name">{user.username}</p>
                  <p className="user-email">{user.email}</p>
                </div>
              </div>

              <div className="dropdown-divider"></div>

              <button onClick={handleLogout} className="logout-btn">
                Logout
              </button>

            </div>
          )}

        </div>
      ) : (
        <Link to="/login" className="login-btn">
          Login
        </Link>
      )}
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