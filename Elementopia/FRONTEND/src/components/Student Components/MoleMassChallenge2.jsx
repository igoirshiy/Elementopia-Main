import React, { useState } from 'react';
import '../../assets/css/MoleMassChallenge.css';

// --- Periodic Table Data ---
const periodicTable = {
  Mg: { name: 'Magnesium', mass: 24.305 },
  Cl: { name: 'Chlorine', mass: 35.453 },
};

export default function MoleMassChallenge2({ onComplete }) {
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
    // Correct Answer: MgCl₂
    // (Mg: 1 * 24.3) + (Cl: 2 * 35.5) = 24.3 + 71.0 = 95.3
    const isCorrect = userInputs.el1Count === '1' &&
                      (userInputs.el1Mass === '24.3' || userInputs.el1Mass === '24.31') &&
                      userInputs.el2Count === '2' &&
                      (userInputs.el2Mass === '35.5' || userInputs.el2Mass === '35.45') &&
                      (userInputs.total === '95.3' || userInputs.total === '95.21');

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
        <h3>Challenge 2: Molar Mass of MgCl₂</h3>
        <p>Calculate the molar mass for **Magnesium Chloride (MgCl₂)**. Pay close attention to the subscripts!</p>
      </div>

      <div className="mole-mass-workspace">
        <div className="calculator-area">
          <h2 className="formula-display">MgCl₂</h2>
          {/* Row 1: Magnesium (Mg) */}
          <div className="equation-row">
            <span>(Atoms of Mg:</span>
            <input type="text" name="el1Count" value={userInputs.el1Count} onChange={handleInputChange} placeholder="#" />
            <span>× Mass of Mg:</span>
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
            <p>Correct! (95.21 g/mol) 🔥</p>
            <button onClick={onComplete} className="complete-btn">Complete Challenge</button>
          </div>
        )}
      </div>
    </div>
  );
}