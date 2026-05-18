import React, { useState } from 'react';
import '../../assets/css/MoleMassChallenge.css';

// --- Periodic Table Data ---
const periodicTable = {
  Al: { name: 'Aluminum', mass: 26.982 },
  O: { name: 'Oxygen', mass: 15.999 },
  H: { name: 'Hydrogen', mass: 1.008 },
};

export default function MoleMassChallenge3({ onComplete }) {
  const [challengeStatus, setChallengeStatus] = useState('pending');
  const [userInputs, setUserInputs] = useState({
    el1Count: '', el1Mass: '', // Al
    el2Count: '', el2Mass: '', // O
    el3Count: '', el3Mass: '', // H
    total: '',
  });

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setUserInputs(prev => ({ ...prev, [name]: value }));
  };

  function checkChallenge() {
    // Correct Answer: Al(OH)₃
    // (Al: 1 * 27.0) + (O: 3 * 16.0) + (H: 3 * 1.0) = 27.0 + 48.0 + 3.0 = 78.0
    const isCorrect = userInputs.el1Count === '1' &&
                      (userInputs.el1Mass === '27.0' || userInputs.el1Mass === '26.98') &&
                      userInputs.el2Count === '3' &&
                      (userInputs.el2Mass === '16.0' || userInputs.el2Mass === '15.99') &&
                      userInputs.el3Count === '3' &&
                      (userInputs.el3Mass === '1.0' || userInputs.el3Mass === '1.01') &&
                      (userInputs.total === '78.0' || userInputs.total === '78.00');

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
        <h3>Challenge 3: Molar Mass of Al(OH)₃</h3>
        <p>Calculate the molar mass for **Aluminum Hydroxide (Al(OH)₃)**. Hint: The '3' outside the parenthesis applies to *everything* inside it.</p>
      </div>

      <div className="mole-mass-workspace three-rows">
        <div className="calculator-area">
          <h2 className="formula-display">Al(OH)₃</h2>
          {/* Row 1: Aluminum (Al) */}
          <div className="equation-row">
            <span>(Atoms of Al:</span>
            <input type="text" name="el1Count" value={userInputs.el1Count} onChange={handleInputChange} placeholder="#" />
            <span>× Mass of Al:</span>
            <input type="text" name="el1Mass" value={userInputs.el1Mass} onChange={handleInputChange} placeholder="g/mol" />
            <span>)</span>
          </div>
          <span className="plus-sign">+</span>
          {/* Row 2: Oxygen (O) */}
          <div className="equation-row">
            <span>(Atoms of O:</span>
            <input type="text" name="el2Count" value={userInputs.el2Count} onChange={handleInputChange} placeholder="#" />
            <span>× Mass of O:</span>
            <input type="text" name="el2Mass" value={userInputs.el2Mass} onChange={handleInputChange} placeholder="g/mol" />
            <span>)</span>
          </div>
          <span className="plus-sign">+</span>
          {/* Row 3: Hydrogen (H) */}
          <div className="equation-row">
            <span>(Atoms of H:</span>
            <input type="text" name="el3Count" value={userInputs.el3Count} onChange={handleInputChange} placeholder="#" />
            <span>× Mass of H:</span>
            <input type="text" name="el3Mass" value={userInputs.el3Mass} onChange={handleInputChange} placeholder="g/mol" />
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
          <div className="pt-grid-small">
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
            <p>Correct! (78.00 g/mol) 🤯</p>
            <button onClick={onComplete} className="complete-btn">Complete Challenge</button>
          </div>
        )}
      </div>
    </div>
  );
}