import React, { useState, useEffect } from "react";
import Navbar from "../components/NavBar";
import Sidebar from "../components/Sidebar";
import "../assets/css/StudentStateChanges.css";
import {
  Box,
  Typography,
  Slider,
  Button,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
} from "@mui/material";
import { styled } from "@mui/material/styles";

const DrawerHeader = styled("div")(({ theme }) => ({
  ...theme.mixins.toolbar,
}));

// Define substance properties
const substances = [
  {
    id: "water",
    name: "Water",
    freezingPoint: 0,
    boilingPoint: 100,
    triplePoint: -0.01, // Celsius
    criticalPoint: 374, // Celsius
    states: {
      solid: { name: "Ice", color: "#a5f3fc" },
      liquid: { name: "Water", color: "#0ea5e9" },
      gas: { name: "Water Vapor", color: "#e0f2fe" },
    },
  },
  {
    id: "co2",
    name: "Carbon Dioxide",
    freezingPoint: -78, // Sublimates at normal pressure
    boilingPoint: -57, // Only liquid under pressure
    triplePoint: -56.6,
    criticalPoint: 31,
    states: {
      solid: { name: "Dry Ice", color: "#e5e7eb" },
      liquid: { name: "Liquid CO₂", color: "#9ca3af" },
      gas: { name: "CO₂ Gas", color: "#f1f5f9" },
    },
  },
  {
    id: "oxygen",
    name: "Oxygen",
    freezingPoint: -218.8,
    boilingPoint: -183,
    triplePoint: -218.8,
    criticalPoint: -118.6,
    states: {
      solid: { name: "Solid Oxygen", color: "#bfdbfe" },
      liquid: { name: "Liquid Oxygen", color: "#3b82f6" },
      gas: { name: "Oxygen Gas", color: "#dbeafe" },
    },
  },
];

const StateChangesChallenge = () => {
  const [open, setOpen] = useState(false);
  const [selectedSubstance, setSelectedSubstance] = useState(substances[0]);
  const [temperature, setTemperature] = useState(25); // in Celsius
  const [pressure, setPressure] = useState(1); // in atm
  const [currentState, setCurrentState] = useState("liquid");
  const [challengeActive, setChallengeActive] = useState(false);
  const [challengeType, setChallengeType] = useState(null); // 'target' or 'cycle'
  const [particles, setParticles] = useState([]);
  const [feedback, setFeedback] = useState("");
  const [targetState, setTargetState] = useState(null);
  const [score, setScore] = useState(0);
  const [currentSubstanceIndex, setCurrentSubstanceIndex] = useState(0);
  const [completedChallengesForSubstance, setCompletedChallengesForSubstance] =
    useState(0);
  const [completedSubstances, setCompletedSubstances] = useState([]);
  const [targetAchieved, setTargetAchieved] = useState(false);
  const [cycleProgress, setCycleProgress] = useState(0); // 0=none, 1=solid, 2=liquid, 3=gas
  const [lastAchievedState, setLastAchievedState] = useState(null);

  // Add refs to track if we're in the middle of setup to prevent unwanted state updates
  const isSettingUp = useRef(false);
  const challengeSetupComplete = useRef(false);

  // Handle drawer
  const handleDrawerOpen = () => setOpen(true);
  const handleDrawerClose = () => setOpen(false);

  // Handle substance change
  const handleSubstanceChange = (event) => {
    const newSubstance = substances.find((s) => s.id === event.target.value);
    setSelectedSubstance(newSubstance);
    // Reset temperature to room temperature
    setTemperature(25);
    setPressure(1);
    updateState(newSubstance, 25, 1);
  };

  // Handle temperature change
  const handleTemperatureChange = (event, newValue) => {
    if (isSettingUp.current) return; // Skip user updates during setup

    setTemperature(newValue);
    updateState(selectedSubstance, newValue, pressure);
  };

  // Handle pressure change
  const handlePressureChange = (event, newValue) => {
    if (isSettingUp.current) return; // Skip user updates during setup

    setPressure(newValue);
    updateState(selectedSubstance, temperature, newValue);
  };

  // Handle challenge button click
  const handleChallengeToggle = () => {
    if (challengeActive) {
      // Turn off challenge mode
      setChallengeActive(false);
      setChallengeType(null);
      setTargetState(null);
      setCompletedSubstances([]);
      setCurrentSubstanceIndex(0);
      setCompletedChallengesForSubstance(0);
      setTargetAchieved(false);
      setCycleProgress(0);
      setLastAchievedState(null);
      setScore(0); // Reset score when exiting challenge mode
      setFeedback(
        "Explore mode activated. Try different temperature and pressure combinations!"
      );
      setTimeout(() => setFeedback(""), 2000);
    } else {
      // Start with first substance if not already set
      const substanceToUse = substances[currentSubstanceIndex];
      setSelectedSubstance(substanceToUse);
      // Set to target challenge as default
      setChallengeType("target");
      setTargetAchieved(false);
      setCycleProgress(0);
      setCompletedChallengesForSubstance(0);
      setLastAchievedState(null);
      setScore(0); // Reset score when starting challenge mode

      // Important: Set challengeActive BEFORE setting up the target challenge
      setChallengeActive(true);

      // Use a timeout to ensure the challengeActive state is updated before proceeding
      setTimeout(() => {
        setupTargetChallenge(substanceToUse);
      }, 50);
    }
  };

  // Calculate state based on temperature and pressure
  const updateState = (substance, temp, pres) => {
    let newState;

    // Special case for CO2 which has different phase change behavior
    if (substance.id === "co2") {
      if (temp < substance.freezingPoint) {
        newState = "solid"; // Dry ice
      } else if (pres >= 5.1 && temp < substance.boilingPoint) {
        newState = "liquid"; // Liquid CO2 (only under high pressure)
      } else {
        newState = "gas"; // CO2 gas
      }
    } else {
      // Standard phase change logic for other substances
      if (temp < substance.freezingPoint) {
        newState = "solid";
      } else if (temp < substance.boilingPoint) {
        newState = "liquid";
      } else {
        newState = "gas";
      }
    }

    // Update state
    setCurrentState(newState);

    // Generate particles based on state
    generateParticles(newState, temp);

    // Check if challenge goal is met if a challenge is active and setup is complete
    if (challengeActive && challengeSetupComplete.current) {
      checkChallengeProgress(newState, substance);
    }
  };

  // Set up initial conditions based on the target state we want to achieve
  const setupInitialConditions = (substance, targetStateToAchieve) => {
    isSettingUp.current = true;
    challengeSetupComplete.current = false;

    // Set initial conditions that are NOT in the target state
    let initialTemp = 0; // Default starting temperature
    let initialPressure = 1; // default 1 atm

    // For CO2, special handling
    if (substance.id === "co2") {
      if (targetStateToAchieve === "solid") {
        initialTemp = -50; // Not cold enough for solid CO2 at normal pressure
        initialPressure = 1;
      } else if (targetStateToAchieve === "liquid") {
        initialTemp = -70; // Cold but not solid
        initialPressure = 1; // Low pressure (won't be liquid)
      } else if (targetStateToAchieve === "gas") {
        initialTemp = -100; // Cold enough for solid CO2
        initialPressure = 1;
      }
    } else {
      // For other substances, use opposite temperatures
      if (targetStateToAchieve === "solid") {
        initialTemp = substance.freezingPoint + 20; // Warmer than freezing
      } else if (targetStateToAchieve === "liquid") {
        // 50% chance to be too cold or too hot
        initialTemp =
          Math.random() < 0.5
            ? substance.freezingPoint - 20 // Too cold (solid)
            : substance.boilingPoint + 20; // Too hot (gas)
      } else if (targetStateToAchieve === "gas") {
        initialTemp = substance.boilingPoint - 20; // Cooler than boiling
      }
    }

    // Directly set state values to avoid triggering re-renders too early
    setTemperature(initialTemp);
    setPressure(initialPressure);

    // Ensure the UI reflects these changes before we finish setup
    setTimeout(() => {
      // Update the state to match these conditions
      updateState(substance, initialTemp, initialPressure);

      // Mark setup as complete after a small delay to ensure state updates
      setTimeout(() => {
        isSettingUp.current = false;
        challengeSetupComplete.current = true;
      }, 300);
    }, 100);
  };

  // Set up a target state challenge
  const setupTargetChallenge = (substance = selectedSubstance) => {
    const states = ["solid", "liquid", "gas"];

    // Ensure we don't get the same state twice in a row
    let randomState;
    do {
      randomState = states[Math.floor(Math.random() * states.length)];
    } while (randomState === lastAchievedState);

    // Reset the target achieved state
    setTargetAchieved(false);

    // Set the target state FIRST
    setTargetState(randomState);

    // Special case for CO2 - if trying for liquid CO2, ensure it's achievable
    if (
      substance.id === "co2" &&
      randomState === "liquid" &&
      challengeType !== "cycle"
    ) {
      setFeedback(
        "Hint: CO₂ can only be liquid under high pressure and specific temperatures!"
      );
    } else {
      // Updated feedback message format
      setFeedback(`Target: Achieve the state: ${randomState}!`);
    }

    // THEN call setupInitialConditions AFTER setting the target
    setupInitialConditions(substance, randomState);
  };

  // Set up cycle challenge
  const setupCycleChallenge = (substance = selectedSubstance) => {
    // Reset cycle progress
    setCycleProgress(0);
    setTargetState("solid"); // Start with solid

    // Set up initial conditions for first phase (solid)
    setupInitialConditions(substance, "solid");

    setFeedback(
      `Challenge 3/3: Start with ${substance.states.solid.name}, then cycle through all states!`
    );
  };

  // Move to next challenge or substance
  const moveToNextChallenge = () => {
    isSettingUp.current = true; // Block state changes during transition

    // Store last achieved state for comparison in next challenge
    if (targetState) {
      setLastAchievedState(targetState);
    }

    const nextChallengeCount = completedChallengesForSubstance + 1;

    // Check if we've done all 3 challenges for this substance
    if (nextChallengeCount >= 3) {
      // Move to next substance
      moveToNextSubstance();
    } else {
      // Set up next challenge for current substance
      setCompletedChallengesForSubstance(nextChallengeCount);

      // Need to update completed challenges before choosing next challenge type
      setTimeout(() => {
        if (nextChallengeCount === 1) {
          // Second challenge is another target state
          setupTargetChallenge();
        } else if (nextChallengeCount === 2) {
          // Third challenge is a cycle challenge
          setChallengeType("cycle");
          setupCycleChallenge();
        }
        // Release the setup lock after a delay
        setTimeout(() => {
          isSettingUp.current = false;
        }, 500);
      }, 500); // Small delay to ensure state updates
    }
  };

  // Move to next substance challenge
  const moveToNextSubstance = () => {
    isSettingUp.current = true; // Block state changes during transition

    // Add current substance to completed list
    setCompletedSubstances((prev) => [...prev, selectedSubstance.id]);

    // Reset challenge count for next substance
    setCompletedChallengesForSubstance(0);
    setLastAchievedState(null);

    // Find next uncompleted substance
    let nextIndex = (currentSubstanceIndex + 1) % substances.length;

    // Check if we've completed all substances
    if (completedSubstances.length + 1 >= substances.length) {
      // All substances completed, return to explore mode
      setChallengeActive(false);
      setChallengeType(null);
      setTargetState(null);
      setCompletedSubstances([]);
      setCurrentSubstanceIndex(0);
      setTargetAchieved(false);
      setCycleProgress(0);
      setScore(0); // Reset score when finishing all challenges
      setFeedback(
        "Congratulations! You've completed challenges for all substances! Returning to explore mode."
      );
      setTimeout(() => setFeedback(""), 4000);
      setTimeout(() => {
        isSettingUp.current = false; // Release the setup lock
      }, 500);
      return;
    }

    // Find the next substance that hasn't been completed
    while (completedSubstances.includes(substances[nextIndex].id)) {
      nextIndex = (nextIndex + 1) % substances.length;
    }

    // Update substance index
    setCurrentSubstanceIndex(nextIndex);
    const nextSubstance = substances[nextIndex];

    // Set next substance and reset
    setSelectedSubstance(nextSubstance);
    setChallengeType("target"); // Reset to target challenge for new substance

    // Set up new challenge
    setTimeout(() => {
      setFeedback(`Next substance: ${nextSubstance.name}!`);
      setTimeout(() => {
        setupTargetChallenge(nextSubstance);
        setTimeout(() => {
          isSettingUp.current = false; // Release the setup lock
        }, 500);
      }, 1500);
    }, 1000);
  };

  // Check if challenge goal is met
  const checkChallengeProgress = (newState, substance = selectedSubstance) => {
    if (!challengeActive || isSettingUp.current) {
      return; // No challenge to check in explore mode or during setup
    }

    if (
      challengeType === "target" &&
      newState === targetState &&
      !targetAchieved
    ) {
      // Mark target as achieved to prevent multiple score increments
      setTargetAchieved(true);

      // Award points and provide feedback
      setFeedback(
        `✅ Success! You've changed ${substance.name} to ${substance.states[newState].name}! +10 points`
      );
      setScore((prevScore) => prevScore + 10);

      // Wait and set up next challenge or move to next substance
      setTimeout(() => {
        moveToNextChallenge();
      }, 2000);
    }

    if (challengeType === "cycle") {
      // Handle cycle challenge with state tracking to prevent multiple score increments
      if (newState === "solid" && cycleProgress === 0) {
        setCycleProgress(1);
        setFeedback(
          `✅ ${substance.states.solid.name} created! Now make it a ${substance.states.liquid.name}!`
        );
        setTargetState("liquid");
        setScore((prevScore) => prevScore + 10);
      } else if (newState === "liquid" && cycleProgress === 1) {
        setCycleProgress(2);
        setFeedback(
          `✅ ${substance.states.liquid.name} created! Now make it a ${substance.states.gas.name}!`
        );
        setTargetState("gas");
        setScore((prevScore) => prevScore + 10);
      } else if (newState === "gas" && cycleProgress === 2) {
        setCycleProgress(3);
        setFeedback(
          `✅ ${substance.states.gas.name} created! Full cycle completed! +50 points!`
        );
        setScore((prevScore) => prevScore + 50);

        // Move to next substance after completing cycle
        setTimeout(() => {
          moveToNextSubstance();
        }, 2000);
      }
    }
  };

  // Generate particles based on state and temperature
  const generateParticles = (state, temp) => {
    const particleCount = state === "solid" ? 30 : state === "liquid" ? 40 : 50;
    const speed =
      state === "solid"
        ? 0.5
        : state === "liquid"
        ? 1 + temp / 100
        : 2 + temp / 50;

    const newParticles = Array.from({ length: particleCount }, (_, i) => ({
      id: i,
      x: Math.random() * 100,
      y: Math.random() * 100,
      size: Math.random() * 3 + 2,
      speedX: (Math.random() - 0.5) * speed,
      speedY: (Math.random() - 0.5) * speed,
    }));

    setParticles(newParticles);
  };

  // Initialize on load
  useEffect(() => {
    updateState(selectedSubstance, temperature, pressure);
    setFeedback(
      "Explore mode: Change temperature and pressure to see different states of matter!"
    );
    setTimeout(() => setFeedback(""), 3000);
  }, []);

  // Animation loop for particles
  useEffect(() => {
    if (particles.length === 0) return;

    const interval = setInterval(() => {
      setParticles((prevParticles) =>
        prevParticles.map((p) => {
          // Update position
          let newX = p.x + p.speedX;
          let newY = p.y + p.speedY;

          // Bounce off walls
          if (newX < 0 || newX > 100) {
            p.speedX *= -1;
            newX = p.x + p.speedX;
          }

          if (newY < 0 || newY > 100) {
            p.speedY *= -1;
            newY = p.y + p.speedY;
          }

          return {
            ...p,
            x: newX,
            y: newY,
          };
        })
      );
    }, 50);

    return () => clearInterval(interval);
  }, [particles]);

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
              State Changes Challenge
            </Typography>
            <Box className="mode-score-container">
              <Button
                className={challengeActive ? "reset-button" : ""}
                variant="contained"
                color={challengeActive ? "secondary" : "primary"}
                onClick={handleChallengeToggle}
              >
                {challengeActive ? "Exit Challenge" : "Challenge Mode"}
              </Button>

              {/* Only show score when in challenge mode */}
              {challengeActive && (
                <Typography variant="h6" className="score-display">
                  Score: {score}
                </Typography>
              )}
            </Box>
          </Box>

          {/* Challenge progress indicator */}
          {challengeActive && (
            <Box className="challenge-progress">
              <Typography variant="subtitle1">
                Substance: {selectedSubstance.name} - Challenge{" "}
                {completedChallengesForSubstance + 1}/3
              </Typography>
              <Box className="progress-indicators">
                {[0, 1, 2].map((index) => (
                  <Box
                    key={index}
                    className={`progress-dot ${
                      index < completedChallengesForSubstance
                        ? "completed"
                        : index === completedChallengesForSubstance
                        ? "current"
                        : ""
                    }`}
                  />
                ))}
              </Box>
            </Box>
          )}

          {/* Feedback message */}
          {feedback && (
            <Typography variant="h6" className="feedback">
              {feedback}
            </Typography>
          )}

          {/* Controls Section */}
          <Box className="controls-section">
            <FormControl className="substance-select">
              <InputLabel id="substance-select-label">Substance</InputLabel>
              <Select
                labelId="substance-select-label"
                id="substance-select"
                value={selectedSubstance.id}
                label="Substance"
                onChange={handleSubstanceChange}
                disabled={challengeActive} // Disable during challenges
              >
                {substances.map((substance) => (
                  <MenuItem key={substance.id} value={substance.id}>
                    {substance.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            <Box className="slider-container">
              <Typography id="temperature-slider-label">
                Temperature: {temperature}°C
              </Typography>
              <Slider
                aria-labelledby="temperature-slider-label"
                min={-250}
                max={400}
                value={temperature}
                onChange={handleTemperatureChange}
                className="temperature-slider"
                disabled={isSettingUp.current} // Disable during setup
              />
            </Box>

            <Box className="slider-container">
              <Typography id="pressure-slider-label">
                Pressure: {pressure.toFixed(1)} atm
              </Typography>
              <Slider
                aria-labelledby="pressure-slider-label"
                min={0.1}
                max={10}
                step={0.1}
                value={pressure}
                onChange={handlePressureChange}
                className="pressure-slider"
                disabled={isSettingUp.current} // Disable during setup
              />
            </Box>
          </Box>

          {/* Simulation Container */}
          <Box
            className={`simulation-container state-${currentState}`}
            style={{
              backgroundColor: selectedSubstance.states[currentState].color,
            }}
          >
            <Typography variant="h5" className="state-label">
              Current State: {selectedSubstance.states[currentState].name}
            </Typography>

            {/* Target state indicator (only shown during challenges) */}
            {challengeActive && targetState && (
              <Typography className="target-state-indicator">
                Target: {selectedSubstance.states[targetState].name}
              </Typography>
            )}

            {/* Particles */}
            {particles.map((particle) => (
              <Box
                key={particle.id}
                className="particle"
                style={{
                  left: `${particle.x}%`,
                  top: `${particle.y}%`,
                  width: `${particle.size}px`,
                  height: `${particle.size}px`,
                  opacity: currentState === "gas" ? 0.7 : 1,
                }}
              />
            ))}

            {/* Temperature indicator */}
            <Box className="temperature-indicator">
              <div className="temperature-bar">
                <div
                  className="temperature-marker"
                  style={{
                    top: `${100 - ((temperature + 250) / 650) * 100}%`,
                  }}
                />
              </div>
              <Typography variant="caption">{temperature}°C</Typography>
            </Box>
          </Box>

          {/* Info panel */}
          <Box className="info-panel">
            <Typography variant="body1">
              <strong>Freezing Point:</strong> {selectedSubstance.freezingPoint}
              °C |<strong> Boiling Point:</strong>{" "}
              {selectedSubstance.boilingPoint}°C
            </Typography>
            {selectedSubstance.id === "co2" && (
              <Typography variant="body2" color="info.main">
                <strong>CO₂ Special Property:</strong> At normal pressure, CO₂
                sublimates directly from solid to gas. It needs high pressure
                (5.1 atm) to become liquid.
              </Typography>
            )}
            <Typography variant="body2">
              Particles move faster as temperature increases. State changes
              occur at specific temperatures and pressures.
            </Typography>
          </Box>
        </Box>
      </Box>
    </Box>
  );
};

export default StateChangesChallenge;
