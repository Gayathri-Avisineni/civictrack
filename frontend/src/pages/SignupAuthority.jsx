import React, { useState, useRef, useEffect } from "react";
import axios from "axios";
import "./SignupAuthority.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";

function SignupAuthority() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);
  const [fileName, setFileName] = useState("No file chosen");
  const [successMessage, setSuccessMessage] = useState("");
  const messageRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [formData, setFormData] = useState({
  first_name: "",
  last_name: "",
  email: "",
  phone: "",
  username: "",
  category: "",
  area: "",
  employee_id: "",
  office_address: "",
  password: ""
});

const [confirmPassword, setConfirmPassword] = useState("");
const [document, setDocument] = useState(null);
const [errors, setErrors] = useState({});

useEffect(() => {
  axios.get("http://127.0.0.1:8000/api/categories/")
    .then((res) => {
      setCategories(res.data);
    })
    .catch((err) => {
      console.error("Error fetching categories", err);
    });
}, []);

const togglePassword = () => setShowPassword(!showPassword);
const toggleConfirm = () => setShowConfirm(!showConfirm);
const handleChange = (e) => {
  setFormData({
    ...formData,
    [e.target.name]: e.target.value
  });
};
const handleFileChange = (e) => {
  const file = e.target.files[0];

  if (file) {

    if (file.size > 5 * 1024 * 1024) {
      alert("File must be less than 5MB");
    return;
  }

  setFileName(file.name);
  setDocument(file);
}
};

const handleSubmit = async (e) => {
  e.preventDefault();

  let newErrors = {};
  if (formData.password.length < 6) {
    newErrors.password = "Password must be at least 6 characters";
  }

  if (formData.password !== confirmPassword) {
    newErrors.confirmPassword = "Passwords do not match";
  }

  if (Object.keys(newErrors).length > 0) {
    setErrors(newErrors);
    return;
  }

  try {

    const data = new FormData();

    Object.keys(formData).forEach((key) => {
      data.append(key, formData[key]);
    });

    data.append("document", document);

    await axios.post(
      "http://127.0.0.1:8000/api/authority/signup/",
      data,
      {
        headers: {
          "Content-Type": "multipart/form-data"
        }
      }
    );

    setSuccessMessage(
  "Access request submitted. Admin will review your application."
    );

  // scroll to message
    setTimeout(() => {
      messageRef.current?.scrollIntoView({ behavior: "smooth" });
    }, 100);

  } catch (error) {

    if (error.response && error.response.data) {
      setErrors(error.response.data);
    }

  }
};
  

  return (
    <div className="authority-wrapper">
      <div className="authority-card">
        <h1 className="authority-brand">Authority Signup</h1>
        <p className="authority-subtitle">Submit your official details to request access</p>

        {successMessage && (
          <div className="success-message" ref={messageRef}>
            {successMessage}
          </div>
        )}
        <form className="authority-form"  onSubmit={handleSubmit}>

          {/* First & Last Name */}
          <div className="authority-form-row">
            <div className="authority-field">
              <input
                id="authority-firstname"
                type="text"
                name="first_name"
                required
                onChange={handleChange}
              />
              <label htmlFor="authority-firstname">First Name</label>
            </div>
            <div className="authority-field">
              <input
                id="authority-lastname"
                type="text"
                name="last_name"
                required
                onChange={handleChange}
              />
              <label htmlFor="authority-lastname">Last Name</label>
            </div>
          </div>

          {/* Email & Phone */}
          <div className="authority-form-row">
            <div className="authority-field">
              <input
                id="authority-email"
                type="email"
                name="email"
                required
                onChange={handleChange}
              />
              <label htmlFor="authority-email">Email</label>
              {errors.email && <p className="error">{errors.email[0]}</p>}
            </div>
            <div className="authority-field">
              <input
                id="authority-phone"
                type="tel"
                name="phone"
                required
                onChange={handleChange}
              />
              <label htmlFor="authority-phone">Phone Number</label>
            </div>
          </div>

          {/* Username */}
          <div className="authority-field full-width">
            <input
              id="authority-username"
              type="text"
              name="username"
              required
              onChange={handleChange}
            />
            <label htmlFor="authority-username">Username</label>
            {errors.username && <p className="error">{errors.username[0]}</p>}
          </div>

          {/* Department & Official ID */}
          <div className="authority-form-row">
            <div className="authority-field">
              <select
                id="authority-category"
                name="category"
                required
                onChange={handleChange}
              >
                <option value="">Select</option>

                {categories.map((cat) => (
                  <option key={cat.id} value={cat.id}>
                    {cat.name}
                  </option>
                ))}

              </select>

              <label htmlFor="authority-category">Category</label>
            </div>
            <div className="authority-field">
              <input
                id="authority-employee-id"
                type="text"
                name="employee_id"
                required
                onChange={handleChange}
              />
              <label htmlFor="authority-employee-id">Official ID / Employee ID</label>
            </div>
          </div>

          {/* Office Address */}
          
          <div className="authority-form-row">
            <div className="authority-field">
            <input
              id="authority-office-address"
              type="text"
              name="office_address"
              required
              onChange={handleChange}
            />
            <label htmlFor="authority-office-address">Office Address</label>
          </div>
            <div className="authority-field">
              <input
                id="authority-area"
                type="text"
                name="area"
                value={formData.area}
                onChange={handleChange}
                required
              />
              <label htmlFor="authority-area">Area</label>
            </div>
          </div>
          

          {/* File Upload */}
          <div className="upload-field">
            <label className="upload-box">

              <div className="upload-content">
                <div className="upload-icon">📁</div>
                <p className="upload-text">Click to upload official document</p>
                <span className="file-name">{fileName}</span>
              </div>

              <input
                type="file"
                name="document"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
                required
              />
              

            </label>
          </div>
          {/* Password & Confirm Password */}
          <div className="authority-form-row">
            <div className="authority-field password-field">
              <input
                id="authority-password"
                type={showPassword ? "text" : "password"}
                name="password"
                required
                onChange={handleChange}
              />
              <label htmlFor="authority-password">Password</label>
              {errors.password && <p className="error">{errors.password}</p>}
              <span className="toggle" onClick={togglePassword}>
                {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
            <div className="authority-field password-field">
              <input
                id="authority-confrimpassword"
                type={showConfirm ? "text" : "password"}
                name="confirmPassword"
                required
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
              <label htmlFor="authority-confirmpassword">Confirm Password</label>
              {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
              <span className="authority-toggle" onClick={toggleConfirm}>
                {showConfirm ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
              </span>
            </div>
          </div>

          {/* Submit Button */}
          <button type="submit" className="authority-signup-btn">Request Access</button>

          {/* Login Link */}
          <p className="authority-register-text">
            Already have an account? <a href="/login">Login</a>
          </p>
        </form>
      </div>
    </div>
  );
}

export default SignupAuthority;