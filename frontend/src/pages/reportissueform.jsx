import React, { useState } from "react";
import "../css/reportissue.css";
import ReportMap from "../components/reportissue"

export default function ReportIssue() {

  const [photos, setPhotos] = useState([]);

  const [location, setLocation] = useState({
    lat: null,
    lng: null,
    address: ""
  });

  const handlePhotoUpload = (e) => {
    setPhotos([...e.target.files]);
  };

  const handleSubmit = (e) => {

  

    if (!location.address) {
      alert("Please select location on map");
      return;
    }

    if (photos.length === 0) {
      alert("Please upload at least 1 photo");
      return;
    }

    alert("Report Submitted Successfully");

    console.log("Location:", location);
  };

  return (

    <div className="page">

      <div className="form-container">

        <div className="form-header">
          <h1>Report an Issue</h1>
          <p>Submit a civic problem you've observed.</p>
        </div>

        <form onSubmit={handleSubmit}>

          {/* Problem Details */}

          <div className="section">

            <h2>Problem Details</h2>

            <input
              type="text"
              placeholder="Problem Title"
              required
            />

            <select required>

              <option value="">Select Category</option>
              <option>Roads</option>
              <option>Drainage</option>
              <option>Water Supply</option>
              <option>Electricity</option>
              <option>Sanitation</option>
              <option>Others</option>

            </select>

            <textarea
              rows="4"
              placeholder="Describe the issue"
              required
            />


            <input type="text" placeholder="Full Address" required/>

            <input type="text" placeholder="Area / Ward" required className="area"/>

            <input type="text" placeholder="Pincode" required className="area"/>

          </div>

          {/* Map Location */}

          <div className="section">

            <h2>Select Problem Location</h2>

            <ReportMap setLocation={setLocation} />

            {location.address && (

              <div className="location-box">

                <h4>Selected Address</h4>
                <p>{location.address}</p>

              </div>

            )}

          </div>

          {/* Photo Upload */}

          <div className="section">

            <h2>Upload Photos</h2>

            <input
              type="file"
              multiple
              accept="image/*"
              onChange={handlePhotoUpload}
            />

          </div>

          {/* Reporter */}

          <div className="section">

            <h2>Reporter Information</h2>

            <input
              type="text"
              placeholder="Name (Optional)"
            />

            <input
              type="email"
              placeholder="Email"
              required
            />

          </div>

          <button className="submit-btn">
            Submit Report
          </button>

        </form>

      </div>

    </div>

  );

}