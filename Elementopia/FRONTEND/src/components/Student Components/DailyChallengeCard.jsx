import React, { useState, useEffect, useCallback } from "react";
import { Card, Typography, Button, Box, CircularProgress, styled, Grid } from "@mui/material";
import { useNavigate } from "react-router-dom";
import UserService from "../../services/UserService";
import compoundList from "./compound-elements.json";


import { HourglassEmpty, CheckCircleOutline, PlayCircleOutline, PersonOff } from '@mui/icons-material'; 

const CHALLENGE_COOLDOWN_MS = 24 * 60 * 60 * 1000; 
const BASE_LAST_CHALLENGE_KEY = "lastDailyChallengeAttempt"; 



const GameCard = styled(Card)(({ theme }) => ({
  background: 'linear-gradient(145deg, #1f1f1f 0%, #0d0d0d 100%)', 
  color: "#e0e0e0", 
  width: "100%",
  minHeight: "150px", 
  display: "flex",
  flexDirection: "column",
  justifyContent: "space-between",
  borderRadius: "16px",
  border: "2px solid #3a3a3a", 
  boxShadow: "0px 8px 20px rgba(0, 0, 0, 0.6), inset 0 0 15px rgba(255, 152, 0, 0.1)",
  overflow: 'hidden', 
  position: 'relative', 
  transition: "all 0.3s ease-out",
  '&:hover': {
    transform: 'translateY(-3px)',
    boxShadow: "0px 12px 25px rgba(0, 0, 0, 0.8), inset 0 0 20px rgba(255, 152, 0, 0.2)",
  },
  fontFamily: "'Orbitron', sans-serif", 
}));

const CardHeader = styled(Box)(({ theme }) => ({
  background: '#333', 
  padding: theme.spacing(1.5), 
  borderBottom: '1px solid #444',
  position: 'relative',
  '&::after': { 
    content: '""',
    position: 'absolute',
    bottom: 0,
    left: '50%',
    transform: 'translateX(-50%)',
    width: '80%',
    height: '2px',
    backgroundColor: '#ff9800',
    boxShadow: '0 0 8px #ff9800',
    borderRadius: '2px',
  }
}));

const CardTitle = styled(Typography)(({ theme }) => ({
  fontWeight: "bold",
  textTransform: "uppercase",
  color: "#ff9800", 
  textShadow: "0px 0px 8px rgba(255, 152, 0, 0.8)",
  letterSpacing: "2px", 
  fontSize: "1.4rem", 
  textAlign: 'center',
}));

const CardBody = styled(Box)(({ theme }) => ({
  padding: theme.spacing(2), 
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  flexGrow: 1, 
}));

const DescriptionText = styled(Typography)(({ theme }) => ({
  fontSize: "0.9rem", 
  color: "#b0b0b0", 
  textAlign: 'center',
  marginBottom: theme.spacing(1.5), 
  fontFamily: "'Share Tech Mono', monospace", 
}));

const StatusIndicator = styled(Box)(({ theme, available }) => ({
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: theme.spacing(1), 
  borderRadius: '8px',
  margin: theme.spacing(1.5, 0), 
  width: '100%',
  background: available ? 'linear-gradient(45deg, #4CAF50 30%, #81C784 90%)' : 'linear-gradient(45deg, #FF5722 30%, #FFAB91 90%)', 
  boxShadow: available ? '0 0 15px rgba(76, 175, 80, 0.7)' : '0 0 15px rgba(255, 87, 34, 0.7)',
  color: '#fff',
  fontWeight: 'bold',
  textShadow: '0 0 5px rgba(0,0,0,0.5)',
  fontFamily: "'Orbitron', sans-serif",
  fontSize: '1rem', 
  gap: theme.spacing(1),
}));

const CountdownText = styled(Typography)(({ theme }) => ({
  fontSize: "2.5rem",
  fontWeight: "bold",
  color: "#ffdd55",
  textShadow: "0 0 15px #ffdd55, 0 0 25px rgba(255, 221, 85, 0.5)", 
  fontFamily: "'Share Tech Mono', monospace",
  lineHeight: 1, 
}));

const ActionButton = styled(Button)(({ theme, available }) => ({
  background: available ? 'linear-gradient(45deg, #ff9800 30%, #ffc107 90%)' : '#333',
  color: available ? '#121212' : '#888',
  fontWeight: "bold",
  fontSize: "1rem", 
  padding: theme.spacing(1, 3),
  borderRadius: "8px",
  textTransform: "uppercase",
  boxShadow: available ? "0px 4px 15px rgba(255, 152, 0, 0.6)" : "none",
  transition: "all 0.3s ease-out",
  '&:hover': available
    ? {
        background: 'linear-gradient(45deg, #ffc107 30%, #ff9800 90%)',
        transform: "scale(1.05) translateY(-2px)",
        boxShadow: "0px 6px 20px rgba(255, 152, 0, 0.8)",
      }
    : {},
  '&:disabled': {
    background: '#222',
    color: '#555',
    boxShadow: 'none',
    cursor: 'not-allowed',
    transform: 'none',
  },
}));

// --- Main Component ---

const DailyChallengeCard = () => {
  const navigate = useNavigate();
  const [timeLeft, setTimeLeft] = useState(0);
  const [isChallengeAvailable, setIsChallengeAvailable] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [currentUser, setCurrentUser] = useState(null); 


  const getUserChallengeKey = useCallback((userId) => {
    return `${BASE_LAST_CHALLENGE_KEY}_${userId}`;
  }, []);

  // Memoized function to calculate time left, depends on userId
  const calculateTimeLeft = useCallback((userId) => {
    if (!userId) { 
      setTimeLeft(0);
      setIsChallengeAvailable(false);
      return 0;
    }
    
    // Cooldown removed for testing purposes
    setTimeLeft(0);
    setIsChallengeAvailable(true);
    return 0;
  }, [getUserChallengeKey]); 

  // Effect to load user and set up timer
  useEffect(() => {
    let timer;
    const initCard = async () => {
      setIsLoading(true);
      const user = await UserService.getCurrentUser();
      setCurrentUser(user);

      if (user?.userId) {
        const initialTimeLeft = calculateTimeLeft(user.userId);
        if (initialTimeLeft > 0) {
          timer = setInterval(() => {
            const remaining = calculateTimeLeft(user.userId);
            if (remaining <= 0) {
              clearInterval(timer);
              setIsChallengeAvailable(true);
            }
          }, 1000);
        } else {
            setIsChallengeAvailable(true); // Available if no cooldown
        }
      } else {
        // No user logged in
        setIsChallengeAvailable(false);
        setTimeLeft(0);
      }
      setIsLoading(false);
    };

    initCard();

    return () => {
      if (timer) {
        clearInterval(timer);
      }
    };
  }, [currentUser?.userId, calculateTimeLeft]); 
  const formatTime = (ms) => {
    if (ms <= 0) return "00:00:00";
    const totalSeconds = Math.floor(ms / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;

    return [hours, minutes, seconds]
      .map((unit) => String(unit).padStart(2, "0"))
      .join(":");
  };

  const handleStartChallenge = async () => {
    if (!currentUser || !currentUser.userId) {
      alert("Authentication required. Please log in to accept the quest.");
      return;
    }

    if (!isChallengeAvailable) {
      alert(`Access denied. Next quest available in ${formatTime(timeLeft)}.`);
      return;
    }

    const discoveredCompoundsSymbols = currentUser.discoveredCompounds?.map(sym => sym.toLowerCase()) || []; 

    const nextCompound = compoundList.find(
      (compound) => !discoveredCompoundsSymbols.includes(compound.Symbol.toLowerCase())
    );

    if (!nextCompound) {
      alert("All quests completed! You are a master alchemist!");
      return;
    }

    // Store the last attempt time specific to this user
    localStorage.setItem(getUserChallengeKey(currentUser.userId), Date.now().toString());
    localStorage.setItem("dailyChallengeCompound", JSON.stringify(nextCompound));

    calculateTimeLeft(currentUser.userId); 

    navigate("/student/daily-challenge");
  };

  if (isLoading) {
    return (
      <GameCard
        sx={{
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <CircularProgress sx={{ color: "#ff9800" }} size={50} />
        <Typography sx={{ mt: 2, color: "#b0b0b0", fontFamily: "'Share Tech Mono', monospace" }}>
          Loading Quest Data...
        </Typography>
      </GameCard>
    );
  }

  // Determine button and status based on user login and challenge availability
  const canStartChallenge = isChallengeAvailable && currentUser?.userId;
  const buttonText = currentUser?.userId 
    ? (isChallengeAvailable ? "Accept Quest" : "Await Transmission")
    : "Login to Access";
  const buttonIcon = canStartChallenge ? <PlayCircleOutline /> : (currentUser?.userId ? null : <PersonOff />);

  return (
    <GameCard>
      <CardHeader>
        <CardTitle>Daily Challenge</CardTitle>
      </CardHeader>

      <CardBody>
        <DescriptionText>
          Your mission: discover a new compound and expand your knowledge of the elemental world.
        </DescriptionText>

        {!currentUser?.userId ? (
            <StatusIndicator available={false}>
                <PersonOff sx={{ fontSize: 25 }} />
                <Typography variant="h6">LOGIN REQUIRED</Typography>
            </StatusIndicator>
        ) : (isChallengeAvailable ? (
          <StatusIndicator available={true}>
            <CheckCircleOutline sx={{ fontSize: 25 }} />
            <Typography variant="h6">CHALLENGE READY</Typography>
          </StatusIndicator>
        ) : (
          <>
            <StatusIndicator available={false}>
                <HourglassEmpty sx={{ fontSize: 25 }} />
                <Typography variant="h6">COOLDOWN ACTIVE</Typography>
            </StatusIndicator>
            <CountdownText variant="h4">
                {formatTime(timeLeft)}
            </CountdownText>
          </>
        ))}
      </CardBody>

      <Box sx={{ p: 2, pt: 0, textAlign: 'center' }}>
        <ActionButton
          available={canStartChallenge}
          onClick={handleStartChallenge}
          disabled={!canStartChallenge}
          startIcon={buttonIcon}
        >
          {buttonText}
        </ActionButton>
      </Box>
    </GameCard>
  );
};

export default DailyChallengeCard;