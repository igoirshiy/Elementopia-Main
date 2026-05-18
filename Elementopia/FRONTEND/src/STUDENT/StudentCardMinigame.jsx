import React, { useState } from "react";
import { Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import Navbar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import "./StudentCardMinigame.css";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

const questionSet = [
  { question: "Na & Cl", correct: "Ionic" },
  { question: "H & O", correct: "Covalent" },
  { question: "Fe & Cu", correct: "Metallic" },
  { question: "C & H", correct: "Covalent" },
  { question: "Mg & O", correct: "Ionic" },
];

const answerOptions = ["Ionic", "Covalent", "Metallic"];

const StudentCardMinigame = () => {
  const [index, setIndex] = useState(0);
  const [feedback, setFeedback] = useState("");
  const [score, setScore] = useState(0);
  const [showPlusOne, setShowPlusOne] = useState(false);
  const [plusOnePosition, setPlusOnePosition] = useState(null);
  const [open, setOpen] = useState(false);
  const [lives, setLives] = useState(3);
  const [gameOver, setGameOver] = useState(false);
  const [achievements, setAchievements] = useState([]); // for future use

  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  const resetGame = () => {
    setIndex(0);
    setScore(0);
    setLives(3);
    setFeedback("");
    setGameOver(false);
  };

  const handleCardClick = (choice, cardIndex) => {
    if (gameOver) return;

    if (choice === questionSet[index].correct) {
      setFeedback("✅ Correct!");
      setScore((prev) => prev + 1);
      setPlusOnePosition(cardIndex);
      setShowPlusOne(true);
    } else {
      setFeedback(
        `❌ Incorrect! Correct answer: ${questionSet[index].correct}`
      );
      setLives((prev) => {
        const updatedLives = prev - 1;
        if (updatedLives <= 0) {
          setGameOver(true);
        }
        return updatedLives;
      });
    }

    setTimeout(() => {
      setShowPlusOne(false);
      setFeedback("");
      setIndex((prev) => (prev + 1) % questionSet.length);
    }, 1500);
  };

  return (
    <Box sx={{ display: "flex" }}>
      <Navbar open={open} />
      <Sidebar
        open={open}
        handleDrawerOpen={handleDrawerOpen}
        handleDrawerClose={handleDrawerClose}
      />

      <Box
        component="main"
        className={`main-container ${
          open ? "main-container-open" : "main-container-closed"
        }`}
      >
        <DrawerHeader />

        <Box className="game-container">
          <Box className="header-section">
            <Typography variant="h4" className="game-title">
              Chemistry Match-Up
            </Typography>
            <Box className="right-header">
              <Typography variant="h6" className="score-display">
                Score: {score}
              </Typography>
              <Typography className="lives-display">❤️ {lives}</Typography>
            </Box>
          </Box>

          {gameOver ? (
            <>
              <Typography variant="h5" className="feedback">
                Game Over! Final Score: {score}
              </Typography>
              <Box mt={2}>
                <button className="restart-btn" onClick={resetGame}>
                  Restart Game
                </button>
              </Box>
            </>
          ) : (
            <>
              <Box className="question-panel">
                <Typography variant="h5" className="question-text">
                  What bond type is formed between {questionSet[index].question}
                  ?
                </Typography>
              </Box>

              <Box className="cards-container">
                {answerOptions.map((option, i) => (
                  <Box
                    key={i}
                    onClick={() => handleCardClick(option, i)}
                    className="card"
                  >
                    {showPlusOne && plusOnePosition === i && (
                      <Box className="plus-one">+1</Box>
                    )}
                    <Box className="card-overlay" />
                    <Typography variant="h6" className="card-text">
                      {option}
                    </Typography>
                  </Box>
                ))}
              </Box>

              {feedback && (
                <Typography variant="h6" className="feedback">
                  {feedback}
                </Typography>
              )}
            </>
          )}
        </Box>
      </Box>
    </Box>
  );
};

export default StudentCardMinigame;
