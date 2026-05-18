import React, { useState } from "react";
import "../../assets/css/ChallengeGames.css";

const MolarMassChallenge2 = ({ onComplete }) => {
  const [a, setA] = useState("");
  const [msg, setMsg] = useState("");

  const check = () => {
    if (parseFloat(a) === 44) {
      setMsg("✅ Correct! CO₂ has 44 g/mol.");
      setTimeout(() => onComplete && onComplete(), 1500);
    } else setMsg("❌ Try again!");
  };

  return (
    <div className="game-container">
      <h2>⚗️ Molar Mass Challenge 2: Carbon Dioxide</h2>
      <p className="subtitle">Find the molar mass of CO₂.</p>
      <input className="game-input" type="number" placeholder="Enter g/mol" value={a} onChange={(e) => setA(e.target.value)} />
      <div className="workspace-actions">
        <button className="game-btn" onClick={check}>Check</button>
      </div>
      {msg && <p className="game-message">{msg}</p>}
    </div>
  );
};
export default MolarMassChallenge2;
