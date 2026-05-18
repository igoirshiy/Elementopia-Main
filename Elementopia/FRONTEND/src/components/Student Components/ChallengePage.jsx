import React, { useState, useEffect } from "react";
import { Card, Typography, Button } from "@mui/material";
import compoundElements from "../Student Components/compound-elements.json";
import ChemistrySimulation from "../Student Components/ChemistrySimulation";
import { useNavigate } from "react-router-dom";

const ChallengePage = ({ atoms, setAtoms, setMoleculeOutput }) => {
  const [challengeCompound, setChallengeCompound] = useState(null);
  const [isChallengeCompleted, setIsChallengeCompleted] = useState(false);
  const navigate = useNavigate();

  const getRandomCompound = () => {
    const randomIndex = Math.floor(Math.random() * compoundElements.length);
    return compoundElements[randomIndex];
  };

  const checkChallengeCompletion = () => {
    if (!challengeCompound) return;

    const currentElements = atoms.map((atom) => atom.element);
    const compoundElementsSorted = [...challengeCompound.Elements].sort();
    const currentElementsSorted = [...currentElements].sort();

    if (
      JSON.stringify(compoundElementsSorted) ===
      JSON.stringify(currentElementsSorted)
    ) {
      setIsChallengeCompleted(true);
      setMoleculeOutput(
        `Well done! You’ve created ${challengeCompound.NAME}.\n` +
          `Symbol: ${challengeCompound.Symbol}\n` +
          `Description: ${challengeCompound.Description}\n` +
          `Elements: ${challengeCompound.Elements.join(", ")}\n` +
          `Uses: ${challengeCompound.Uses.join(", ")}`
      );
    } else {
      setIsChallengeCompleted(false);
      setMoleculeOutput("Keep going! Try to create the compound.");
    }
  };

  useEffect(() => {
    const selectedCompound = getRandomCompound();
    setChallengeCompound(selectedCompound);
  }, []);

  const handleStartChallenge = () => {
    setIsChallengeCompleted(false);
    setAtoms([]);
    setMoleculeOutput("");
  };

  return (
    <Card
      sx={{
        mb: 3,
        p: 3,
        bgcolor: "#1e1e1e",
        color: "white",
        width: "100%",
        border: "2px solid #ff9800",
        borderRadius: "10px",
        boxShadow: "0px 0px 15px rgba(255, 152, 0, 0.8)",
        transition: "transform 0.2s, box-shadow 0.3s",
        "&:hover": {
          boxShadow: "0px 0px 20px rgba(255, 152, 0, 1)",
        },
      }}
    >
      <Typography
        variant="h5"
        sx={{
          fontWeight: "bold",
          textTransform: "uppercase",
          textShadow: "0px 0px 8px rgba(255, 152, 0, 0.8)",
          letterSpacing: "2px",
        }}
      >
        Daily Challenge
      </Typography>
      <Button
        variant="outlined"
        sx={{
          mt: 2,
          borderColor: "#ff9800",
          color: "#ff9800",
          fontWeight: "bold",
          fontSize: "1rem",
          borderRadius: "5px",
          textTransform: "uppercase",
          transition: "all 0.3s",
          "&:hover": {
            backgroundColor: "#ff9800",
            color: "#1e1e1e",
          },
        }}
        onClick={() => navigate("/student-home-page")}
      >
        Go to Student Home
      </Button>

      {challengeCompound && !isChallengeCompleted ? (
        <>
          <Typography sx={{ mt: 1, fontSize: "1.1rem", opacity: 0.8 }}>
            Your challenge is to create the compound:{" "}
            <strong>{challengeCompound.NAME}</strong> (Formula:{" "}
            {challengeCompound.Symbol})
          </Typography>
          <ChemistrySimulation
            atoms={atoms}
            setAtoms={setAtoms}
            setMoleculeOutput={setMoleculeOutput}
          />
        </>
      ) : isChallengeCompleted ? (
        <>
          <Typography sx={{ mt: 1, fontSize: "1.1rem", opacity: 0.8 }}>
            Congratulations! You created the compound:{" "}
            <strong>{challengeCompound.NAME}</strong>
          </Typography>
          <Button
            variant="contained"
            sx={{
              mt: 2,
              bgcolor: "#4caf50",
              color: "#121212",
              fontWeight: "bold",
              fontSize: "1rem",
              borderRadius: "5px",
              textTransform: "uppercase",
              boxShadow: "0px 0px 10px rgba(76, 175, 80, 0.7)",
              transition: "background 0.3s, transform 0.2s",
              "&:hover": {
                bgcolor: "#388e3c",
                transform: "scale(1.1)",
                boxShadow: "0px 0px 15px rgba(76, 175, 80, 1)",
              },
            }}
            onClick={handleStartChallenge}
          >
            Start New Challenge
          </Button>
        </>
      ) : (
        <Typography sx={{ mt: 1, fontSize: "1.1rem", opacity: 0.8 }}>
          Click the button below to start a new challenge.
        </Typography>
      )}
    </Card>
  );
};

export default ChallengePage;
