import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import "leaflet/dist/leaflet.css";

import Login from "./pages/Login";
import SignupType from "./pages/SignupType";
import SignupCitizen from "./pages/SignupCitizen";
import SignupAuthority from "./pages/SignupAuthority";
import ProblemMap from "./components/map";
import Home from "./pages/home";

import ReportIssue from "./pages/reportissueform";
import IssueDetails from "./pages/issuedetail";

import ProtectedRoute from "./protectedroute";

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

        <Route element={<ProtectedRoute />}>
          <Route path="/report-issue" element={<ReportIssue />} />
          <Route path="/issue/:id" element={<IssueDetails />} />
        </Route>
        

      </Routes>
    </Router>
  );
}

export default App;