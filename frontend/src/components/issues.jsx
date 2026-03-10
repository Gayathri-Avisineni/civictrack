import React from "react";

function Issues() {
  
  return (
    <div className="issues">

      <h2>Recent Issues Reported</h2>

      <div className="issue-cards">

        <div className="card">
          <img src="https://images.unsplash.com/photo-1597764699513-8b3f1e3b6f5e" alt="" />
          <h3>Pothole on Main Street</h3>
          <p>Location : 4 minutes ago</p>
        </div>

        <div className="card">
          <img src="https://images.unsplash.com/photo-1563720223185-11003d516935" alt="" />
          <h3>Broken Streetlamp</h3>
          <p>Oak Avenue, Ward 3</p>
        </div>

        <div className="card">
          <img src="https://images.unsplash.com/photo-1581579188871-45ea61f2a5ac" alt="" />
          <h3>Garbage Overflow</h3>
          <p>Status : Resolved</p>
        </div>

      </div>

    </div>
  );
}

export default Issues;