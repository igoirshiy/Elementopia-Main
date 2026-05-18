import React from "react";
import Typography from "@mui/material/Typography";
import { useNavigate } from "react-router-dom";

const AccessDenied = () => {
const navigate = useNavigate();

  const handleBackMenu = () =>{
    navigate("/");
  }

  return (
    <div
      style={{
        backgroundColor: "#0f0f0f",
        color: "#ffffff",
        height: "100vh",
        width: "100vw",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        justifyContent: "center",
        fontFamily: "'Orbitron', sans-serif",
      }}
    >
      <Typography
        variant="h6"
        noWrap
        component="div"
        sx={{
          backgroundImage: "linear-gradient(to right, #714dff, #9c83ff, #e151ff, #fff759)",
          WebkitBackgroundClip: "text",
          WebkitTextFillColor: "transparent",
          fontWeight: "bold",
          fontSize: "2rem",
          marginBottom: "30px",
        }}
      >
        ELEMENTOPIA
      </Typography>

      <h1 style={{ fontSize: "3rem", marginBottom: "1rem" }}>🚫 Access Denied</h1>
      <p style={{ fontSize: "1.2rem", maxWidth: "500px", textAlign: "center" }}>
        You do not have permission to view this page.
      </p>
      <p style={{ fontSize: "1rem", color: "#bbbbbb" }}>
        Please contact your administrator or return to a valid section.
      </p>
      <button onClick={handleBackMenu}
      style={{
        marginTop: "20px",
        padding: "10px 20px",
        fontSize: "1rem",
        backgroundColor: "#714dff",
        color: "#fff",
        border: "none",
        borderRadius: "4px",
        cursor: "pointer",
      }}>Return Home</button>
    </div>
  );
};

export default AccessDenied;
