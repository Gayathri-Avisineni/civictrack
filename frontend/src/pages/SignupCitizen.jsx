import React, { useState } from "react";
import "./SignupCitizen.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import axios from "axios";

function SignupCitizen() {

  // password show/hide state
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  // form data state
  const [formData, setFormData] = useState({
    full_name: "",
    email: "",
    phone: "",
    username: "",
    password: ""
  });

  // confirm password state
  const [confirmPassword, setConfirmPassword] = useState("");

  // errors state
  const [errors, setErrors] = useState({});

  // show/hide password
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  // show/hide confirm password
  const toggleConfirm = () => {
    setShowConfirm(!showConfirm);
  };

  // input change handler
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  // form submit
  const handleSubmit = async (e) => {

    e.preventDefault();

    // clear old errors
    setErrors({});

    let newErrors = {};

    // password length check
    if (formData.password.length < 8) {
      newErrors.password =
        "Password must be at least 8 characters";
    }

    // confirm password check
    if (formData.password !== confirmPassword) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    // if errors exist stop form submit
    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    try {

      // signup api call
      const response = await axios.post(
        "http://127.0.0.1:8000/api/citizen/signup/",
        formData
      );

      // store user data in localStorage
      localStorage.setItem(
        "user",
        JSON.stringify(response.data.user)
      );

      localStorage.setItem(
        "role",
        response.data.role
      );

      localStorage.setItem(
        "token",
        response.data.access
      );

      localStorage.setItem(
        "refresh",
        response.data.refresh
      );

      localStorage.setItem(
        "email",
        response.data.user.email
      );

      localStorage.setItem(
        "username",
        response.data.user.username
      );

      // redirect dashboard
      window.location.href = "/home";

    } catch (error) {

      // backend validation errors
      if (error.response?.data) {
        setErrors(error.response.data);
      }
    }
  };

  return (
    <div className="citizen-wrapper">
      <div className="citizen-card">

        <h1 className="citizen-brand">
          Citizen Signup
        </h1>

        <p className="citizen-subtitle">
          Join CivicTrack and start reporting issues
        </p>

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
            <label htmlFor="citizen-fullname">
              Full Name
            </label>
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

            <label htmlFor="citizen-email">
              Email
            </label>

            {errors.email && (
              <p className="error">
                {errors.email[0]}
              </p>
            )}
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

            <label htmlFor="citizen-phone">
              Phone Number
            </label>
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

            <label htmlFor="citizen-username">
              Username
            </label>

            {errors.username && (
              <p className="error">
                {errors.username[0]}
              </p>
            )}
          </div>

          {/* Password */}
          <div className="citizen-field password-field">
            <input
              id="citizen-password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              name="password"
              required
              onChange={handleChange}
            />

            <label htmlFor="citizen-password">
              Password
            </label>

            {errors.password && (
              <p className="error">
                {Array.isArray(errors.password)
                  ? errors.password[0]
                  : errors.password}
              </p>
            )}

            <span
              className="toggle"
              onClick={togglePassword}
            >
              {showPassword
                ? <AiOutlineEyeInvisible />
                : <AiOutlineEye />}
            </span>
          </div>

          {/* Confirm Password */}
          <div className="citizen-field password-field">
            <input
              id="citizen-confirmpassword"
              type={
                showConfirm
                  ? "text"
                  : "password"
              }
              required
              onChange={(e) =>
                setConfirmPassword(e.target.value)
              }
            />

            <label htmlFor="citizen-confirmpassword">
              Confirm Password
            </label>

            {errors.confirmPassword && (
              <p className="error">
                {errors.confirmPassword}
              </p>
            )}

            <span
              className="citizen-toggle"
              onClick={toggleConfirm}
            >
              {showConfirm
                ? <AiOutlineEyeInvisible />
                : <AiOutlineEye />}
            </span>
          </div>

          <button
            type="submit"
            className="citizen-signup-btn"
          >
            Sign Up
          </button>

        </form>

        <p className="citizen-register-text">
          Already have an account?
          <a href="/Login"> Login</a>
        </p>

      </div>
    </div>
  );
}

export default SignupCitizen;