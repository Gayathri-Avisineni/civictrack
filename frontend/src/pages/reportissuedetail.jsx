import React from "react";
import "../css/reportissuedetail.css";
import IssueMap from "../components/reportissuedetailmap";

function IssueDetails() {

  // Example saved coordinates from database
  const location = {
    lat: 17.385044,
    lng: 78.486671
  };

  return (

    <div className="issue-page">

      <div className="issue-container">

        {/* LEFT SECTION */}

        <div className="issue-left">

          <h1>Pothole on Main Street</h1>

          <div className="issue-info">

            <span className="status">In Progress</span>

            <span className="date">Date Reported: March 15, 2024</span>

          </div>

          <div className="photos">

            <img src="/images/pathhole.jpeg" alt="problem"/>

          </div>

          {/* Updates */}

          <div className="updates">

            <h2>Updates</h2>

            <div className="update-card">

              <h4>April 2, 2024</h4>

              <p>
              Maintenance team inspected the pothole and repair work
              has been scheduled.
              </p>

            </div>

            <div className="update-card">

              <h4>March 18, 2024</h4>

              <p>
              Issue assigned to Roads & Buildings Department.
              </p>

            </div>

            <div className="update-card">

              <h4>March 15, 2024</h4>

              <p>
              Issue successfully reported by the citizen.
              </p>

            </div>

          </div>

        </div>

        {/* RIGHT SECTION */}

        <div className="issue-right">

          {/* Location */}

          <div className="card">

            <h3>Location</h3>

            <p>Main Street, near 5th Avenue</p>

            <p>Ward 4, Downtown</p>

            <p>Pincode: 500020</p>

            {/* MAP */}

            <div className="map-container">

              <IssueMap
                lat={location.lat}
                lng={location.lng}
              />

            </div>

          </div>

          {/* Authority */}

          <div className="card authority">

            <h3>Assigned Authority</h3>

            <img src="/images/profile.png" alt="authority"/>

            <h4>Rajesh Kumar</h4>

            <p>Supervisor</p>

            <p>Roads & Buildings Department</p>

            <p>📞 (555) 678-1234</p>

            <p>✉ r.kumar@city.gov</p>

            <p className="exp">

              Rajesh Kumar has over 8 years of experience managing road
              repair operations and coordinating maintenance teams
              across the city.

            </p>

          </div>

          {/* Problem */}

          <div className="card problem">

            <h3>About the Problem</h3>

            <p>

              A large pothole has formed on Main Street near the 5th
              Avenue intersection. The damage has been causing
              inconvenience to commuters and increasing the risk
              of accidents, especially during night time.

              Local residents have reported multiple vehicle damages
              and traffic slowdowns due to this issue.

              Immediate repair is required to ensure public safety
              and smooth traffic movement.

            </p>

          </div>

        </div>

      </div>

    </div>

  );

}

export default IssueDetails;