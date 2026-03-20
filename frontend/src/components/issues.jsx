import React, { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "./issues.css";

function Issues() {

  const navigate = useNavigate();
  const [issues, setIssues] = useState([]);

  useEffect(() => {
    axios.get("http://127.0.0.1:8000/api/issues/")
      .then(res => {
        setIssues(res.data);
      })
      .catch(err => {
        console.log(err);
      });
  }, []);
  

  const getTimeAgo = (time) => {
    const diff = Math.floor((new Date() - new Date(time)) / 60000);

    if (diff < 60) return `${diff} mins ago`;
    if (diff < 1440) return `${Math.floor(diff / 60)} hrs ago`;

    return `${Math.floor(diff / 1440)} days ago`;
  };

  return (
    
    <div className="issues">

      <h2>Recent Issues Reported</h2>

      <div className="issue-cards">


        {issues.map((issue) => (
          <div className="card" key={issue.id}
          onClick={() => navigate(`/issue/${issue.id}`)}
          style={{ cursor: "pointer" }}

          >

            <img 
              src={issue.photo}
              alt="issue" 
            />

            <div className="card-body">

              <div>
                <h3>{issue.title}</h3>
                <p className="address">{issue.address}</p>
              </div>

              <div className="bottom-row">
                <p className="time">{getTimeAgo(issue.created_at)}</p>

                <span className={`status ${issue.status}`}>
                  {issue.status}
                </span>
              </div>

            </div>

          </div>
        ))}

      </div>

    </div>
  );
}

export default Issues;