
import React from "react";
import Navbar from "../components/navbar";
import Hero from "../components/hero";
import Features from "../components/features";
import Issues from "../components/issues";
import MapSection from "../components/mappage";
import Footer from "../components/footer";
import "./home.css";

function Home() {
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