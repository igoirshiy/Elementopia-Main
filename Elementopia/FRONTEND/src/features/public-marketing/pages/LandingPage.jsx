import React, { useState } from "react";
import '@/assets/styles/legacy/landing-page.css';
import '@/assets/styles/global/elementopia.css';
import { useNavigate } from "react-router-dom";
import UserService from '@/features/auth-user';
import { NicknameGate } from "@/features/auth-user";

function LandingPage() {
  const navigate = useNavigate();
  const handleGetStarted = (e) => {
    if (e) e.preventDefault();
    navigate("/student-home-page");
  };

  return (
    <div className="root">
      <div className="landingpage-container">
          {/* Custom Navigation Bar matching the Screenshot */}
          <nav className="custom-navbar">
            <a className="custom-logo" href="/">
              ELEMENTOPIA
            </a>
          </nav>

        {/* Hero Section Container */}
        <div className="hero-container">
          {/* Left Column: Typography and Buttons */}
          <div className="hero-left">
            <h1 className="hero-title">
              <div className="title-row-white">MASTER</div>
              <div className="title-row-pink">CHEMICAL</div>
              <div className="title-row-pink">STRUCTURES</div>
              <div className="title-row-combined">
                <span className="title-row-white">THROUGH</span>{" "}
                <span className="title-row-yellow">PLAY</span>
              </div>
            </h1>
            
            <p className="hero-desc">
              Build, explore, and learn molecular structures in an engaging 2D
              chemistry game. Perfect for students, educators, and chemistry
              enthusiasts.
            </p>

            <div className="hero-buttons">
              <button onClick={handleGetStarted} className="btn-get-started-gradient">
                Begin Synthesis
              </button>
              {/* <a href="/about-us" className="btn-learn-more-outline">
                Learn More
              </a> */}
            </div>
          </div>

          {/* Right Column: 2D Animated Orbiting Atom */}
          <div className="hero-right">
            <div className="atom-container">
              {/* Central Glowing Gradient Nucleus */}
              <div className="atom-nucleus" />

              {/* 3 Intersecting Circular Orbit Paths */}
              <div className="atom-orbit orbit-1">
                <div className="atom-electron e1" />
                <div className="atom-electron e4" />
                <div className="atom-electron e7" />
              </div>
              
              <div className="atom-orbit orbit-2">
                <div className="atom-electron e2" />
                <div className="atom-electron e5" />
                <div className="atom-electron e8" />
                <div className="atom-electron e10" />
              </div>
              
              <div className="atom-orbit orbit-3">
                <div className="atom-electron e3" />
                <div className="atom-electron e6" />
                <div className="atom-electron e9" />
              </div>
            </div>
          </div>
        </div>


      </div>
    </div>
  );
}

export default LandingPage;