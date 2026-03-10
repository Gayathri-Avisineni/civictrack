import React from "react";

function Hero() {
  return (
    <div className="hero">
      <h1>Report Local Issues, Improve Your Community</h1>

      <p>
        Easily report problems in your area and track their resolution.
      </p>

      <div className="hero-buttons">
        <button className="report-btn">Report an Issue</button>
        <button className="track-btn">Track Your Complaints</button>
      </div>
    </div>
  );
}

export default Hero;