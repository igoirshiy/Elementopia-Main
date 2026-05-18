import React, { useState } from "react";
import "../assets/css/login-card.css";
import FeatureCard from "../components/featurecard";
import UserService from "../services/UserService";
import { useNavigate } from "react-router-dom";
import { Eye, EyeOff, User } from "lucide-react";

export default function Login({ onLoginSuccess, onSwitchToSignup }) {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    setMessage("");

    if (!username.trim() || !password.trim()) {
      setMessage("Username and password are required!");
      return;
    }

    try {
      const response = await UserService.loginUser(
        username.toLowerCase(),
        password
      );

      if (response && response.token && response.role) {
        setMessage("Login successful! Redirecting...");
        
        // Store user details in Session Storage
        sessionStorage.setItem(
          "user",
          JSON.stringify({
            token: response.token,
            role: response.role,
            id: response.id || response.userId // Store ID just in case
          })
        );

        // Wait 1.5s then redirect
        setTimeout(() => {
          if (onLoginSuccess) onLoginSuccess(); // Close the popup

          if (response.role === "STUDENT") {
            navigate("/student-home-page");
          } else if (response.role === "TEACHER") {
            navigate("/teacher/room");
          } else {
            setMessage("Unknown role. Cannot redirect.");
          }
        }, 1500);

      } else {
        setMessage(response.message || "Invalid username or password.");
      }
    } catch (error) {
      console.error("Login error:", error);
      setMessage("Login failed. Please try again.");
    }
  };

  return (
    <div className="login-container">
      <FeatureCard className="login" description="Sign In" gradient="mixed">
        
        {/* Username Input */}
        <div className="input-wrapper">
          <input
            type="text"
            placeholder="Username"
            className="input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()} 
          />
          <span className="input-icon">
            <User size={18} />
          </span>
        </div>

        {/* Password Input */}
        <div className="input-wrapper">
          <input
            type={showPassword ? "text" : "password"}
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleLogin()}
          />
          <span
            onClick={() => setShowPassword(!showPassword)}
            className="input-icon clickable"
            style={{ cursor: "pointer" }}
          >
            {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
          </span>
        </div>

        {/* Login Button */}
        <button className="input-field login-button" onClick={handleLogin}>
          Login
        </button>

        {/* Status Message */}
        {message && <p className="status-message">{message}</p>}

        {/* Switch to Sign Up */}
        <p className="signup-msg">
          Don't have an account?{" "}
          <span 
            className="signup-link popup" 
            onClick={onSwitchToSignup}
          >
            Sign Up
          </span>
        </p>

      </FeatureCard>
    </div>
  );
}