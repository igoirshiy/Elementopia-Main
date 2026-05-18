import React, { useState } from "react";
import AtomChallengeCore from "./AtomChallengeCore";
import "../../assets/css/AtomChallenge.css";

export default function AtomChallenge2({ onComplete }) {
  const challenges = [
    { name: "Carbon", protons: 6, neutrons: 6, electrons: 6 },
    { name: 'Nitrogen', protons: 7, neutrons: 7, electrons: 7 },
    { name: 'Oxygen', protons: 8, neutrons: 8, electrons: 8 },
    { name: 'Fluorine', protons: 9, neutrons: 10, electrons: 9 },
    { name: 'Neon', protons: 10, neutrons: 10, electrons: 10 },
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
