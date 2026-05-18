import React, { useState, useEffect } from "react";
import "../../assets/css/PercentCompositionChallenge.css";

const elementsList = [
  { symbol: "H", name: "Hydrogen" },
  { symbol: "O", name: "Oxygen" },
  { symbol: "C", name: "Carbon" },
  { symbol: "N", name: "Nitrogen" },
];

const TARGETS = {
  "CO₂": { C: 1, O: 2 },
  "CH₄": { C: 1, H: 4 },
  "H₂O": { H: 2, O: 1 },
  "NH₃": { N: 1, H: 3 },
};

export default function PercentCompositionChallenge1({ onComplete = () => {} }) {
  const [target, setTarget] = useState("");
  const [placedCounts, setPlacedCounts] = useState({});
  const [isCompleted, setIsCompleted] = useState(false);
  const [message, setMessage] = useState("");
  const [wrongAttempt, setWrongAttempt] = useState(false);
  const [draggedElement, setDraggedElement] = useState(null);

  // choose random compound on load
  useEffect(() => {
    const keys = Object.keys(TARGETS);
    setTarget(keys[Math.floor(Math.random() * keys.length)]);
  }, []);

  const correctElements = TARGETS[target] || {};

  function handleDropSymbol(symbol) {
    if (isCompleted) return;
    setPlacedCounts(prev => {
      const next = { ...prev, [symbol]: (prev[symbol] || 0) + 1 };
      checkIfComplete(next);
      return next;
    });
  }

  function checkIfComplete(counts) {
    const keysCorrect = Object.keys(correctElements).every(
      k => counts[k] === correctElements[k]
    );
    const noExtra = Object.keys(counts).every(
      k => (correctElements[k] || 0) === counts[k]
    );

    if (keysCorrect && noExtra) {
      setIsCompleted(true);
      setMessage(`Perfect! ${target} built!`);
      setTimeout(() => onComplete(), 2500);
    }
  }

  const handleDrop = e => {
    e.preventDefault();
    setDraggedElement(null);
    const symbol = e.dataTransfer.getData("symbol");
    if (symbol) handleDropSymbol(symbol);
  };

  const handleDragStart = (e, symbol) => {
    e.dataTransfer.setData("symbol", symbol);
    setDraggedElement(symbol);
  };

  const handleDragEnd = () => {
    setDraggedElement(null);
  };

  const handleCheck = () => {
    const keysCorrect = Object.keys(correctElements).every(
      k => placedCounts[k] === correctElements[k]
    );
    const noExtra = Object.keys(placedCounts).every(
      k => (correctElements[k] || 0) === placedCounts[k]
    );
    
    if (keysCorrect && noExtra) {
      setIsCompleted(true);
      setMessage(`Perfect! ${target} completed!`);
      setTimeout(() => onComplete(), 2500);
    } else {
      setMessage("Not quite right! Check your atoms again.");
      setWrongAttempt(true);
      setTimeout(() => {
        setWrongAttempt(false);
        setMessage("");
      }, 2000);
    }
  };

  const handleReset = () => {
    setPlacedCounts({});
    setIsCompleted(false);
    setMessage("");
    setWrongAttempt(false);
  };

  const placedTiles = Object.entries(placedCounts).flatMap(([sym, count]) =>
    Array(count).fill(sym)
  );

  const totalPlaced = placedTiles.length;
  const totalNeeded = Object.values(correctElements).reduce((a, b) => a + b, 0);

  return (
    <div className="pc-challenge-wrapper">
      <div className={`pc-challenge-container ${isCompleted ? "glow-scale" : ""}`}>
        <h2>Challenge 1: Build the Molecule!</h2>
        <p className="pc-challenge-desc">
          Drag elements to create <strong className="pc-target-molecule">{target}</strong>
        </p>

        <div className="pc-progress-bar">
          <div className="pc-progress-text">
            Atoms placed: {totalPlaced} / {totalNeeded}
          </div>
          <div className="pc-progress-track">
            <div 
              className="pc-progress-fill" 
              style={{ width: `${(totalPlaced / totalNeeded) * 100}%` }}
            />
          </div>
        </div>

        <div
          className={`pc-drop-zone-v2 ${draggedElement ? 'pc-drop-active' : ''} ${wrongAttempt ? 'pc-drop-error' : ''}`}
          onDragOver={e => e.preventDefault()}
          onDrop={handleDrop}
        >
          {placedTiles.length === 0 && !isCompleted && (
            <div className="pc-drop-hint-v2">
              <span className="pc-drop-icon">⬇</span>
              <span>Drag atoms here</span>
            </div>
          )}
          <div className="pc-placed-tiles-container">
            {placedTiles.map((sym, idx) => (
              <div
                key={idx}
                className="pc-placed-tile-v2"
                title="Click to remove"
                onClick={() => {
                  if (isCompleted) return;
                  const next = { ...placedCounts };
                  next[sym]--;
                  if (next[sym] <= 0) delete next[sym];
                  setPlacedCounts(next);
                  setMessage("");
                }}
              >
                {sym}
                <div className="pc-remove-hint">×</div>
              </div>
            ))}
          </div>
        </div>

        <div className="pc-elements-section">
          <h3 className="pc-section-title-small">Available Elements</h3>
          <div className="pc-elements-pool-v2">
            {elementsList.map(el => (
              <div
                key={el.symbol}
                className={`pc-element-tile-v2 ${draggedElement === el.symbol ? 'pc-element-dragging' : ''}`}
                draggable={!isCompleted}
                onDragStart={e => handleDragStart(e, el.symbol)}
                onDragEnd={handleDragEnd}
              >
                <div className="pc-element-symbol">{el.symbol}</div>
                <div className="pc-element-name">{el.name}</div>
              </div>
            ))}
          </div>
        </div>

        <div className="pc-bottom-controls">
          <button
            className="pc-check-btn"
            onClick={handleCheck}
            disabled={isCompleted || totalPlaced === 0}
          >
            ✓ Check Answer
          </button>
          <button
            className="pc-reset-btn"
            onClick={handleReset}
          >
            ↻ Reset
          </button>
        </div>

        {message && (
          <div className={`pc-message-popup ${isCompleted ? 'pc-message-success' : 'pc-message-error'}`}>
            {isCompleted && <span className="pc-success-icon">🎉</span>}
            {!isCompleted && <span className="pc-error-icon">⚠️</span>}
            <span>{message}</span>
          </div>
        )}
      </div>
    </div>
  );
}