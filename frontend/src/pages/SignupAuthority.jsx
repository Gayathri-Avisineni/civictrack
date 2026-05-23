import React, { useState, useEffect } from "react";
import axios from "axios";
import "./SignupAuthority.css";
import { AiOutlineEye, AiOutlineEyeInvisible } from "react-icons/ai";
import { toast } from "react-toastify";


function SignupAuthority() {

  const [showPassword, setShowPassword] = useState(false);
  const [showConfirm, setShowConfirm] = useState(false);

  const [fileName, setFileName] = useState("No file chosen");


  const [categories, setCategories] = useState([]);

  const [formData, setFormData] = useState({
    first_name: "",
    last_name: "",
    email: "",
    phone: "",
    username: "",
    pincode: "",
    category: "",
    area: "",
    employee_id: "",
    office_address: "",
    password: ""
  });

  const [confirmPassword, setConfirmPassword] = useState("");
  const [document, setDocument] = useState(null);
  const [errors, setErrors] = useState({});

  // ---------------- FETCH CATEGORIES ----------------
  useEffect(() => {
    axios
      .get("https://civictrack-mlhg.onrender.com/api/categories/")
      .then((res) => {
        setCategories(res.data);
      })
      .catch((err) => {
        console.error("Error fetching categories", err);
      });
  }, []);

  // ---------------- PASSWORD TOGGLE ----------------
  const togglePassword = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirm = () => {
    setShowConfirm(!showConfirm);
  };

  // ---------------- INPUT CHANGE ----------------
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });

    // remove error while typing
    setErrors((prev) => ({
      ...prev,
      [e.target.name]: ""
    }));
  };

  // ---------------- FILE CHANGE ----------------
  const handleFileChange = (e) => {

    const file = e.target.files[0];

    if (!file) return;

    if (file.size > 5 * 1024 * 1024) {
      setErrors({
        document: ["File must be less than 5MB"]
      });
      return;
    }

    setDocument(file);
    setFileName(file.name);

    setErrors((prev) => ({
      ...prev,
      document: ""
    }));
  };

  // ---------------- SUBMIT ----------------
  const handleSubmit = async (e) => {

    e.preventDefault();

    let newErrors = {};

    // password validation
    if (formData.password.length < 8) {
      newErrors.password =
        "Password must be at least 8 characters";
    }

    // confirm password
    if (formData.password !== confirmPassword) {
      newErrors.confirmPassword =
        "Passwords do not match";
    }

    // document validation
    if (!document) {
      newErrors.document =
        ["Please upload a document"];
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

      const response = await axios.post(
        "https://civictrack-mlhg.onrender.com/api/authority/signup/",
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data"
          }
        }
      );

      
      toast.success(
        response.data.message ||
        "Access request submitted successfully!",
        {
          position: "top-right",
          autoClose: 3000,
          closeOnClick: true,
          pauseOnHover: true,
          draggable: true,
        }
      );
      

      // reset form
      setFormData({
        first_name: "",
        last_name: "",
        email: "",
        phone: "",
        username: "",
        pincode: "",
        category: "",
        area: "",
        employee_id: "",
        office_address: "",
        password: ""
      });

      setConfirmPassword("");
      setDocument(null);
      setFileName("No file chosen");
      setErrors({});


    } catch (error) {

        toast.error(
          "Signup failed. Please try again"
        );

        if (error.response?.data) {
          setErrors(error.response.data);
        }
      }

    
  };

  return (
    <div className="authority-wrapper">
      <div className="authority-card">

        <h1 className="authority-brand">
          Authority Signup
        </h1>

        <p className="authority-subtitle">
          Submit your official details to request access
        </p>


        <form
          className="authority-form"
          onSubmit={handleSubmit}
        >

          {/* First Name & Last Name */}
          <div className="authority-form-row">

            <div className="authority-field">
              <input
                id="first_name"
                type="text"
                name="first_name"
                value={formData.first_name}
                placeholder=" "
                required
                onChange={handleChange}
              />
              <label htmlFor="first_name">
                First Name
              </label>
            </div>

            <div className="authority-field">
              <input
                id="last_name"
                type="text"
                name="last_name"
                value={formData.last_name}
                placeholder=" "
                required
                onChange={handleChange}
              />
              <label htmlFor="last_name">
                Last Name
              </label>
            </div>

          </div>

          {/* Email & Phone */}
          <div className="authority-form-row">

            <div className="authority-field">
              <input
                id="email"
                type="email"
                name="email"
                value={formData.email}
                placeholder=" "
                required
                onChange={handleChange}
              />
              <label htmlFor="email">
                Email
              </label>

              {errors.email && (
                <p className="error">
                  {errors.email?.[0] || errors.email}
                </p>
              )}
            </div>

            <div className="authority-field">
              <input
                id="phone"
                type="tel"
                name="phone"
                value={formData.phone}
                placeholder=" "
                required
                onChange={handleChange}
              />
              <label htmlFor="phone">
                Phone Number
              </label>
            </div>

          </div>

          {/* Username */}
         <div className="authority-form-row">

          <div className="authority-field">

            <input
              id="username"
              type="text"
              name="username"
              value={formData.username}
              placeholder=" "
              required
              onChange={handleChange}
            />

            <label htmlFor="username">
              Username
            </label>

            {errors.username && (
              <p className="error">
                {errors.username?.[0] || errors.username}
              </p>
            )}

          </div>

          {/* Pincode */}
        
            <div className="authority-field">
              <input
                id="pincode"
                type="text"
                name="pincode"
                value={formData.pincode}
                placeholder=" "
                required
                onChange={handleChange}
              />
              <label htmlFor="pincode">
                Pincode
              </label>
            </div>

          </div>

          {/* Category & Employee ID */}
          <div className="authority-form-row">

            <div className="authority-field">

              <select
                id="category"
                name="category"
                value={formData.category}
                required
                onChange={handleChange}
              >
                <option value="">
                   Category
                </option>

                {categories.map((cat) => (
                  <option
                    key={cat.id}
                    value={cat.id}
                  >
                    {cat.name}
                  </option>
                ))}
              </select>

              <label htmlFor="category">
                Category
              </label>
            </div>

            <div className="authority-field">
              <input
                id="employee_id"
                type="text"
                name="employee_id"
                value={formData.employee_id}
                placeholder=" "
                required
                onChange={handleChange}
              />
              <label htmlFor="employee_id">
                Employee ID
              </label>

              {errors.employee_id && (
                <p className="error">
                  {errors.employee_id?.[0] || errors.employee_id}
                </p>
              )}
            </div>

          </div>

          {/* Office Address & Area */}
          <div className="authority-form-row">

            <div className="authority-field">
              <input
                id="office_address"
                type="text"
                name="office_address"
                value={formData.office_address}
                placeholder=" "
                required
                onChange={handleChange}
              />
              <label htmlFor="office_address">
                Office Address
              </label>
            </div>

            <div className="authority-field">
              <input
                id="area"
                type="text"
                name="area"
                value={formData.area}
                placeholder=" "
                required
                onChange={handleChange}
              />
              <label htmlFor="area">
                Area
              </label>
            </div>

          </div>

          {/* File Upload */}
          <div className="upload-field">

            <label className="upload-box">

              <div className="upload-content">
                <div className="upload-icon">📁</div>

                <p className="upload-text">
                  Click to upload official document
                </p>

                <span className="file-name">
                  {fileName}
                </span>
              </div>

              <input
                type="file"
                name="document"
                accept=".pdf,.jpg,.jpeg,.png"
                onChange={handleFileChange}
              
              />

            </label>

            {errors.document && (
              <p className="error">
                {errors.document?.[0] || errors.document}
              </p>
              
            )}

          </div>

          {/* Password */}
          
          <div className="authority-form-row">

            <div className="authority-field password-field">

              <input
                id="password"
                type={showPassword ? "text" : "password"}
                name="password"
                value={formData.password}
                placeholder=" "
                required
                onChange={handleChange}
              />

              <label htmlFor="password">
                Password
              </label>

              <span
                className="toggle"
                onClick={togglePassword}
              >
                {showPassword
                  ? <AiOutlineEyeInvisible />
                  : <AiOutlineEye />}
              </span>

              {errors.password && (
                <p className="error">
                  {errors.password}
                </p>
              )}

            </div>

            <div className="authority-field password-field">

              <input
                id="confirm_password"
                type={showConfirm ? "text" : "password"}
                value={confirmPassword}
                placeholder=" "
                required
                onChange={(e) =>
                  setConfirmPassword(e.target.value)
                }
              />

              <label htmlFor="confirm_password">
                Confirm Password
              </label>

              <span
                className="toggle"
                onClick={toggleConfirm}
              >
                {showConfirm
                  ? <AiOutlineEyeInvisible />
                  : <AiOutlineEye />}
              </span>

              {errors.confirmPassword && (
                <p className="error">
                  {errors.confirmPassword}
                </p>
              )}

            </div>
          </div>


          <button
            type="submit"
            className="authority-signup-btn"
          >
            Request Access
          </button>

          <p className="authority-register-text">
            Already have an account?
            <a href="/login"> Login</a>
          </p>

        </form>
      </div>
    </div>
  );
}

export default SignupAuthority;