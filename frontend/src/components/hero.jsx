import React from "react";
import { useNavigate } from "react-router-dom";

function Hero() {

  const navigate = useNavigate();

  const handleReportIssue = () => {

    const token = localStorage.getItem("token");

    if(token){
      navigate("/report-issue");
    }
    else{
      navigate("/login", { state: { from: "/report-issue" } });
    }

  };

  return (
    <div className="hero">

      <h1>Report Local Issues, Improve Your Community</h1>

      <p>
        Easily report problems in your area and track their resolution.
      </p>

      <div className="hero-buttons">

        <button
          className="report-btn"
          onClick={handleReportIssue}
        >
          Report an Issue
        </button>

        <button className="track-btn">
          Track Your Complaints
        </button>

      </div>

    </div>
  );
}

export default Hero;