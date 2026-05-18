import React, { useEffect, useState } from "react";
import UserService from "../../services/UserService";
import { CircularProgress, Typography, Card, CardContent, Box } from "@mui/material";
import { keyframes } from "@emotion/react";

// Slide-in for card
const slideIn = keyframes`
  from {
    transform: translateY(-30px);
    opacity: 0;
  }
  to {
    transform: translateY(0);
    opacity: 1;
  }
`;

// Glow animation per character (loops)
const glow = keyframes`
  0% {
    opacity: 0;
    color: #ff6a00;
    text-shadow: none;
  }
  25% {
    opacity: 1;
    color: #ff9500;
    text-shadow: 0 0 5px #ff9500, 0 0 10px #ffaa33, 0 0 15px #ffaa33;
  }
  50% {
    color: #ffc266;
    text-shadow: 0 0 10px #ffaa33, 0 0 15px #ffc266, 0 0 20px #ffd580;
  }
  75% {
    color: #ff9500;
    text-shadow: 0 0 7px #ff9500, 0 0 12px #ffaa33, 0 0 17px #ffaa33;
  }
  100% {
    opacity: 1;
    color: #ff6a00;
    text-shadow: none;
  }
`;

const UserProfile = () => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchUser = async () => {
      try {
        const data = await UserService.getCurrentUser();
        setUser(data);
        setLoading(false);
      } catch (error) {
        console.error("Failed to fetch user:", error.message);
        setLoading(false);
      }
    };

    fetchUser();
  }, []);

  if (loading) return <CircularProgress color="inherit" />;
  if (!user) return <div style={{ color: "#fff", marginTop: "2rem" }}>Loading user info...</div>;

  return (
    <Card
      sx={{
        bgcolor: "transparent",
        boxShadow: "none",
        p: 2,
        width: "100%",
        maxWidth: 600,
        mx: "auto",
        mt: 4,
        animation: `${slideIn} 0.8s ease-out`,
      }}
    >
      <CardContent>
        <Typography
          variant="h5"
          fontWeight="bold"
          sx={{
            fontFamily: "'Orbitron', sans-serif",
            textAlign: "center",
            color: "#ff9500",
            letterSpacing: "2px",
            fontSize: "2rem",
            textTransform: "uppercase",
            display: "flex",
            justifyContent: "center",
            flexWrap: "wrap",
            gap: "4px",
          }}
        >
          {"Welcome, ".split("").map((char, index) => (
            <Box
              key={`welcome-${index}`}
              component="span"
              sx={{
                animation: `${glow} 3s ease-in-out ${index * 0.1}s infinite`,
                display: "inline-block",
              }}
            >
              {char}
            </Box>
          ))}
          {user.firstName.split("").map((char, index) => (
            <Box
              key={`name-${index}`}
              component="span"
              sx={{
                animation: `${glow} 3s ease-in-out ${0.7 + index * 0.1}s infinite`,
                display: "inline-block",
              }}
            >
              {char}
            </Box>
          ))}
          <Box
            component="span"
            sx={{
              animation: `${glow} 3s ease-in-out ${user.firstName.length * 0.1 + 1}s infinite`,
              display: "inline-block",
            }}
          >
            !
          </Box>
        </Typography>
      </CardContent>
    </Card>
  );
};

export default UserProfile;
