import React, { useState, useRef } from "react";
import { useEffect } from "react";
import { useNavigate } from "react-router-dom";
import "../css/reportissue.css";
import ReportMap from "../components/reportissue"
import axios from "axios";
import { toast } from "react-toastify";

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
  const [submitting, setSubmitting] =
  useState(false);

  const fileInputRef = useRef(null);

  const [location, setLocation] = useState({
    lat: null,
    lng: null,
    address: ""
  });
  const [locationLoading, setLocationLoading] =
useState(false);

  useEffect(() => {

  fetch("https://civictrack-mlhg.onrender.com/api/categories/")
    .then((res) => res.json())
    .then((data) => setCategories(data));

  }, []);

  const handlePhotoUpload = (e) => {
    setPhotos([...e.target.files]);
  };





const handleSubmit = async (e) => {
  e.preventDefault();

  // 1️⃣ Check if location and photo exist
  if (!location.address) {
    toast.error("Please select location on map");
    return;
  }

  if (photos.length === 0) {
    toast.error("Please upload at least 1 photo");
    return;
  }

  // 2️⃣ Prepare FormData
  const formData = new FormData();
  formData.append("title", title);
  formData.append("category", category);
  formData.append("description", description);
  formData.append("address", address);
  formData.append("area", area);
  formData.append("pincode", pincode);
  formData.append("latitude", location.lat);
  formData.append("longitude", location.lng);
  formData.append("photo", photos[0]); // single photo, use loop if multiple

  // 3️⃣ Get token
  const token = localStorage.getItem("token");
  if (!token) {
    toast.error("Please login first");
    navigate("/login");
    return;
  }

  // 4️⃣ Debugging - log everything before sending
  console.log("Token:", token);
  console.log("FormData entries:");
  for (let pair of formData.entries()) {
    console.log(pair[0], pair[1]);
  }

  setSubmitting(true);
  try {
    // 5️⃣ Send fetch request
    const res = await fetch("https://civictrack-mlhg.onrender.com/api/report-issue/", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`, // ✅ Only Authorization header
        // Do NOT set 'Content-Type', fetch handles it for FormData
      },
      body: formData,
    });

    // 6️⃣ Handle response
    if (!res.ok) {
      const errorData = await res.json();
      console.log("❌ ERROR DATA:", errorData);
      console.log("❌ STATUS:", res.status);
      toast.error("Failed to submit report");
      return;
    }

    const data = await res.json();
    console.log("✅ Report submitted successfully:", data);
    toast.success(
      "Issue reported successfully!"
    );



    // Optional: clear form
    setTitle("");
    setCategory("");
    setDescription("");
    setAddress("");
    setArea("");
    setPincode("");
    setPhotos([]);
    setLocation({ lat: null, lng: null, address: "" });
   

    // clear file input
    if (fileInputRef.current) {
      fileInputRef.current.value = "";
    }
    setSubmitting(false);

    setTimeout(() => {
    navigate("/track-complaints");
  }, 1500);

  } catch (error) {
    console.log("❌ FETCH FAILED:", error);
    setSubmitting(false);
    toast.error(
      "Network error"
    );
  }
};


  


const getCurrentLocation = () => {

  if (navigator.geolocation) {

    setLocationLoading(true);

    navigator.geolocation.getCurrentPosition(

      async (position) => {

        try {

          const lat = position.coords.latitude;
          const lng = position.coords.longitude;

          // immediately update marker
          setLocation({
            lat,
            lng,
            address: "Fetching address..."
          });

          const res = await fetch(
            `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lng}&format=json`
          );

          const data = await res.json();

          setLocation({
            lat,
            lng,
            address: data.display_name
          });

          setAddress(
            data.address.road ||
            data.display_name
          );

          setArea(
            data.address.village ||
            data.address.town ||
            data.address.city ||
            ""
          );

          setPincode(
            data.address.postcode || ""
          );

        } catch (error) {
          toast.error(
            "Failed to fetch location"
          );
        } finally {
          setLocationLoading(false);
        }
      },

      () => {
        setLocationLoading(false);
        toast.error(
          "Location permission required"
        );
      },

      
       {
          enableHighAccuracy: true,
          timeout: 15000,
          maximumAge: 0
        }
      

    );

  } else {
    toast.error(
      "Geolocation not supported"
    );
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
              disabled={locationLoading}
            >
              {locationLoading
                ? "Fetching Location..."
                : "📍 Use My Current Location"}
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
              ref={fileInputRef}
            />

            {photos.length > 0 && (
                <div className="preview-container">
                  {photos.map((photo, index) => (
                    <img
                      key={index}
                      src={URL.createObjectURL(photo)}
                      alt="preview"
                      className="preview-image"
                    />
                  ))}
                </div>
              )}

          </div>


          
          <button
            className="issue-submit-btn"
            disabled={submitting}
          >
            {submitting
              ? "Submitting..."
              : "Submit Report"}
          </button>

        </form>

      </div>

    </div>

  );

}