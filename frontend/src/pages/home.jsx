
import React from "react";
import Navbar from "../components/navbar";
import Hero from "../components/hero";
import Features from "../components/features";
import Issues from "../components/issues";
import MapSection from "../components/mappage";
import Footer from "../components/footer";
import "./home.css";
import { useEffect } from "react";

function Home() {
  // 🔥 Disable back button on Home page
  useEffect(() => {
    window.history.pushState(null, "", window.location.href);
    window.onpopstate = function () {
      window.history.go(1);
    };
  }, []);

  return (
    <div>
      <Navbar />
      <Hero />
      <Features />
      <Issues />
      <MapSection />
      <Footer/>
    </div>
  );
}

export default Home;