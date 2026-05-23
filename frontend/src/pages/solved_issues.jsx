import React, { useEffect, useState } from "react";
import axios from "axios";
import Navbar from "../components/navbar";
import { useNavigate } from "react-router-dom";
import "../css/solved_issues.css";

function SolvedIssues() {
  const [issues, setIssues] = useState([]);
  const [lightboxImg, setLightboxImg] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    fetchResolved();
  }, []);

  async function fetchResolved() {
    try {
      const res = await axios.get("http://127.0.0.1:8000/api/issues/resolved/");
      setIssues(res.data);
    } catch (err) {
      console.log(err);
    }
  }

  const openLightbox = (imgUrl) => setLightboxImg(imgUrl);
  const closeLightbox = () => setLightboxImg(null);

  return (
    <>
      <Navbar />

      <div className="solved-container">
        <h1 className="page-title">Resolved Issues</h1>

        <div className="solved-grid">
          {issues.map((issue) => (
            <div className="solved-card" key={issue.id}>
              
              {/* Before & After Images */}
              <div className="before-after">
                <div onClick={() => openLightbox(issue.photo)}>
                  <h3>Before</h3>
                  <img src={issue.photo} alt="before" />
                </div>

                <div onClick={() => openLightbox(issue.proof)}>
                  <h3>After</h3>
                  <img src={issue.proof} alt="after" />
                </div>
              </div>

              {/* Info Section */}
              <div className="info">
                <h2>{issue.title}</h2>
                <p><strong>Authority:</strong> {issue.assigned_authority?.username || "N/A"}</p>
                <p><strong>Description:</strong> {issue.description}</p>
                <p><strong>Location:</strong> {issue.area}, {issue.pincode}</p>

                 <a href={`/issue/${issue.id}`} className="view-btn">
                    View Details 
                  </a>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Lightbox */}
      {lightboxImg && (
        <div className="lightbox-overlay" onClick={closeLightbox}>
          <img src={lightboxImg} alt="preview" />
        </div>
      )}
    </>
  );
}

export default SolvedIssues;