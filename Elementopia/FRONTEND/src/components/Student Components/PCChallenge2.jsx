import React, { useState, useEffect } from "react";
import "../../assets/css/PercentCompositionChallenge.css";

const ELEMENTS = [
  { symbol: "H", weight: 1.008, name: "Hydrogen" },
  { symbol: "O", weight: 16.00, name: "Oxygen" },
];

export default function PCChallenge2({ onComplete = () => {} }) {
  const TARGET_COMPOSITION = 11.19;
  const [molecule, setMolecule] = useState([]);
  const [percentH, setPercentH] = useState(0);
  const [isCorrect, setIsCorrect] = useState(false);
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    const total = molecule.reduce((s, e) => s + e.weight, 0);
    const hMass = molecule
      .filter(e => e.symbol === "H")
      .reduce((s, e) => s + e.weight, 0);
    const percent = total ? ((hMass / total) * 100).toFixed(2) : 0;
    setPercentH(percent);
    
    if (Math.abs(percent - TARGET_COMPOSITION) < 0.5 && total > 0) {
      setIsCorrect(true);
      setTimeout(() => onComplete(), 2500);
    } else {
      setIsCorrect(false);
    }
  }, [molecule, onComplete]);

  const addElement = el => {
    if (isCorrect) return;
    setMolecule([...molecule, el]);
  };
  
  const removeElement = idx => {
    if (isCorrect) return;
    setMolecule(molecule.filter((_, i) => i !== idx));
  };

  const handleReset = () => {
    setMolecule([]);
    setIsCorrect(false);
    setShowHint(false);
  };

  const totalMass = molecule.reduce((s, e) => s + e.weight, 0).toFixed(3);
  const hMass = molecule
    .filter(e => e.symbol === "H")
    .reduce((s, e) => s + e.weight, 0)
    .toFixed(3);
  const oMass = molecule
    .filter(e => e.symbol === "O")
    .reduce((s, e) => s + e.weight, 0)
    .toFixed(3);

  const percentDiff = Math.abs(percentH - TARGET_COMPOSITION);
  const isClose = percentDiff < 2 && percentDiff > 0.5;

  return (
    <div className="pc-challenge-wrapper">
      <div className={`pc-challenge-container ${isCorrect ? "glow-scale" : ""}`}>
        <h2>Challenge 2: Balance the Composition!</h2>
        <p className="pc-challenge-desc">
          Form <strong className="pc-target-molecule">H₂O</strong> so that Hydrogen = <strong className="pc-target-percent">{TARGET_COMPOSITION}%</strong> of its mass
        </p>

        <div className="pc-composition-display">
          <div className="pc-comp-card">
            <div className="pc-comp-label">Current H%</div>
            <div className={`pc-comp-value ${isCorrect ? 'pc-comp-correct' : isClose ? 'pc-comp-close' : ''}`}>
              {percentH}%
            </div>
            <div className="pc-comp-target">Target: {TARGET_COMPOSITION}%</div>
          </div>
          
          <div className="pc-comp-card">
            <div className="pc-comp-label">Total Mass</div>
            <div className="pc-comp-value">{totalMass} g/mol</div>
            <div className="pc-comp-breakdown">
              H: {hMass} | O: {oMass}
            </div>
          </div>
        </div>

        <div className="pc-elements-section">
          <h3 className="pc-section-title-small">Click to Add Atoms</h3>
          <div className="pc-elements-pool-v2">
            {ELEMENTS.map((el, i) => (
              <div
                key={i}
                className={`pc-element-tile-v2 ${isCorrect ? 'pc-element-disabled' : ''}`}
                onClick={() => addElement(el)}
              >
                <div className="pc-element-symbol">{el.symbol}</div>
                <div className="pc-element-weight">{el.weight} g/mol</div>
              </div>
            ))}
          </div>
        </div>

        <div className="pc-drop-zone-v2">
          {molecule.length === 0 && (
            <div className="pc-drop-hint-v2">
              <span className="pc-drop-icon">💧</span>
              <span>Click atoms above to build your molecule</span>
            </div>
          )}
          <div className="pc-placed-tiles-container">
            {molecule.map((el, i) => (
              <div
                key={i}
                className="pc-placed-tile-v2"
                title="Click to remove"
                onClick={() => removeElement(i)}
              >
                {el.symbol}
                <div className="pc-remove-hint">×</div>
              </div>
            ))}
          </div>
        </div>

        <div className="pc-bottom-controls">
          <button
            className="pc-reset-btn"
            onClick={handleReset}
          >
            ↻ Reset
          </button>
          <button
            className="pc-hint-btn"
            onClick={() => setShowHint(!showHint)}
          >
            💡 {showHint ? 'Hide' : 'Show'} Hint
          </button>
        </div>

        {showHint && !isCorrect && (
          <div className="pc-hint-box">
            <strong>Hint:</strong> Water (H₂O) has 2 Hydrogen atoms and 1 Oxygen atom. 
            Try adding the correct number of each!
          </div>
        )}

        {isClose && !isCorrect && (
          <div className="pc-message-popup pc-message-warning">
            <span>🔬</span>
            <span>You're close! Adjust your atoms slightly.</span>
          </div>
        )}

        {isCorrect && (
          <div className="pc-message-popup pc-message-success">
            <span className="pc-success-icon">🎉</span>
            <span>Perfect! You balanced the composition!</span>
          </div>
        )}
      </div>
    </div>
  );
}