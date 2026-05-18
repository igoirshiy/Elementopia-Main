import React, { useState } from "react";
import AtomChallengeCore from "./AtomChallengeCore";
import "../../assets/css/AtomChallenge.css";

export default function AtomChallenge1({ onComplete }) {
  const challenges = [
    { name: "Hydrogen", protons: 1, neutrons: 0, electrons: 1 },
     { name: "Helium", protons: 2, neutrons: 2, electrons: 2 },
    // { name: "Lithium", protons: 3, neutrons: 4, electrons: 3 },
    // { name: "Beryllium", protons: 4, neutrons: 5, electrons: 4 },
    // { name: "Boron", protons: 5, neutrons: 6, electrons: 5 },
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
