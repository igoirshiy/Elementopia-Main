import React from "react";
import "../assets/css/featurecard.css";
import logo from "../assets/img/Logo.svg";

const FeatureCard = ({ title, description, icon, className, gradient = "purple", children }) => {
  return (
    <div className={`feature-card ${gradient} ${className}`}>
      {/* Gradient accent */}
      <div className={`feature-card-accent ${gradient}`}></div>

      <div className="feature-card-header">
        <div className="feature-card-icon">{icon && <div>{icon}</div>}</div>
        <h3 className={`feature-card-title ${gradient}`}>{title}</h3>
        <img src={logo} alt="Login & Sign Up Logo" className="Logo" />
      </div>

      <div className="feature-card-content">
        <p className="feature-card-description">{description}</p>

        {/* Render children inside FeatureCard */}
        {children && <div className="feature-card-extra">{children}</div>}
      </div>
    </div>
  );
};

export default FeatureCard;
