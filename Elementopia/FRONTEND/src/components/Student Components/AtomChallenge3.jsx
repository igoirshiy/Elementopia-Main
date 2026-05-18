import React, { useState } from "react";
import AtomChallengeCore from "./AtomChallengeCore";
import "../../assets/css/AtomChallenge.css";

export default function AtomChallenge3({ onComplete }) {
  const challenges = [
    { name: "Sodium", protons: 11, neutrons: 12, electrons: 11 },
    { name: 'Magnesium', protons: 12, neutrons: 12, electrons: 12 },
    { name: 'Aluminum', protons: 13, neutrons: 14, electrons: 13 },
    { name: 'Silicon', protons: 14, neutrons: 14, electrons: 14 },
    { name: 'Phosphorus', protons: 15, neutrons: 16, electrons: 15 },
  ];

  const [currentIndex, setCurrentIndex] = useState(0);

  const handleChallengeComplete = () => {
    if (currentIndex < challenges.length - 1) {
      setCurrentIndex((prev) => prev + 1);
    } else {
      onComplete();
    }
  };

  return (
    <AtomChallengeCore
      key={currentIndex}
      challenge={challenges[currentIndex]}
      onChallengeComplete={handleChallengeComplete}
    />
  );
}
