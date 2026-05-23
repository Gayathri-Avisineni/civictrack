import React, { useEffect, useState } from "react";
import axios from "axios";
import "../css/all_issues.css";

function AllIssues() {
  const [issues, setIssues] = useState([]);
  const [filteredIssues, setFilteredIssues] = useState([]);
  const [categories, setCategories] = useState([]);
  const [statusFilter, setStatusFilter] = useState("all");
  const [categoryFilter, setCategoryFilter] = useState("all");

  // Fetch categories from backend
  useEffect(() => {
    fetch("https://civictrack-mlhg.onrender.com/api/categories/")
      .then((res) => res.json())
      .then((data) => setCategories(data))
      .catch((err) => console.error(err));
  }, []);

  // Fetch issues from backend
  useEffect(() => {
  axios
    .get("https://civictrack-mlhg.onrender.com/api/issues/")
    .then((res) => {
      console.log("Issues fetched:", res.data);
      setIssues(res.data);
      setFilteredIssues(res.data);
    })
    .catch((err) => console.error(err));
}, []);
  
  

  // Filter issues based on status and category
  useEffect(() => {
    let data = [...issues];

    // Filter by status
    if (statusFilter !== "all") {
      data = data.filter((i) => i.status === statusFilter);
    }

    // Filter by category
    if (categoryFilter !== "all") {
      data = data.filter((i) => i.category === categoryFilter);
    }

    setFilteredIssues(data);
  }, [statusFilter, categoryFilter, issues]);
    
  

  return (
    <div className="issues-page">
      <h1 className="issues-title">All Issues</h1>

      {/* STATUS FILTERS */}
      <div className="filters-row">
        <button
          className={`status-chip all ${statusFilter === "all" ? "active" : ""}`}
          onClick={() => setStatusFilter("all")}
        >
          All
        </button>

        <button
          className={`status-chip pending ${statusFilter === "pending" ? "active" : ""}`}
          onClick={() => setStatusFilter("pending")}
        >
          Pending
        </button>

        <button
          className={`status-chip progress ${statusFilter === "in_progress" ? "active" : ""}`}
          onClick={() => setStatusFilter("in_progress")}
        >
          In Progress
        </button>

        <button
          className={`status-chip resolved ${statusFilter === "resolved" ? "active" : ""}`}
          onClick={() => setStatusFilter("resolved")}
        >
          Resolved
        </button>
      </div>

      {/* CATEGORY FILTERS */}
      <div className="filters-row">
        <button
          className={categoryFilter === "all" ? "category-chip selected" : "category-chip"}
          onClick={() => setCategoryFilter("all")}
        >
          All
        </button>

        {categories.map((cat) => (
          <button
            key={cat.id}
            className={categoryFilter === cat.id ? "category-chip selected" : "category-chip"}
            onClick={() => setCategoryFilter(cat.id)} // cat.id is already a number
          >
            {cat.name}
          </button>
        ))}
        
      </div>

      {/* ISSUES GRID */}
      <div className="issues-grid">
        {filteredIssues.map((issue) => (
          <div className="issue-card" key={issue.id}>
            {/* STATUS BADGE */}
            <span className={`status-badge ${issue.status}`}>
              {issue.status.replace("_", " ").toUpperCase()}
            </span>

            {/* IMAGE */}
            <img
              src={issue.photo}
              onError={(e) => (e.target.src = "/fallback.jpg")}
              className="issue-img"
              alt="Issue"
            />

            <div className="issue-content">
              {/* CATEGORY COLOR STRIP */}
              <div className={`category-strip ${issue.category.name}`} />

              <h3 className="issue-title">{issue.title}</h3>
              <p className="issue-desc">{issue.description}</p>

              {/* AREA */}
              <p className="issue-area">
                <b>Area:</b> {issue.area}
              </p>

              <div className="issue-footer">
                <span className="category-tag">{issue.category.name}</span>

                {/* VIEW DETAILS LINK */}
                <a href={`/issue/${issue.id}`} className="view-btn">
                  View Details 
                </a>
              </div>
            </div>
          </div>
        ))}

        {filteredIssues.length === 0 && (
          <p className="no-data">No issues found.</p>
        )}
      </div>
    </div>
  );
}

export default AllIssues;