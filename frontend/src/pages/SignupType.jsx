import React from "react";
import "./SignupType.css";
import citizenImg from "../photos/citizen.png";
import authorityImg from "../photos/authority.png";

function SignupType() {
  return (
    <div className="type-wrapper">
      <h1 className="type-title">Join CivicTrack</h1>
      <p className="type-subtitle">Choose your role to get started</p>

      <div className="type-role-cards">

        {/* Citizen Card */}
        <div className="type-role-card citizen">
          <img 
            src={citizenImg} 
            alt="Citizen" 
          />
          <h2>Citizen</h2>
          <p>Report local problems in your area and track resolutions.</p>
          <a href="/signup/citizen" className="type-choose-btn">Sign Up as Citizen</a>
        </div>

        {/* Authority Card */}
        <div className="type-role-card authority">
          <img 
            src={authorityImg}
            alt="Authority" 
          />
          <h2>Authority</h2>
          <p>Manage reported problems, update status, and solve issues faster.</p>
          <a href="/signup/authority" className="type-choose-btn authority-btn">Sign Up as Authority</a>
        </div>

      </div>
    </div>
  );
}

export default SignupType;