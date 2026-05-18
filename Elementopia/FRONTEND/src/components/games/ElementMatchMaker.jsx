import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Modal, Paper, Stack, Chip } from '@mui/material';
import { styled } from '@mui/material/styles';
import Navbar from '../components/NavBar';
import Sidebar from '../components/Sidebar';
import AchievementService from '../services/AchievementService';
import '../../assets/css/ElementMatchMaker.css';

const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

// Element data
const elementSets = {
  easy: [
    { id: 1, symbol: "H", name: "Hydrogen", matched: false },
    { id: 2, symbol: "He", name: "Helium", matched: false },
    { id: 3, symbol: "Li", name: "Lithium", matched: false },
    { id: 4, symbol: "Be", name: "Beryllium", matched: false },
    { id: 5, symbol: "B", name: "Boron", matched: false },
    { id: 6, symbol: "C", name: "Carbon", matched: false },
    { id: 7, symbol: "N", name: "Nitrogen", matched: false },
    { id: 8, symbol: "O", name: "Oxygen", matched: false },
  ],
  medium: [
    { id: 9, symbol: "F", name: "Fluorine", matched: false },
    { id: 10, symbol: "Ne", name: "Neon", matched: false },
    { id: 11, symbol: "Na", name: "Sodium", matched: false },
    { id: 12, symbol: "Mg", name: "Magnesium", matched: false },
    { id: 13, symbol: "Al", name: "Aluminum", matched: false },
    { id: 14, symbol: "Si", name: "Silicon", matched: false },
    { id: 15, symbol: "P", name: "Phosphorus", matched: false },
    { id: 16, symbol: "S", name: "Sulfur", matched: false },
    { id: 17, symbol: "Cl", name: "Chlorine", matched: false },
    { id: 18, symbol: "Ar", name: "Argon", matched: false },
  ],
  hard: [
    { id: 19, symbol: "K", name: "Potassium", matched: false },
    { id: 20, symbol: "Ca", name: "Calcium", matched: false },
    { id: 21, symbol: "Co", name: "Cobalt", matched: false },
    { id: 22, symbol: "Cu", name: "Copper", matched: false },
    { id: 23, symbol: "Cr", name: "Chromium", matched: false },
    { id: 24, symbol: "Cd", name: "Cadmium", matched: false },
    { id: 25, symbol: "Cs", name: "Cesium", matched: false },
    { id: 26, symbol: "Ce", name: "Cerium", matched: false },
    { id: 27, symbol: "Cf", name: "Californium", matched: false },
    { id: 28, symbol: "Cm", name: "Curium", matched: false },
    { id: 29, symbol: "Mn", name: "Manganese", matched: false },
    { id: 30, symbol: "Mg", name: "Magnesium", matched: false },
  ]
};

const difficultyLabels = {
  easy: { label: "Easy", color: "#4CAF50" },
  medium: { label: "Medium", color: "#FF9800" },
  hard: { label: "Hard", color: "#F44336" }
};

// unlockAchievement function using AchievementService
  const unlockAchievement = async (codeName) => {
    try {
      const user = JSON.parse(sessionStorage.getItem("user"));
      if (!user || !user.id) {
        console.error('User not found or missing ID');
        return;
      }

      await AchievementService.unlockAchievementByCode(user.id, codeName);
      console.log(`🏆 Achievement unlocked: ${codeName}`);

      // Set achievement details in state
      setAchievementName(getAchievementTitle(codeName));
      setAchievementUnlocked(true);

      // Hide notification after 5 seconds
      setTimeout(() => {
        setAchievementUnlocked(false);
      }, 5000);

    } catch (error) {
      console.error('Error unlocking achievement:', error);
    }
  };


// Helper function to get achievement title from code name
const getAchievementTitle = (codeName) => {
  const achievementMap = {
    'MEMORY_NOVICE': 'Memory Novice',
    'MEMORY_INTERMEDIATE': 'Memory Intermediate',
    'MEMORY_MASTER': 'Memory Master',
    'QUICK_MATCHMAKER': 'Quick Matchmaker',
    'SCORE_HUNTER': 'Score Hunter',
    'MASTER_MATCHER': 'Master Matcher'
  };
  
  return achievementMap[codeName] || codeName;
};

const StudentElementMatcher = () => {
  const [open, setOpen] = useState(false);
  const [cards, setCards] = useState([]);
  const [turns, setTurns] = useState(0);
  const [firstChoice, setFirstChoice] = useState(null);
  const [secondChoice, setSecondChoice] = useState(null);
  const [disabled, setDisabled] = useState(false);
  const [score, setScore] = useState(0);
  const [totalScore, setTotalScore] = useState(0);
  const [gameOver, setGameOver] = useState(false);
  const [feedback, setFeedback] = useState("");
  const [difficulty, setDifficulty] = useState("easy");
  const [modalOpen, setModalOpen] = useState(false);
  const [gameComplete, setGameComplete] = useState(false);
  const [userId, setUserId] = useState(null);
  const [achievementUnlocked, setAchievementUnlocked] = useState(false);
  const [achievementName, setAchievementName] = useState("");
  const [completedDifficulties, setCompletedDifficulties] = useState({
    easy: false,
    medium: false,
    hard: false
  });

  // Get user ID on component mount
  useEffect(() => {
    const user = JSON.parse(sessionStorage.getItem("user"));
    if (user && user.id) {
      setUserId(user.id);
    }
  }, []);

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const shuffleCards = (difficultyLevel = difficulty) => {
    const elementPairs = elementSets[difficultyLevel];
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
    setDifficulty(difficultyLevel);
  };

  const handleChoice = (card) => {
    if (disabled) return;
    firstChoice ? setSecondChoice(card) : setFirstChoice(card);
  };

  useEffect(() => {
    shuffleCards("easy");
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
        setScore(prevScore => prevScore + 1);
        setFeedback("✅ Match found!");
        resetTurn();
      } else {
        setFeedback("❌ Not a match!");
        setTimeout(() => resetTurn(), 1000);
      }
    }
  }, [firstChoice, secondChoice]);

  // In the useEffect that checks for game completion
  useEffect(() => {
    if (gameOver) return; 

    if (cards.length > 0 && cards.every(card => card.matched)) {
      const levelScore = score * (difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3);
      const newTotalScore = totalScore + levelScore;
      setTotalScore(newTotalScore);
      setGameOver(true);
      
      // Mark current difficulty as completed
      setCompletedDifficulties(prev => ({
        ...prev,
        [difficulty]: true
      }));

      // Only unlock achievements if we have a valid userId
      if (userId) {
        // Game-specific achievements based on difficulty level completed
        if (difficulty === "easy") {
          unlockAchievement("MEMORY_NOVICE");
          
          // Check for Quick Matchmaker achievement
          if (turns <= 20) {
            unlockAchievement("QUICK_MATCHMAKER");
          }
        } else if (difficulty === "medium") {
          unlockAchievement("MEMORY_INTERMEDIATE");
        } else if (difficulty === "hard") {
          unlockAchievement("MEMORY_MASTER");
          
          // Check for Master Matcher achievement (completed all three levels)
          if (completedDifficulties.easy && completedDifficulties.medium) {
            unlockAchievement("MASTER_MATCHER");
          }
        }
        
        // Check for Score Hunter achievement
        if (newTotalScore >= 100) {
          unlockAchievement("SCORE_HUNTER");
        }
      }

      if (difficulty === "hard") {
        setFeedback("🏆 You completed all levels!");
        setGameComplete(true);
      } else {
        setFeedback("🎉 Level completed!");
        setTimeout(() => setModalOpen(true), 1000);
      }
    }
  }, [cards, difficulty, score, userId, turns, totalScore, completedDifficulties, gameOver]);

  const resetTurn = () => {
    setFirstChoice(null);
    setSecondChoice(null);
    setTurns(prevTurns => prevTurns + 1);
    setDisabled(false);
    setTimeout(() => {
      setFeedback("");
    }, 1000);
  };

  const handleNextLevel = () => {
    const nextLevel = difficulty === "easy" ? "medium" : "hard";
    shuffleCards(nextLevel);
    setModalOpen(false);
  };

  const handleSaveScore = () => {
    setFeedback(`Score saved: ${totalScore} points!`);
    setModalOpen(false);
    setTimeout(() => {
      resetGame();
    }, 2000);
  };

  const resetGame = () => {
    setTotalScore(0);
    setGameComplete(false);
    setCompletedDifficulties({
      easy: false,
      medium: false,
      hard: false
    });
    shuffleCards("easy");
  };

  return (
    <Box sx={{ display: 'flex' }}>
      <Navbar open={open} />
      <Sidebar open={open} handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose} />
      <Box component="main" className={`main-container ${open ? 'main-container-open' : 'main-container-closed'}`}>
        <DrawerHeader />

        {/* Achievement Notification */}
        {achievementUnlocked && (
          <div className="achievement-notification show">
            <div className="achievement-icon">🏆</div>
            <div className="achievement-content">
              <div className="achievement-title">Achievement Unlocked!</div>
              <div className="achievement-name">{achievementName}</div>
            </div>
          </div>
        )}
        
        <Box className="game-container">
          <Box className="header-section">
            <Box>
              <Typography variant="h4" className="game-title">
                Element Memory Match
              </Typography>
              <Chip
                label={difficultyLabels[difficulty].label}
                sx={{
                  backgroundColor: difficultyLabels[difficulty].color,
                  color: 'white',
                  fontWeight: 'bold',
                  mt: 1
                }}
              />
            </Box>
            <Box className="stats-container">
              <Typography variant="h6" className="score-display">
                Level Score: {score}
              </Typography>
              <Typography variant="h6" className="score-display">
                Total Score: {totalScore}
              </Typography>
              <Typography variant="h6" className="turns-display">
                Turns: {turns}
              </Typography>
            </Box>
          </Box>

          <Box className="instruction-panel">
            <Typography variant="body1">
              Match element symbols with their names. Click on cards to flip them and find matching pairs!
              {difficulty === "medium" && " This level has more elements to match."}
              {difficulty === "hard" && " Warning: This level contains elements with similar symbols and names!"}
            </Typography>
          </Box>

          {feedback && (
            <Typography variant="h6" className="feedback">
              {feedback}
            </Typography>
          )}

          <Box className={`card-grid ${difficulty === "hard" ? "card-grid-hard" : ""}`}>
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
                    <Typography variant="h5" className="card-content">
                      ?
                    </Typography>
                  </Box>
                  <Box className="card-back">
                    <Typography variant="h5" className="card-content">
                      {card.content}
                    </Typography>
                    <Typography variant="caption" className="card-type">
                      {card.type === 'symbol' ? 'Symbol' : 'Name'}
                    </Typography>
                  </Box>
                </Box>
              </Box>
            ))}
          </Box>

          <Stack direction="row" spacing={2} justifyContent="center" sx={{ mt: 2 }}>
            <Button variant="contained" onClick={() => shuffleCards(difficulty)} className="new-game-btn" disabled={disabled && !gameOver}>
              Restart Level
            </Button>

            {gameComplete && (
              <Button variant="contained" onClick={resetGame} className="new-game-btn">
                Play Again
              </Button>
            )}
          </Stack>
        </Box>
      </Box>

      <Modal open={modalOpen} aria-labelledby="level-complete-modal">
        <Paper className="level-modal">
          <Typography variant="h5" sx={{ mb: 2, color: "#8a4bff", fontWeight: "bold" }}>
            Level Complete!
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Congratulations! You've completed the {difficultyLabels[difficulty].label} level with {score} matches in {turns} turns.
          </Typography>
          <Typography variant="body1" sx={{ mb: 3, fontWeight: "bold" }}>
            Your current score: {totalScore} points
          </Typography>
          <Typography variant="body1" sx={{ mb: 3 }}>
            Would you like to proceed to the next level or save your current score?
          </Typography>
          <Stack direction="row" spacing={2} justifyContent="center">
            <Button
              variant="contained"
              onClick={handleNextLevel}
              sx={{
                backgroundColor: difficultyLabels[difficulty === "easy" ? "medium" : "hard"].color,
                '&:hover': { backgroundColor: difficultyLabels[difficulty === "easy" ? "medium" : "hard"].color, opacity: 0.9 }
              }}
            >
              Next Level
            </Button>
            <Button variant="outlined" onClick={handleSaveScore}>
              Save Score & Exit
            </Button>
          </Stack>
        </Paper>
      </Modal>
    </Box>
  );
};

export default StudentElementMatcher;
