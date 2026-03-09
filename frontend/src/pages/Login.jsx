import React, { useState } from "react";
import "./Login.css";
import axios from "axios";



function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});

  const handleLogin = async (e) => {
  e.preventDefault();

  setErrors({});

  try {
    const response = await axios.post(
      "http://127.0.0.1:8000/api/citizen/login/",
      {
        login: login,
        password: password
      }
    );

    // store user
    localStorage.setItem("user", JSON.stringify(response.data.user));
    localStorage.setItem("role", response.data.role);
    localStorage.setItem("username", response.data.user.username);

    alert("Login successful");

    
    const role = response.data.role;

    if (role === "citizen") {
      window.location.href = "/citizen-dashboard";
    } 
    else if (role === "authority") {
      window.location.href = "/authority-dashboard";
    }

  } catch (error) {

    if (error.response && error.response.data) {
      setErrors(error.response.data);
    }

  }
};
  return (
    <div className="login-wrapper">
      <div className="login-card">

        <h1 className="brand">CivicTrack</h1>
        <p className="subtitle">Solve local problems faster</p>

        <form className="login-form" onSubmit={handleLogin}>

          {/* Username */}
          <div className="field-login">
            <input
              type="text"
              required
              onChange={(e) => setLogin(e.target.value)}
            />
            <label>Email or Username</label>

            {errors.login && <p className="error">{errors.login[0]}</p>}
          </div>

          {/* Password */}
          <div className="field-login password-field">
           <input
              type={showPassword ? "text" : "password"}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <label>Password</label>
            {errors.password && <p className="error">{errors.password[0]}</p>}

            <span
              className="toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <div className="options">
            <a href="#" className="forgot">Forgot password?</a>
          </div>

          <button className="login-btn">Login</button>

          <p className="register-text">
            Don’t have an account? <a href="/signup-type">Sign up</a>
          </p>

        </form>

      </div>
    </div>
  );
}

export default Login;