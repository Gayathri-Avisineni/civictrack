import React, { useState } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/reportissue.css";
import ReportMap from "../components/reportissue"

export default function ReportIssue() {

  const navigate = useNavigate();

  useEffect(() => {

    const user = localStorage.getItem("user");

    if (!user) {
      navigate("/login", { state: { from: "/report-issue" } });
    }

  }, []);

  const [photos, setPhotos] = useState([]);
  const [title, setTitle] = useState("");
  const [categories, setCategories] = useState([]);
  const [category, setCategory] = useState("");
  const [description, setDescription] = useState("");
  const [address, setAddress] = useState("");
  const [area, setArea] = useState("");
  const [pincode, setPincode] = useState("");
  const [name, setName] = useState("");
  const [email, setEmail] = useState("");

  const [location, setLocation] = useState({
    lat: null,
    lng: null,
    address: ""
  });

  useEffect(() => {

  fetch("http://127.0.0.1:8000/api/categories/")
    .then((res) => res.json())
    .then((data) => setCategories(data));

  }, []);

  const handlePhotoUpload = (e) => {
    setPhotos([...e.target.files]);
  };

  const handleSubmit = async (e) => {

  e.preventDefault();

  if (!location.address) {
    alert("Please select location on map");
    return;
  }

  if (photos.length === 0) {
    alert("Please upload at least 1 photo");
    return;
  }

  const formData = new FormData();

    formData.append("title", title);
    formData.append("category", category);
    formData.append("description", description);
    formData.append("address", address);
    formData.append("area", area);
    formData.append("pincode", pincode);
    formData.append("latitude", location.lat);
    formData.append("longitude", location.lng);
    formData.append("reporter_name", name);
    formData.append("reporter_email", email);
    formData.append("photo", photos[0]);
    

  await fetch("http://127.0.0.1:8000/api/report-issue/", {
    method: "POST",
    body: formData
  });

  alert("Report Submitted Successfully");

};


const getCurrentLocation = () => {

  if (navigator.geolocation) {

    navigator.geolocation.getCurrentPosition(

  async (position) => {

    const lat = position.coords.latitude;
    const lng = position.coords.longitude;

    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
    );

    const data = await res.json();

    setLocation({
      lat: lat,
      lng: lng,
      address: data.display_name
    });

    setAddress(data.address.road || data.display_name);
    setArea(data.address.village || data.address.town || data.address.city || "");
    setPincode(data.address.postcode || "");

  },

  (error) => {
    alert("Location permission required");
  },

  {
    enableHighAccuracy: true
  }

);

  } else {

    alert("Geolocation is not supported by this browser.");

  }

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
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              required
            />

            <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                required
              >

              <option value="">Select Category</option>

              {categories.map((cat) => (

                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>

              ))}

              </select>

            <textarea
              rows="4"
              placeholder="Describe the issue"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Full Address"
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />

            <input
              type="text"
              placeholder="Area / Ward"
              value={area}
              onChange={(e) => setArea(e.target.value)}
              className="area"
              required
            />
           
           <input
            type="text"
            placeholder="Pincode"
            value={pincode}
            onChange={(e) => setPincode(e.target.value)}
            className="area"
            required
          />


          </div>

          {/* Map Location */}

          <div className="section">

            <h2>Select Problem Location</h2>

            <button
              type="button"
              onClick={getCurrentLocation}
              className="location-btn"
            >
              📍 Use My Current Location
            </button>
            

            <ReportMap
              location={location}
              setLocation={setLocation}
              setAddress={setAddress}
              setArea={setArea}
              setPincode={setPincode}
            />

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
              value={name}
              onChange={(e) => setName(e.target.value)}
            />

            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
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