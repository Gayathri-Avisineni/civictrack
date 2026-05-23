import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/track_complaints.css";
import Navbar from "../components/navbar";   // adjust exact path
import { useNavigate } from "react-router-dom";

  

function TrackMyComplaints() {
  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);
  const [loading, setLoading] = useState(true);
  

  const token = localStorage.getItem("token"); // citizen jwt token

  useEffect(() => {
    fetchMyIssues();
  }, []);

  const fetchMyIssues = async () => {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/my-issues/", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setIssues(res.data);
    } catch (err) {
      console.log("Error fetching issues:", err);
    } finally {
      setLoading(false);
    }
  };


  const getStatusColor = (status) => {
  switch (status) {
    case "pending": return "#e53935";
    case "in_progress": return "#42a5f5";
    case "resolved": return "#43a047";
    default: return "#bdbdbd";
  }
};

  if (loading) {
    return (
      <div className="loader-wrapper">
        <div className="loader"></div>
        <p>Loading your complaints...</p>
      </div>
    );
  }

  return (
    <>  
    < Navbar />

    

    <div className="track-container">
    
      <h1 className="page-title">📍 Track My Complaints</h1>
      <p className="subtitle">Here are all the complaints you have submitted.</p>

      {issues.length === 0 ? (
        <p className="no-data">No complaints found. Start reporting issues!</p>
      ) : (
        <div className="complaints-grid">
          {issues.map((issue) => (
            <div className="complaint-card" key={issue.id}>
              
              <img
                src={issue.photo}
                alt="Issue"
                className="complaint-image"
              />

              <div className="complaint-info">
                <h3>{issue.title}</h3>

                <span
                  className="t-status-badge"
                  style={{ backgroundColor: getStatusColor(issue.status) }}
                >
                  {issue.status.replace("_", " ").toUpperCase()}
                </span>

                <p className="category">Category: {issue.category.name}</p>

                <p className="short-desc">
                  {issue.description.substring(0, 70)}...
                </p>

                <div className="bottom-row">
                  <span>👍 {issue.support_count} supports</span>
                  <a href={`/issue/${issue.id}`} className="view-btn">
                    View Details 
                  </a>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}


    </div>
    </>
  );
}

export default TrackMyComplaints;