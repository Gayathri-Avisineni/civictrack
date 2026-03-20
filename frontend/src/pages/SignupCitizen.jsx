import React, { useState } from "react";
import "./SignupCitizen.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";

function SignupCitizen() {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    username: "",
    password: ""
  });
  const [confirmPassword, setConfirmPassword] = useState("");
  const [errors, setErrors] = useState({});

  const togglePassword = () => setShowPassword(!showPassword);
  const toggleConfirm = () => setShowConfirm(!showConfirm);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
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
    const response = await axios.post(
      "http://127.0.0.1:8000/api/citizen/signup/",
      formData
    );

  

    const loginResponse = await axios.post(
  "http://127.0.0.1:8000/api/citizen/login/",
  {
    login: formData.email,
    password: formData.password
  }
);

// user data store
localStorage.setItem("user", JSON.stringify(loginResponse.data.user));
localStorage.setItem("role", loginResponse.data.role);
localStorage.setItem("username", loginResponse.data.user.username);

// redirect to dashboard
window.location.href = "/home";

  } catch (error) {

    if (error.response && error.response.data) {
      setErrors(error.response.data);
    }

  }
};

  return (
    <div className="citizen-wrapper">
      <div className="citizen-card">
        <h1 className="citizen-brand">Citizen Signup</h1>
        <p className="citizen-subtitle">Join CivicTrack and start reporting issues</p>

        <form onSubmit={handleSubmit}>

          {/* Full Name */}
          <div className="citizen-field">
            <input 
              id="citizen-fullname"
              type="text"
              name="full_name"
              required
              onChange={handleChange}
            />
            <label htmlFor="citizen-fullname">Full Name</label>
          </div>

          {/* Email */}
          <div className="citizen-field">
            <input 
              id="citizen-email"
              type="email"
              name="email"
              required
              onChange={handleChange}
            />
            <label htmlFor="citizen-email">Email</label>

            {errors.email && <p className="error">{errors.email[0]}</p>}
          </div>

          {/* Phone */}
          <div className="citizen-field">
            <input 
              id="citizen-phone"
              type="tel"
              name="phone"
              required
              onChange={handleChange}
            />
            <label htmlFor="citizen-phone">Phone Number</label>
          </div>

          {/* Username */}
          <div className="citizen-field">
            <input 
              id="citizen-username"
              type="text"
              name="username"
              required
              onChange={handleChange}
            />
            <label htmlFor="citizen-username">Username</label>
            {errors.username && <p className="error">{errors.username[0]}</p>}
          </div>

          {/* Password */}
          <div className="citizen-field password-field">
            <input 
              id="citizen-password"
              type={showPassword ? "text" : "password"}
              name="password"
              required
              onChange={handleChange}
            />
            <label htmlFor="citizen-password">Password</label>
            {errors.password && <p className="error">{errors.password}</p>}
            <span className="toggle" onClick={togglePassword}>
              {showPassword ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="citizen-field password-field">
            <input 
              id="citizen-confirmpassword"
              type={showConfirm ? "text" : "password"}
              required
              onChange={(e) => setConfirmPassword(e.target.value)}
            />
            <label htmlFor="citizen-confirmpassword">Confirm Password</label>
            {errors.confirmPassword && <p className="error">{errors.confirmPassword}</p>}
            <span className="citizen-toggle" onClick={toggleConfirm}>
              {showConfirm ? <AiOutlineEyeInvisible /> : <AiOutlineEye />}
            </span>
          </div>

          <button type="submit" className="citizen-signup-btn">
            Sign Up
          </button>

        </form>

        <p className="citizen-register-text">
          Already have an account? <a href="/Login">Login</a>
        </p>
      </div>
    </div>
  );
}

export default SignupCitizen;