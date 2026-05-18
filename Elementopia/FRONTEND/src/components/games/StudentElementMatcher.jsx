// StudentElementMatcher.jsx
import React, { useState, useEffect } from 'react';
import { Box, Typography, Button } from '@mui/material';
import { styled } from '@mui/material/styles';
import { useNavigate } from 'react-router-dom';
import './StudentElementMatcher.css';

const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const elementPairs = [
  { id: 1, symbol: "Na", name: "Sodium (Na) - Cation", matched: false },
  { id: 2, symbol: "Cl", name: "Chlorine (Cl) - Anion", matched: false },
  { id: 3, symbol: "NaCl", name: "Sodium Chloride (NaCl)", matched: false },
  { id: 4, symbol: "Cu", name: "Copper (Cu) - Metal", matched: false },
  { id: 5, symbol: "H2O", name: "Water (H2O)", matched: false },
  { id: 6, symbol: "O", name: "Oxygen (O) - Anion", matched: false },
  { id: 7, symbol: "H", name: "Hydrogen (H) - Cation", matched: false },
  { id: 8, symbol: "Cu²⁺", name: "Copper Ion (Cu²⁺)", matched: false },
];

const StudentElementMatcher = ({ onContinue }) => {
  const [open, setOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [firstChoice, setFirstChoice] = useState(null);
  const [secondChoice, setSecondChoice] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState("");

  const navigate = useNavigate();

  const shuffleCards = () => {
    const cardPairs = [...elementPairs].flatMap(element => ([
      { id: element.id, type: 'symbol', content: element.symbol, matched: false },
      { id: element.id, type: 'name', content: element.name, matched: false }
    ]));

    const shuffled = [...cardPairs]
      .sort(() => Math.random() - 0.5)
      .map(card => ({ ...card, cardId: Math.random() }));

    setCards(shuffled);
    setTurns(0);
    setScore(0);
    setFirstChoice(null);
    setSecondChoice(null);
    setGameOver(false);
    setFeedback("");
  };

  const handleChoice = (card) => {
    if (disabled) return;
    firstChoice ? setSecondChoice(card) : setFirstChoice(card);
  };

  useEffect(() => {
    shuffleCards();
  }, []);

  useEffect(() => {
    if (firstChoice && secondChoice) {
      setDisabled(true);

      if (firstChoice.id === secondChoice.id && firstChoice.type !== secondChoice.type) {
        setCards(prevCards => {
          return prevCards.map(card => {
            if (card.id === firstChoice.id) {
              return { ...card, matched: true };
            } else {
              return card;
            }
          });
        });
        setScore(prevScore => prevScore + 100);
        setFeedback("✅ Match found!");
        resetTurn();
      } else {
        setFeedback("❌ Not a match!");
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [firstChoice, secondChoice]);

  useEffect(() => {
    if (cards.length > 0 && cards.every(card => card.matched)) {
      setGameOver(true);
      setFeedback("🎉 You completed the game!");
      localStorage.setItem("game1_completed", "true");             // ✅ Progress flag
      localStorage.setItem("game1_score", score.toString());       // ✅ Save score
    }
  }, [cards]);

  const resetTurn = () => {
    setFirstChoice(null);
    setSecondChoice(null);
    setTurns(prevTurns => prevTurns + 1);
    setDisabled(false);
    setTimeout(() => setFeedback(""), 1000);
  };

  const handleContinue = () => {
    if (typeof onContinue === "function") {
      onContinue();
    }
  };

  return (
    <Box sx={{
      display: "flex",
      justifyContent: "space-between",
      alignItems: "flex-start",
      backgroundColor: "#0a0a0f",
      height: "100vh",
      width: "100%",
    }}>
      <Box component="main" className={`main-container ${open ? 'main-container-open' : 'main-container-closed'}`}>
        <Box className="game-container">
          <Box className="header-section">
            <Typography variant="h4" className="game-title">
              Electronic Structure of Matter: Ionic and Metallic Bonding
            </Typography>
            <Box className="stats-container">
              <Typography variant="h6" className="score-display">Score: {score}</Typography>
              <Typography variant="h6" className="turns-display">Turns: {turns}</Typography>
            </Box>
          </Box>

          <Box className="instruction-panel">
            <Typography variant="body1">
              Match the ionic bonds, metallic bonds, and examples with their respective pairs!
            </Typography>
          </Box>

          {feedback && (
            <Typography variant="h6" className="feedback">
              {feedback}
            </Typography>
          )}

          <Box className="card-grid">
            {cards.map(card => (
              <Box
                key={card.cardId}
                className={`memory-card ${
                  card.matched ? 'matched' :
                  card === firstChoice || card === secondChoice ? 'flipped' : ''
                }`}
                onClick={() => !card.matched && card !== firstChoice && card !== secondChoice && handleChoice(card)}
              >
                <Box className="card-inner">
                  <Box className="card-front">
                    <Typography variant="h5" className="card-content">?</Typography>
                  </Box>
                  <Box className="card-back">
                    <Typography variant="h5" className="card-content">{card.content}</Typography>
                    <Typography variant="caption" className="card-type">
                      {card.type === 'symbol' ? 'Symbol' : 'Name'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>

          {gameOver && (
            <Button 
              variant="contained" 
              onClick={handleContinue}
              className="continue-btn"
              sx={{
                marginTop: 3,
                backgroundColor: "#ff9800",
                color: "#0a0a0f",
                fontWeight: "bold",
                "&:hover": {
                  backgroundColor: "#ffb74d",
                },
              }}
            >
              Continue
            </Button>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default StudentElementMatcher;