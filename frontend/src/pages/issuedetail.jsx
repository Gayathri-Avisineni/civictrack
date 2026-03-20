import React, { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import API from "../api";   // ✅ use axios instance
import "../css/issuedetail.css";
import IssueMap from "../components/issuedetailmap";

function IssueDetails() {

  const { id } = useParams();

  const [issue, setIssue] = useState(null);
  const [comments, setComments] = useState([]);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);


  const handleSupport = () => {
    API.post(`issues/${id}/support/`)
      .then(res => {
        setIssue(prev => ({
          ...prev,
          support_count: res.data.support_count,
          is_supported: res.data.is_supported
        }));
      })
      .catch(err => {
        console.log(err);
        alert("Login required");
      });
  };
  // 🔥 POST COMMENT
  const handleComment = () => {

  if (!newComment.trim()) {
    alert("Comment cannot be empty");
    return;
  }

  const token = localStorage.getItem("token");

  if (!token) {
    alert("Please login first");
    return;
  }

  setLoading(true);
API.post(
  `issues/${id}/comments/`,
  { text: newComment }
).then(res => {
      setComments(prev => [res.data, ...prev]);
      setNewComment("");
    })
    .catch(err => {
      console.log(err.response?.data || err);
      alert("Failed to post comment");
    })
    .finally(() => {
      setLoading(false);
    });
};
  


  // 🔥 GET COMMENTS
  useEffect(() => {
    API.get(`issues/${id}/comments/`)
      .then(res => setComments(res.data))
      .catch(err => console.log(err));
  }, [id]);

  // 🔥 GET ISSUE DETAILS
  useEffect(() => {
    API.get(`issues/${id}/`)
      .then(res => setIssue(res.data))
      .catch(err => console.log(err));
  }, [id]);

  useEffect(() => {
    const box = document.querySelector(".comment-list");
    if (box) box.scrollTop = 0;
  }, [comments]);


  if (!issue) {
    return <h2>Loading...</h2>;
  }



  return (
    <div className="issue-page">
      <div className="issue-container">

        {/* LEFT */}
        <div className="left">

          {/* HEADER */}
          <div className="header">
            <h1>{issue.title}</h1>
            <span className={`status ${issue.status}`}>
              {issue.status}
            </span>
          </div>

          <p className="date">
            Reported on {new Date(issue.created_at).toDateString()}
          </p>

          {/* IMAGE */}
          <img
            src={issue.photo}
            className="issue-img"
            alt="issue"
          />

          {/* SUPPORT BUTTON */}
          <button
            className={`support-btn ${issue.is_supported ? "active" : ""}`}
            onClick={handleSupport}
          >
            👍 {issue.support_count || 0} Support
          </button>

          {/* COMMENTS */}
          <div className="comments">
            <h3>Comments</h3>

            {/* INPUT */}
            <div className="comment-box">
              <input
                className="comment-input"
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleComment();
                }}
                placeholder="Add a comment..."
              />

              <button
                className="comment-btn"
                onClick={handleComment}
                disabled={!newComment.trim() || loading}
              >
                {loading ? "Posting..." : "Post"}
              </button>
            </div>

            {/* COMMENTS LIST */}
            <div className="comment-list">
              {comments.map((c) => (
                <div className="comment" key={c.id}>
                  <div className="avatar">
                    {c.user_name ? c.user_name[0].toUpperCase() : "U"}
                  </div>

                  <div className="comment-content">
                    <span className="comment-user">{c.user_name}</span>
                    <span className="comment-text">{c.text}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* DESCRIPTION */}
          <div className="desc">
            <h3>About the Problem</h3>
            <p>{issue.description}</p>
          </div>


        </div>

        {/* RIGHT */}
        <div className="right">

          {/* MAP */}
          <div className="map-box">
            <h3>📍 Location</h3>

            <IssueMap
              lat={issue.latitude}
              lng={issue.longitude}
            />
          </div>

          {/* AUTHORITY */}
          <div className="authority">
            <h3>👤 Authority</h3>

            <div className="auth-card">
              <img src="/images/profile.png" alt="auth" />
              <div>
                <h4>
                  {issue.assigned_authority?.first_name}{" "}
                  {issue.assigned_authority?.last_name}
                </h4>

                <p>{issue.assigned_authority?.email}</p>
                <p>{issue.assigned_authority?.area}</p>
                <p>{issue.assigned_authority?.office_address}</p>
              </div>
            </div>

          </div>

        </div>

      </div>
    </div>
  );
}

export default IssueDetails;