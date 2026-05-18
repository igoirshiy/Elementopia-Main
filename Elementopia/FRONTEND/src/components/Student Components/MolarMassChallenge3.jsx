import React, { useState } from "react";
import "../../assets/css/ChallengeGames.css";

const MolarMassChallenge3 = ({ onComplete }) => {
  const [a, setA] = useState("");
  const [msg, setMsg] = useState("");

  const check = () => {
    if (parseFloat(a) === 17) {
      setMsg("✅ Correct! NH₃ has 17 g/mol.");
      setTimeout(() => onComplete && onComplete(), 1500);
    } else setMsg("❌ Try again!");
  };

  return (
    <div className="game-container">
      <h2>⚗️ Molar Mass Challenge 3: Ammonia</h2>
      <p className="subtitle">Find the molar mass of NH₃.</p>
      <input className="game-input" type="number" placeholder="Enter g/mol" value={a} onChange={(e) => setA(e.target.value)} />
      <div className="workspace-actions">
        <button className="game-btn" onClick={check}>Check</button>
      </div>
      {msg && <p className="game-message">{msg}</p>}
    </div>
  );
};
export default MolarMassChallenge3;
