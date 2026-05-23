import React, { useState, useEffect } from "react";
import {
  useNavigate,
  useLocation,
  Link
} from "react-router-dom";
import "./Login.css";
import axios from "axios";
import { toast } from "react-toastify";

function Login() {

  const [showPassword, setShowPassword] =
    useState(false);

  const [login, setLogin] =
    useState("");

  const [password, setPassword] =
    useState("");

  const [errors, setErrors] =
    useState({});

  const [loading, setLoading] =
    useState(false);

  const navigate = useNavigate();
  const location = useLocation();

  const from =
    location.state?.from || "/home";

  // -------------------------
  // Redirect if already logged in
  // -------------------------
  useEffect(() => {

    const token =
      localStorage.getItem("token");

    const role =
      localStorage.getItem("role");

    if (token) {

      if (role === "citizen") {
        navigate("/home", {
          replace: true
        });
      }

      else if (role === "authority") {
        navigate("/authority", {
          replace: true
        });
      }
    }

  }, [navigate]);

  // -------------------------
  // Handle Login
  // -------------------------
  const handleLogin = async (e) => {

    e.preventDefault();

    setErrors({});
    setLoading(true);

    try {

      const response =
        await axios.post(
          "https://civictrack-mlhg.onrender.com/api/login/",
          {
            login: login.trim(),
            password: password.trim()
          }
        );
        
        console.log("LOGIN SUCCESS", response.data);

      // -------------------------
      // Save user data
      // -------------------------
      localStorage.setItem(
        "user",
        JSON.stringify(
          response.data.user
        )
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

      const role =
        response.data.role;

      toast.success(
        "Login successful!"
      );

      // -------------------------
      // Redirect by role
      // -------------------------
      const redirectMap = {
        citizen: from,
        authority: "/authority"
      };

      navigate(
        redirectMap[role] ||
        "/home",
        {
          replace: true
        }
      );

    }

    catch (error) {

      // Backend errors
      if (
        error.response?.data
      ) {

        setErrors(
          error.response.data
        );
      }

      // Server/network errors
      else {

        toast.error(
          "Server error. Please try again."
        );
      }
    }

    finally {

      setLoading(false);
    }
  };

  return (
    <div className="login-wrapper">

      <div className="login-card">

        <h1 className="brand">
          CivicTrack
        </h1>

        <p className="subtitle">
          Solve local problems faster
        </p>

        <form
          className="login-form"
          onSubmit={handleLogin}
        >

          {/* Login */}
          <div className="field-login">

            <input
              id="login"
              type="text"
              value={login}
              required
              onChange={(e) => {

                setLogin(
                  e.target.value
                );

                setErrors(
                  (prev) => ({
                    ...prev,
                    login: ""
                  })
                );
              }}
            />

            <label htmlFor="login">
              Email or Username
            </label>

            {errors.login && (
              <p className="error">
                {
                  errors.login?.[0]
                }
              </p>
            )}

          </div>

          {/* Password */}
          <div className="field-login password-field">

            <input
              id="login-password"
              type={
                showPassword
                  ? "text"
                  : "password"
              }
              value={password}
              required
              onChange={(e) => {

                setPassword(
                  e.target.value
                );

                setErrors(
                  (prev) => ({
                    ...prev,
                    password: ""
                  })
                );
              }}
            />

            <label htmlFor="login-password">
              Password
            </label>

            {errors.password && (
              <p className="error">
                {
                  errors.password?.[0]
                }
              </p>
            )}

            <span
              className="toggle"
              onClick={() =>
                setShowPassword(
                  !showPassword
                )
              }
            >
              {
                showPassword
                  ? "🙈"
                  : "👁️"
              }
            </span>

          </div>

          {/* Forgot Password */}
          <div className="options">

            <Link
              to="/forget-password"
              className="forgot"
            >
              Forgot password?
            </Link>

          </div>

          {/* Login Button */}
          <button
            className="login-btn"
            disabled={loading}
          >

            {
              loading
                ? "Logging in..."
                : "Login"
            }

          </button>

          {/* Signup */}
          <p className="register-text">

            Don’t have an account?

            <Link to="/signup-type">
              {" "}Sign up
            </Link>

          </p>

        </form>
      </div>
    </div>
  );
}

export default Login;