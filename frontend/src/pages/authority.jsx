import React, { useState, useEffect } from "react";
import axios from "axios";
import Navbar from "../components/navbar";
import "../css/authority.css";
import { FaList, FaClock, FaTools, FaCheck, FaBars } from "react-icons/fa";
import { useNavigate } from "react-router-dom";
import AuthorityMap from "../components/authority_map";

function Authority() {
  const [issues, setIssues] = useState([]);
  const [openUpdate, setOpenUpdate] = useState(null);
  const [newStatus, setNewStatus] = useState("");
  const [proof, setProof] = useState(null);
  const [collapsed, setCollapsed] = useState(false);
  const [activeMenu, setActiveMenu] = useState("all");
  const navigate = useNavigate();


  useEffect(() => {
  const lastMenu = localStorage.getItem("authority_last_menu");
  if (lastMenu) {
    setActiveMenu(lastMenu);
  }
  fetchIssues();
}, []);
  useEffect(() => {
    fetchIssues();
  }, []);

  const fetchIssues = async () => {
  try {
    
    const token = localStorage.getItem("token");
    if (!token) {
      console.error("No token found, please login again.");
      return;
    }
    
    console.log("Token:", token); 
    const response = await axios.get(
          "http://127.0.0.1:8000/api/authority/issues/",
          {
            headers: {
              Authorization: `Bearer ${token}`,
            },
          }
        );
        console.log("Authority API response:", response.data); 
        setIssues(response.data);
      } catch (error) {
        console.error("Error fetching issues:", error);
      }
    };
  
    const handleMenuChange = (menu) => {
  setActiveMenu(menu);
  localStorage.setItem("authority_last_menu", menu);
};

  const filteredIssues =
    activeMenu === "all"
      ? issues
      : activeMenu === "map"
      ? issues
      : issues.filter((issue) => issue.status === activeMenu);

  const handleUpdate = (id) => {
    if (openUpdate === id) {
      setOpenUpdate(null);
      setNewStatus("");
      setProof(null);
    } else {
      setOpenUpdate(id);
    }
  };

  const submitUpdate = async (id) => {
    if (!newStatus) {
      alert("Please select a status.");
      return;
    }

    // Proof is required ONLY for resolved
    if (newStatus === "resolved" && !proof) {
      alert("Please upload proof image for resolved status.");
      return;
    }

    const formData = new FormData();
    formData.append("status", newStatus);

    if (proof) {
      formData.append("proof", proof);
    }

    try {
      await axios.patch(
        `http://127.0.0.1:8000/api/issues/${id}/update/`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
            Authorization: `Bearer ${localStorage.getItem("token")}`,
          },
        }
      );

      fetchIssues();

      setOpenUpdate(null);
      setNewStatus("");
      setProof(null);
    } catch (error) {
      console.error("Error updating issue:", error);
    }
  };

  return (
    <div className="dashboard-container">
      <Navbar />

      <div className="dashboard-body">
        {/* SIDEBAR */}
        <div className={`sidebar ${collapsed ? "collapsed" : ""}`}>
          <div className="toggle-btn" onClick={() => setCollapsed(!collapsed)}>
            <FaBars />
          </div>

          <div className="profile">
            <div className="avatar">A</div>
            {!collapsed && (
              <div>
                <p className="name">Authority</p>
                <span className="role">Roads Department</span>
              </div>
            )}
          </div>

          <div
            className={`menu-item ${activeMenu === "all" ? "active" : ""}`}
            onClick={() => setActiveMenu("all")}
          >
            <span>
              <FaList /> {!collapsed && "All Issues"}
            </span>
            {!collapsed && <span className="count">{issues.length}</span>}
          </div>

          <div
            className={`menu-item ${activeMenu === "pending" ? "active" : ""}`}
            onClick={() => setActiveMenu("pending")}
          >
            <span>
              <FaClock /> {!collapsed && "Pending"}
            </span>
            {!collapsed && (
              <span className="count">
                {issues.filter((i) => i.status === "pending").length}
              </span>
            )}
          </div>

          <div
            className={`menu-item ${
              activeMenu === "in_progress" ? "active" : ""
            }`}
            onClick={() => setActiveMenu("in_progress")}
          >
            <span>
              <FaTools /> {!collapsed && "In Progress"}
            </span>
            {!collapsed && (
              <span className="count">
                {issues.filter((i) => i.status === "in_progress").length}
              </span>
            )}
          </div>

          <div
            className={`menu-item ${
              activeMenu === "resolved" ? "active" : ""
            }`}
            onClick={() => setActiveMenu("resolved")}
          >
            <span>
              <FaCheck /> {!collapsed && "Resolved"}
            </span>
            {!collapsed && (
              <span className="count">
                {issues.filter((i) => i.status === "resolved").length}
              </span>
            )}
          </div>

          <div
            className={`menu-item ${activeMenu === "map" ? "active" : ""}`}
            onClick={() => handleMenuChange("map")}
          >
            <span>🗺️ {!collapsed && "Map View"}</span>
          </div>

        </div>

        {/* RIGHT PANEL */}
        <div className="contentt">
          
          {activeMenu === "map" ? (
            <div className="map-container">
              <AuthorityMap issues={issues} />
            </div>
          ) : (
            <>
              <h2>
                {activeMenu === "all"
                  ? "All Issues"
                  : activeMenu === "pending"
                  ? "Pending Issues"
                  : activeMenu === "in_progress"
                  ? "In Progress Issues"
                  : "Resolved Issues"}
              </h2>

              <div className="issues-grid">
                {filteredIssues.map((issue) => (
                  <div className="card" key={issue.id}>
                    <img src={issue.photo} alt={issue.title} />

                    <div className="card-body">
                      <span
                        className={
                          issue.status === "pending"
                            ? "status pending"
                            : issue.status === "in_progress"
                            ? "status progress"
                            : "status resolved"
                        }
                      >
                        {issue.status}
                      </span>

                      <h3>{issue.title}</h3>
                      <p>{issue.description}</p>

                      <div className="card-buttons">
                        <button
                          className="buttonau"
                          onClick={() => navigate(`/issue/${issue.id}`)}
                        >
                          View Details
                        </button>

                        <button
                          className="buttonau"
                          onClick={() => handleUpdate(issue.id)}
                        >
                          Update
                        </button>
                      </div>

                      {openUpdate === issue.id && (
                        <div className="update-panel">
                          <label>
                            Select Status <span className="required">*</span>
                          </label>

                          <select
                            value={newStatus}
                            onChange={(e) => setNewStatus(e.target.value)}
                          >
                            <option value="">Select Status</option>
                            <option value="pending">Pending</option>
                            <option value="in_progress">In Progress</option>
                            <option value="resolved">Resolved</option>
                          </select>

                          {newStatus === "resolved" && (
                            <>
                              <label>
                                Upload Proof Image{" "}
                                <span className="required">*</span>
                              </label>
                              <input
                                type="file"
                                onChange={(e) => setProof(e.target.files[0])}
                              />
                            </>
                          )}

                          <button
                            className="submit-btn"
                            onClick={() => submitUpdate(issue.id)}
                          >
                            Submit
                          </button>
                        </div>
                      )}
                    </div>
                  </div>
                ))}
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

export default Authority;