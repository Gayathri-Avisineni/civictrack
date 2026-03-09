// src/App.js
import "./App.css";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import ProblemMap from "./components/map";
import Home from "./pages/home";

function App() {
  return (
    <Router>
      <Routes>
        <Route path="/map" element={<ProblemMap />} />
        <Route path="/home" element={<Home />}/>
      </Routes>
    </Router>
  );
}

export default App;
