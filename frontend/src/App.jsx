

import React from "react";
import "./App.css";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";
import "leaflet/dist/leaflet.css";

import Login from "./pages/Login";
import SignupType from "./pages/SignupType";
import SignupCitizen from "./pages/SignupCitizen";
import SignupAuthority from "./pages/SignupAuthority";
import ProblemMap from "./components/map";
import Home from "./pages/home";

import ReportIssue from "./pages/reportissueform";
import IssueDetails from "./pages/issuedetail";
import Authority from "./pages/authority";

import PrivateRoute from "./privateRoute";

import AllIssues from "./pages/all_issues";
import TrackMyComplaints from "./pages/track_my_complaints";
import SolvedIssues from "./pages/solved_issues";

import { ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";



function App() {
  return (
    <Router>

      {/* Toast Notifications */}
      <ToastContainer
        position="top-right"
        autoClose={3000}
        closeOnClick
        pauseOnHover
        draggable
      />

      <Routes>
        {/* Public Routes */}
        <Route path="/login" element={<Login />} />
        <Route path="/signup-type" element={<SignupType />} />
        <Route path="/signup/citizen" element={<SignupCitizen />} />
        <Route path="/signup/authority" element={<SignupAuthority />} />
        <Route path="/map" element={<ProblemMap />} />
        <Route path="/all-issues" element={<AllIssues />} />
        <Route path="/solved-issues" element={<SolvedIssues />} />
        
        <Route
          path="/track-my-complaints"
          element={
            <PrivateRoute allowedRoles={['citizen']}>
              <TrackMyComplaints />
            </PrivateRoute>
          }
        />

        {/* Citizen Routes */}
        <Route path="/home" element={<Home />} />

        <Route
          path="/report-issue"
          element={
            <PrivateRoute allowedRoles={["citizen"]}>
              <ReportIssue />
            </PrivateRoute>
          }
        />

        {/* Citizen + Authority (both) */}
        <Route
          path="/issue/:id"
          element={
            <PrivateRoute allowedRoles={["citizen", "authority"]}>
              <IssueDetails />
            </PrivateRoute>
          }
        />

        {/* Authority Only */}
        <Route
          path="/authority"
          element={
            <PrivateRoute allowedRoles={["authority"]}>
              <Authority />
            </PrivateRoute>
          }
        />

        {/* Fallback Route */}
        <Route path="/" element={<Home />} />

        <Route path="*" element={<Navigate to="/" replace />} />
        
      </Routes>
    </Router>
  );
}

export default App;