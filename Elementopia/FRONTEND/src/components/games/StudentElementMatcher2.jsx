import React, { useState, useEffect } from "react";
import {
  Grid,
  Card,
  CardContent,
  Typography,
  Button,
  Box,
  Paper,
} from "@mui/material";

const elementPairs = [
  { id: 1, symbol: "C", name: "Carbon Atom" },
  { id: 2, symbol: "CH4", name: "Methane (CH₄)" },
  { id: 3, symbol: "C2H6", name: "Ethane (C₂H₆)" },
  { id: 4, symbol: "COOH", name: "Carboxylic Acid Group" },
  { id: 5, symbol: "OH", name: "Hydroxyl Group" },
  { id: 6, symbol: "C6H12O6", name: "Glucose (C₆H₁₂O₆)" },
  { id: 7, symbol: "C2H5OH", name: "Ethanol (C₂H₅OH)" },
  { id: 8, symbol: "C=C", name: "Double Bond (Alkene)" },
];

const shuffleArray = (array) => {
  const newArray = [...array];
  for (let i = newArray.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newArray[i], newArray[j]] = [newArray[j], newArray[i]];
  }
  return newArray;
};

const StudentElementMatcher2 = ({ onContinue }) => {
  const [symbols, setSymbols] = useState(shuffleArray(elementPairs));
  const [names, setNames] = useState(shuffleArray(elementPairs));
  const [selectedSymbol, setSelectedSymbol] = useState(null);
  const [selectedName, setSelectedName] = useState(null);
  const [matches, setMatches] = useState([]);
  const [completed, setCompleted] = useState(false);

  const handleSymbolClick = (symbol) => {
    if (matches.find((match) => match.symbol.id === symbol.id)) return;
    setSelectedSymbol(symbol);
  };

  const handleNameClick = (name) => {
    if (matches.find((match) => match.name.id === name.id)) return;
    setSelectedName(name);
  };

  const checkMatch = () => {
    if (selectedSymbol && selectedName) {
      if (selectedSymbol.id === selectedName.id) {
        setMatches((prev) => [...prev, { symbol: selectedSymbol, name: selectedName }]);
        if (matches.length + 1 === elementPairs.length) {
          setCompleted(true);
        }
      }
      setTimeout(() => {
        setSelectedSymbol(null);
        setSelectedName(null);
      }, 400);
    }
  };

  useEffect(() => {
    checkMatch();
  }, [selectedSymbol, selectedName]);

  const isMatched = (id) =>
    matches.find((match) => match.symbol.id === id || match.name.id === id);

  const getCardStyle = (isSelected, isMatched) => ({
    cursor: "pointer",
    backgroundColor: isMatched
      ? "#00c853"
      : isSelected
      ? "#42a5f5"
      : "#fafafa",
    color: isMatched || isSelected ? "#fff" : "#212121",
    fontWeight: isMatched || isSelected ? "bold" : "normal",
    border: isSelected ? "2px solid #1976d2" : "2px solid transparent",
    boxShadow: isMatched
      ? "0 0 12px rgba(0,200,83,0.7)"
      : "0 2px 8px rgba(0,0,0,0.05)",
    transition: "all 0.25s ease-in-out",
    borderRadius: "12px",
    "&:hover": {
      transform: "scale(1.02)",
    },
  });

  return (
    <Box
      sx={{
        fontFamily: "'Poppins', sans-serif",
        background: "#0d1117",
        color: "white",
        minHeight: "100vh",
        width:"100%",
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
      }}
    >
      <Paper
        elevation={4}
        sx={{
          background: "#1e1e2e",
          padding: 5,
          borderRadius: 4,
          maxWidth: 1100,
          width: "100%",
        }}
      >
        <Typography
          variant="h4"
          align="center"
          fontWeight="bold"
          sx={{ mb: 1, color: "#ffca28" }}
        >
          🎮 Carbon Compounds Match Game
        </Typography>
        <Typography
          variant="subtitle1"
          align="center"
          sx={{ mb: 5, color: "#b0bec5" }}
        >
          Tap a symbol on the left, then match it to its correct compound name on the right.
        </Typography>

        <Grid container spacing={4}>
          <Grid item xs={12} sm={6} md={6}>
            {symbols.map((symbol) => (
              <Card
                key={symbol.id}
                onClick={() => handleSymbolClick(symbol)}
                sx={getCardStyle(
                  selectedSymbol?.id === symbol.id,
                  isMatched(symbol.id)
                )}
              >
                <CardContent>
                  <Typography
                    variant="h5"
                    align="center"
                    sx={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {symbol.symbol}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Grid>
          <Grid item xs={12} sm={6} md={6}>
            {names.map((name) => (
              <Card
                key={name.id}
                onClick={() => handleNameClick(name)}
                sx={getCardStyle(
                  selectedName?.id === name.id,
                  isMatched(name.id)
                )}
              >
                <CardContent>
                  <Typography
                    variant="h6"
                    align="center"
                    sx={{ fontFamily: "'Poppins', sans-serif" }}
                  >
                    {name.name}
                  </Typography>
                </CardContent>
              </Card>
            ))}
          </Grid>
        </Grid>

        {completed && (
          <Box mt={6} textAlign="center">
            <Typography
              variant="h5"
              sx={{
                color: "#00e676",
                fontWeight: "bold",
                mb: 2,
              }}
            >
              🎉 Excellent! You've matched all compounds correctly!
            </Typography>
            <Button
              variant="contained"
              size="large"
              sx={{
                mt: 1,
                bgcolor: "#ff9800",
                color: "#212121",
                fontWeight: "bold",
                borderRadius: 2,
                px: 4,
                py: 1,
                fontSize: "1rem",
                "&:hover": { bgcolor: "#ffa726" },
              }}
              onClick={onContinue}
            >
              🚀 Continue to Topic 3
            </Button>
          </Box>
        )}
      </Paper>
    </Box>
  );
};

export default StudentElementMatcher2;
