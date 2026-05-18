import React from "react";
import Navigation from "../components/navigation";
import Footer from "../components/footer";
import "../assets/css/about-us.css";

import dollanoImg from "../assets/img/dollano.jpg";
import hortezanoImg from "../assets/img/hortezano.png";
import segalleImg from "../assets/img/segalle.png";
import huyoaImg  from "../assets/img/huyoa.jpg"
import dakayImg from "../assets/img/dakay.jpg"

import defaultAvatar from "../assets/img/robo-avatar.png"; 

const teamMembers = [
  {
    name: "Jericho Sam M. Dollano",
    role: "Frontend Developer",
    image: dollanoImg,
  },
  {
    name: "Abram John R. Hortezano",
    role: "Backend Developer",
    image: hortezanoImg,
  },
  {
    name: "Rey Mar R. Segalle",
    role: "Frontend Developer",
    image: segalleImg,
  },
  {
    name: "Miguel Antonio T. Dakay",
    role: "Quality Assurance & Frontend Developer",
    image: dakayImg,
  },
  {
    name: "Mark Edwin E. Huyo-a",
    role: "Backend Developer",
    image: huyoaImg,
  },
];

const AboutUs = () => {
  return (
    <div className="about-us-root">
      <Navigation />
      
      <div className="about-content">
        <header className="about-header">
          <h1 className="about-title">
            Meet the <span className="highlight">Team</span>
          </h1>
          <p className="about-description">
            The creative minds behind <strong>Elementopia</strong>. We are a group of passionate 
            developers and students dedicated to making chemistry education fun, 
            interactive, and accessible for everyone.
          </p>
        </header>

        {/* Team Grid Section */}
        <section className="team-section">
          <div className="team-grid">
            {teamMembers.map((member, index) => (
              <div key={index} className="team-card">
                <div className="image-container">
                  <img 
                    src={member.image} 
                    alt={member.name} 
                    className="team-img" 
                  />
                </div>
                <div className="member-info">
                  <h3 className="member-name">{member.name}</h3>
                  <span className="member-role">{member.role}</span>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>

      <Footer />
    </div>
  );
};

export default AboutUs;