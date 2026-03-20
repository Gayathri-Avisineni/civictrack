import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import "./Login.css";
import axios from "axios";



function Login() {
  const [showPassword, setShowPassword] = useState(false);
  const [login, setLogin] = useState("");
  const [password, setPassword] = useState("");
  const [errors, setErrors] = useState({});
  const navigate = useNavigate();
  const location = useLocation();

  const from = location.state?.from || "/home";

  
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
    console.log(response.data);   

    // store user
    localStorage.setItem("user", JSON.stringify(response.data.user));
    localStorage.setItem("role", response.data.role);
    localStorage.setItem("username", response.data.user.username);

    console.log("TOKEN:", response.data.access);
    localStorage.setItem("token", response.data.access);
    console.log("STORED:", localStorage.getItem("token"));
    
    const role = response.data.role;

    if (role === "citizen") {
      navigate(from, { replace: true });
    } 
    else if (role === "authority") {
      navigate("/authority-dashboard", { replace: true });
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
              id="login"
              type="text"
              required
              onChange={(e) => setLogin(e.target.value)}
            />
            <label htmlFor="login">Email or Username</label>

            {errors.login && <p className="error">{errors.login[0]}</p>}
          </div>

          {/* Password */}
          <div className="field-login password-field">
           <input
              id="login-password"
              type={showPassword ? "text" : "password"}
              required
              onChange={(e) => setPassword(e.target.value)}
            />
            <label htmlFor="login-password">Password</label>
            {errors.password && <p className="error">{errors.password[0]}</p>}

            <span
              className="toggle"
              onClick={() => setShowPassword(!showPassword)}
            >
              {showPassword ? "🙈" : "👁️"}
            </span>
          </div>

          <div className="options">
            <a href="/forget-password" className="forgot">Forgot password?</a>
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