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

    const handleTrackComplaints = () => {
    const token = localStorage.getItem("token");

    if (token) {
      navigate("/track-my-complaints");
    } else {
      navigate("/login", { state: { from: "/track-my-complaints" } });
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

         <button className="track-btn" onClick={handleTrackComplaints}>
          Track My Complaints
        </button>
        

      </div>

    </div>
  );
}

export default Hero;