import React from "react";
import "../assets/css/landing-page.css";
import { useNavigate } from "react-router-dom";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import animationGif from "../assets/img/animation-loop.gif";
import Footer from "../components/footer";
import Navigation from "../components/navigation";

function LandingPage() {
  const navigate = useNavigate();

  const handleGetStarted = (e) => {
    if(e) e.preventDefault();
    navigate("/student-home-page");
  };

  return (
    <div className="root">
      <div className="landingpage-container">
        <Navigation />
        <div id="header-container">
          <div className="content-header">
            <h1 className="content-title">
              Master <span id="chemStruc">Chemical Structures</span> Through{" "}
              <span id="play">Play</span>
            </h1>
            <p className="content-desc">
              Build, explore, and learn molecular structures in our engaging 2D
              chemistry game. Perfect for students, educators, and chemistry
              enthusiasts.
            </p>
            <div className="content-buttons">
              <a href="#" onClick={handleGetStarted} className="btn-get-started">
                Get Started
              </a>
              <a href="/about-us" className="btn-learn-more">
                Learn More
              </a>
            </div>
          </div>
          <div id="gif-container">
            <img src={animationGif} alt="Chemistry GIF" className="gif-image" />
          </div>
        </div>
        

        <footer>
          <Footer />
        </footer>
      </div>


    </div>
  );
}

export default LandingPage;