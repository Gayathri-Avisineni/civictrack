import React, { useState } from "react";
import logo from "../assets/logo.png";
import { Link, useLocation } from "react-router-dom";
import "./navbar.css";
import axios from "axios";

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const role = localStorage.getItem("role"); 
  const user = JSON.parse(localStorage.getItem("user"));
  const [showMenu, setShowMenu] = useState(false);
  const location = useLocation();

  
  const handleLogout = async () => {
    try {
      const refresh =
        localStorage.getItem("refresh");

      const user = JSON.parse(
        localStorage.getItem("user")
      );

      await axios.post(
        "https://civictrack-mlhg.onrender.com/api/logout/",
        {
          refresh: refresh,
          user_id: user.id
        },
        {
          headers: {
            Authorization:
              `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

    } catch (error) {
      console.log(
        "Logout error:",
        error.response?.data || error
      );
    }

    localStorage.clear();
    window.location.replace("/home");

    setTimeout(() => {
      window.history.pushState(
        null,
        "",
        window.location.href
      );

      window.onpopstate = () =>
        window.history.go(1);
    }, 0);
  };

  // Detect if currently on authority dashboard page
  const onAuthorityDashboard = location.pathname.startsWith("/authority");

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

        {/* ALWAYS SHOW HOME */}
        <Link to="/home">Home</Link>

        {/* NOT LOGGED IN */}
        {!user && (
          <>
            <Link to="/all-issues">All Issues</Link>
            <Link to="/map">Map</Link>
            <Link to="/solved-issues">Solved Issues</Link>
            <Link to="/login" className="login-btn">Login</Link>
          </>
        )}

        {/* CITIZEN NAVBAR */}
        {user && role === "citizen" && (
          <>
            <Link to="/all-issues">All Issues</Link>
            <Link to="/map">Map</Link>
            <Link to="/solved-issues">Solved Issues</Link>

            {/* Profile Dropdown */}
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
          </>
        )}

        {/* AUTHORITY NAVBAR */}
        {user && role === "authority" && (
          <>
            {/* Always show Authority Dashboard */}
            <Link to="/authority">Authority Dashboard</Link>

            {/* EXTRA LINKS ONLY WHEN ON HOME PAGE */}
            {!onAuthorityDashboard && (
              <>
                <Link to="/all-issues">All Issues</Link>
                
                <Link to="/map">Map</Link>
                <Link to="/solved-issues">Solved Issues</Link>
              </>
            )}

            {/* Profile Dropdown */}
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
          </>
        )}
      </div>

      <div className="menu-icon" onClick={() => setMenuOpen(!menuOpen)}>
        ☰
      </div>
    </nav>
  );
}

export default Navbar;


