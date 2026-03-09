import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Login from "./pages/Login";
import SignupType from "./pages/SignupType";
import SignupCitizen from "./pages/SignupCitizen";
import SignupAuthority from "./pages/SignupAuthority"; // <-- Import here
import './App.css';

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup-type" element={<SignupType />} />
        <Route path="/signup/citizen" element={<SignupCitizen />} />
        <Route path="/signup/authority" element={<SignupAuthority />} />
        {/* You can add more routes later */}
      </Routes>
    </Router>
  );
}

export default App;