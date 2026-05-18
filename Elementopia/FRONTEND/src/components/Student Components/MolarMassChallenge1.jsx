import React, { useState } from "react";
import "../../assets/css/ChallengeGames.css";

const MolarMassChallenge1 = ({ onComplete }) => {
  const [answer, setAnswer] = useState("");
  const [msg, setMsg] = useState("");

  const check = () => {
    if (parseFloat(answer) === 18) {
      setMsg("✅ Correct! H₂O has 18 g/mol.");
      setTimeout(() => onComplete && onComplete(), 1500);
    } else setMsg("❌ Try again!");
  };

  return (
    <div className="game-container">
      <h2>⚗️ Molar Mass Challenge 1: Water</h2>
      <p className="subtitle">Find the molar mass of H₂O.</p>
      <input className="game-input" type="number" placeholder="Enter g/mol" value={answer} onChange={(e) => setAnswer(e.target.value)} />
      <div className="workspace-actions">
        <button className="game-btn" onClick={check}>Check</button>
      </div>
      {msg && <p className="game-message">{msg}</p>}
    </div>
  );
};
export default MolarMassChallenge1;
