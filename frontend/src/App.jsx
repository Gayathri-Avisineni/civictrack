import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

import Login from "./pages/Login";
import SignupType from "./pages/SignupType";
import SignupCitizen from "./pages/SignupCitizen";
import SignupAuthority from "./pages/SignupAuthority";
import ProblemMap from "./components/map";
import Home from "./pages/home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/login" element={<Login />} />
        <Route path="/signup-type" element={<SignupType />} />
        <Route path="/signup/citizen" element={<SignupCitizen />} />
        <Route path="/signup/authority" element={<SignupAuthority />} />
        <Route path="/map" element={<ProblemMap />} />
        <Route path="/home" element={<Home />} />
      </Routes>
    </Router>
  );
}

export default App;
