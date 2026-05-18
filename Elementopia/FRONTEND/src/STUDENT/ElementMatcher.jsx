import React, { useState, useEffect } from 'react';
import { Box, Typography, Button, Modal, Paper, Stack, Chip, CircularProgress } from '@mui/material';
import { styled } from '@mui/material/styles';
import Navbar from '../components/NavBar';
import Sidebar from '../components/Sidebar';
import AchievementService from '../services/AchievementService';
import achievements from '../components/MiniGames/achievements.json';
import UserService from '../services/UserService';
import './ElementMatcher.css';

const DrawerHeader = styled('div')(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

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

const StudentElementMatcher = () => {
  // Enhanced user state management
  const [user, setUser] = useState(null);
  const [loadingUser, setLoadingUser] = useState(true);
  const [errorUser, setErrorUser] = useState(null);
  const [userId, setUserId] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // Original UI and game state
  const [open, setOpen] = useState(false);
  const [drawerOpen, setDrawerOpen] = useState(false);
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
  const [unlockedAchievements, setUnlockedAchievements] = useState([]);
  const [achievementUnlocked, setAchievementUnlocked] = useState(false);
  const [achievementName, setAchievementName] = useState("");
  const [completedDifficulties, setCompletedDifficulties] = useState({
    easy: false,
    medium: false,
    hard: false
  });

  const getAchievementTitle = (codeName) => {
    const match = achievements.find(ach => ach.codeName === codeName);
    return match ? match.title : codeName;
  };

  // Enhanced user fetching with achievements
  useEffect(() => {
    const fetchUserAndAchievements = async () => {
      try {
        const currentUser = await UserService.getCurrentUser();
        if (!currentUser) {
          setErrorUser('No user logged in');
          setLoadingUser(false);
          return;
        }
        
        // Handle both id and userId properties
        const userIdValue = currentUser.id || currentUser.userId;
        if (!userIdValue) {
          setErrorUser('No valid user ID found');
          setLoadingUser(false);
          return;
        }

        setUser(currentUser);
        setUserId(userIdValue);
        setIsLoggedIn(true);
        setLoadingUser(false);

        // Fetch user achievements and extract codeNames
        const userAchievements = await AchievementService.getAchievementsByUser(userIdValue);
        const achievementCodeNames = userAchievements
          .filter(achievement => achievement.name && typeof achievement.name === 'string')
          .map(achievement => achievement.name.trim());
        setUnlockedAchievements(achievementCodeNames);
      } catch (error) {
        console.error('Error fetching user or achievements:', error);
        setErrorUser(error.message || 'Failed to load user');
        setLoadingUser(false);
      }
    };
  
    fetchUserAndAchievements();
  }, []);

  // Initialize game only after user is loaded
  useEffect(() => {
    if (userId) {
      shuffleCards("easy");
    }
  }, [userId]);

  // Updated createAchievement function
   const formattedDate = new Date().toISOString().split("T")[0];
  const createAchievement = async (codeName) => {
    if (!user || !userId || unlockedAchievements.includes(codeName)) {
      return;
    }

    try {
      // Find the achievement details from the JSON file
      const achievementDetails = achievements.find(ach => ach.codeName === codeName);
      if (!achievementDetails) {
        console.error(`Achievement with codeName ${codeName} not found in JSON file`);
        return;
      }

      // Create the achievement data object
      const achievementData = {
        title: codeName,
        description: achievementDetails.description,
        dateAchieved: formattedDate,
        // Add any other fields your backend expects
      };

      console.log('Creating achievement:', achievementData, 'for user:', userId);

      // Call the createAchievement service method
      const createdAchievement = await AchievementService.createAchievement(userId, achievementData);
      
      console.log('Achievement created successfully:', createdAchievement);

      // Update the local state
      setUnlockedAchievements(prev => [...prev, codeName]);
      setAchievementName(achievementDetails.title);
      setAchievementUnlocked(true);
      setTimeout(() => setAchievementUnlocked(false), 3000);

    } catch (error) {
      console.error('Error creating achievement:', error);
      // Check if the error is because the achievement already exists
      if (error.response?.status === 409 || error.message?.includes('already exists')) {
        console.log('Achievement already exists, updating local state');
        setUnlockedAchievements(prev => [...prev, codeName]);
      }
    }
  };

  const shuffleCards = (difficultyLevel = difficulty) => {
    if (!userId) return; // Don't shuffle if no user is loaded
    
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

  const handleDrawerOpen = () => {
    setDrawerOpen(true);
  };
  
  const handleDrawerClose = () => {
    setDrawerClose(false);
  };

  const handleChoice = (card) => {
    if (disabled) return;
    firstChoice ? setSecondChoice(card) : setFirstChoice(card);
  };

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

  useEffect(() => {
    if (gameOver) return;

    if (cards.length > 0 && cards.every(card => card.matched)) {
      const levelScore = score * (difficulty === "easy" ? 1 : difficulty === "medium" ? 2 : 3);
      const newTotalScore = totalScore + levelScore;
      setTotalScore(newTotalScore);
      setGameOver(true);

      // Update completed difficulties
      const newCompletedDifficulties = {
        ...completedDifficulties,
        [difficulty]: true
      };
      setCompletedDifficulties(newCompletedDifficulties);

      if (userId) {
        // Create achievements based on game completion
        if (difficulty === "easy") {
          createAchievement("MEMORY_NOVICE");
          if (turns <= 20) {
            createAchievement("QUICK_MATCHMAKER");
          }
        } else if (difficulty === "medium") {
          createAchievement("MEMORY_INTERMEDIATE");
        } else if (difficulty === "hard") {
          createAchievement("MEMORY_MASTER");
          // Check if all difficulties are completed for Master Matcher
          if (newCompletedDifficulties.easy && newCompletedDifficulties.medium && newCompletedDifficulties.hard) {
            createAchievement("MASTER_MATCHER");
          }
        }

        // Check for score-based achievement
        if (newTotalScore >= 100) {
          createAchievement("SCORE_HUNTER");
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
    setTurns(prev => prev + 1);
    setDisabled(false);
    setTimeout(() => setFeedback(""), 1000);
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

  // Loading state within your original layout
  if (loadingUser) {
    return (
      <Box sx={{ display: 'flex' }}>
        <Navbar open={open} />
        <Sidebar open={open} handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose} />
        <Box component="main" className={`main-container ${open ? 'main-container-open' : 'main-container-closed'}`}>
          <DrawerHeader />
          <Box className="game-container" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
            <CircularProgress sx={{ color: '#8a4bff', mb: 2 }} />
            <Typography variant="h6" sx={{ color: 'white' }}>Loading user...</Typography>
          </Box>
        </Box>
      </Box>
    );
  }

  // Error state within your original layout
  if (errorUser || !user) {
    return (
      <Box sx={{ display: 'flex' }}>
        <Navbar open={open} />
        <Sidebar open={open} handleDrawerOpen={handleDrawerOpen} handleDrawerClose={handleDrawerClose} />
        <Box component="main" className={`main-container ${open ? 'main-container-open' : 'main-container-closed'}`}>
          <DrawerHeader />
          <Box className="game-container" sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', minHeight: '400px' }}>
            <Typography 
              variant="h6" 
              sx={{ color: '#F44336', fontWeight: 'bold', textAlign: 'center' }}
            >
              {errorUser ? `Error: ${errorUser}` : 'User not logged in'}
            </Typography>
            <Typography variant="body1" sx={{ color: 'white', mt: 2, textAlign: 'center' }}>
              Please log in to play the game.
            </Typography>
          </Box>
        </Box>
      </Box>
    );
  }

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
            <Button 
              variant="contained" 
              onClick={() => shuffleCards(difficulty)} 
              className="new-game-btn" 
              disabled={disabled && !gameOver}
            >
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