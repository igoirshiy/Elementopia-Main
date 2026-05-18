import React, { useState } from 'react';
import '../../assets/css/MoleMassChallenge.css'; 
// import '../../assets/css/AtomChallenge.css';

// --- Periodic Table Data ---
const periodicTable = {
  Na: { name: 'Sodium', mass: 22.990 },
  Cl: { name: 'Chlorine', mass: 35.453 },
};

export default function MoleMassChallenge1({ onComplete }) {
  const [challengeStatus, setChallengeStatus] = useState('pending');
  const [userInputs, setUserInputs] = useState({
    el1Count: '', el1Mass: '',
    el2Count: '', el2Mass: '',
    total: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInputs(prev => ({ ...prev, [name]: value }));
  };

  function checkChallenge() {
    // Correct Answer: NaCl
    // (Na: 1 * 23.0) + (Cl: 1 * 35.5) = 58.5
    // Allowing for minor rounding differences.
    const isCorrect = userInputs.el1Count === '1' &&
                      (userInputs.el1Mass === '23.0' || userInputs.el1Mass === '22.99') &&
                      userInputs.el2Count === '1' &&
                      (userInputs.el2Mass === '35.5' || userInputs.el2Mass === '35.45') &&
                      (userInputs.total === '58.5' || userInputs.total === '58.44');

    if (isCorrect) {
      setChallengeStatus('correct');
    } else {
      setChallengeStatus('incorrect');
      setTimeout(() => setChallengeStatus('pending'), 1500);
    }
  }

  return (
    <div className="lesson-modal mole-mass-challenge">
      <div className="info-box">
        <h3>Challenge 1: Molar Mass of NaCl</h3>
        <p>Calculate the molar mass for **Sodium Chloride (NaCl)**. Use the calculator and periodic table reference. (Round mass to one decimal place).</p>
      </div>

      <div className="mole-mass-workspace">
        <div className="calculator-area">
          <h2 className="formula-display">NaCl</h2>
          {/* Row 1: Sodium (Na) */}
          <div className="equation-row">
            <span>(Atoms of Na:</span>
            <input type="text" name="el1Count" value={userInputs.el1Count} onChange={handleInputChange} placeholder="#" />
            <span>× Mass of Na:</span>
            <input type="text" name="el1Mass" value={userInputs.el1Mass} onChange={handleInputChange} placeholder="g/mol" />
            <span>)</span>
          </div>
          <span className="plus-sign">+</span>
          {/* Row 2: Chlorine (Cl) */}
          <div className="equation-row">
            <span>(Atoms of Cl:</span>
            <input type="text" name="el2Count" value={userInputs.el2Count} onChange={handleInputChange} placeholder="#" />
            <span>× Mass of Cl:</span>
            <input type="text" name="el2Mass" value={userInputs.el2Mass} onChange={handleInputChange} placeholder="g/mol" />
            <span>)</span>
          </div>
          <hr className="equals-line" />
          {/* Total Row */}
          <div className="equation-row total-row">
            <span>Total Molar Mass:</span>
            <input type="text" name="total" value={userInputs.total} onChange={handleInputChange} placeholder="g/mol" />
          </div>
        </div>

        <div className="periodic-table-ref">
          <h3>Periodic Table</h3>
          <div className="pt-grid">
            {Object.entries(periodicTable).map(([symbol, data]) => (
              <div key={symbol} className="pt-cell">
                <div className="pt-symbol">{symbol}</div>
                <div className="pt-name">{data.name}</div>
                <div className="pt-mass">{data.mass}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="controls-area">
        {challengeStatus !== 'correct' && (
          <button onClick={checkChallenge} className={`check-btn ${challengeStatus}`}>
            {challengeStatus === 'incorrect' ? 'Try Again!' : 'Check My Calculation'}
          </button>
        )}
        {challengeStatus === 'correct' && (
          <div className="success-message">
            <p>Correct! (58.44 g/mol) 🧂</p>
            <button onClick={onComplete} className="complete-btn">Complete Challenge</button>
          </div>
        )}
      </div>
    </div>
  );
}