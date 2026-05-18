import React, { useState, useEffect } from "react";
import "../../assets/css/PercentCompositionChallenge.css";

const compounds = [
  { id: 1, name: "CO₂", correctPercent: "27.3% C, 72.7% O" },
  { id: 2, name: "H₂O", correctPercent: "11.2% H, 88.8% O" },
  { id: 3, name: "CH₄", correctPercent: "75% C, 25% H" },
];

const percentOptions = [
  "27.3% C, 72.7% O",
  "30% C, 70% O",
  "11.2% H, 88.8% O",
  "10% H, 90% O",
  "75% C, 25% H",
  "70% C, 30% H",
];

function shuffle(arr) {
  return arr.sort(() => Math.random() - 0.5);
}

export default function PCChallenge3({ onComplete = () => {} }) {
  const [matches, setMatches] = useState({});
  const [options, setOptions] = useState([]);
  const [isCompleted, setIsCompleted] = useState(false);
  const [draggedCompound, setDraggedCompound] = useState(null);
  const [wrongMatch, setWrongMatch] = useState(null);
  const [correctMatch, setCorrectMatch] = useState(null);

  useEffect(() => {
    setOptions(shuffle([...percentOptions]));
  }, []);

  const handleDragStart = (e, compoundName) => {
    // Don't allow dragging if already matched
    if (matches[compoundName]) return;
    e.dataTransfer.setData("compound", compoundName);
    setDraggedCompound(compoundName);
  };

  const handleDragEnd = () => {
    setDraggedCompound(null);
  };

  const handleDrop = (e, percent) => {
    e.preventDefault();
    const compound = e.dataTransfer.getData("compound");
    if (!compound || isMatched(percent)) return;

    // Check if this match is correct
    const compoundData = compounds.find(c => c.name === compound);
    const isCorrect = compoundData.correctPercent === percent;

    if (isCorrect) {
      // Correct match
      setCorrectMatch(percent);
      setTimeout(() => setCorrectMatch(null), 600);
      
      const updated = { ...matches, [compound]: percent };
      setMatches(updated);
      
      const allCorrect = compounds.every(
        c => updated[c.name] === c.correctPercent
      );
      setIsCompleted(allCorrect);
      if (allCorrect) setTimeout(() => onComplete(), 2500);
    } else {
      // Wrong match - show error animation
      setWrongMatch(percent);
      setTimeout(() => setWrongMatch(null), 600);
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleReset = () => {
    setMatches({});
    setIsCompleted(false);
    setOptions(shuffle([...percentOptions]));
  };

  const isMatched = (percent) => Object.values(matches).includes(percent);
  const getMatchedCompound = (percent) => {
    return Object.keys(matches).find(key => matches[key] === percent);
  };

  const isCorrectMatch = (percent) => {
    const matchedCompound = getMatchedCompound(percent);
    if (!matchedCompound) return false;
    const compoundData = compounds.find(c => c.name === matchedCompound);
    return compoundData?.correctPercent === percent;
  };

  const correctCount = Object.keys(matches).filter(compound => {
    const compoundData = compounds.find(c => c.name === compound);
    return compoundData.correctPercent === matches[compound];
  }).length;

  return (
    <div className="pc-challenge-wrapper">
      <div className="pc-challenge-container">
        <h2>Challenge 3: Match the Mole!</h2>
        <p className="pc-challenge-desc">
          Drag each compound to its correct percent composition
        </p>

        <div className="pc-progress-bar">
          <div className="pc-progress-text">
            Progress: {correctCount} / {compounds.length} correct
          </div>
          <div className="pc-progress-track">
            <div 
              className="pc-progress-fill" 
              style={{ width: `${(correctCount / compounds.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="pc-match-layout">
          {/* Left side - Compounds */}
          <div className="pc-compounds-section">
            <h3 className="pc-section-title">Compounds</h3>
            <div className="pc-compounds-list">
              {compounds.map(c => (
                <div
                  key={c.id}
                  className={`pc-compound-card ${matches[c.name] ? 'pc-card-used' : ''} ${draggedCompound === c.name ? 'pc-card-dragging' : ''}`}
                  draggable={!matches[c.name]}
                  onDragStart={(e) => handleDragStart(e, c.name)}
                  onDragEnd={handleDragEnd}
                >
                  <div className="pc-compound-name">{c.name}</div>
                  {matches[c.name] && (
                    <div className="pc-compound-matched-indicator">
                      ✓ Matched
                    </div>
                  )}
                  {!matches[c.name] && (
                    <div className="pc-drag-hint">Drag me →</div>
                  )}
                </div>
              ))}
            </div>
          </div>

          {/* Right side - Percent Compositions */}
          <div className="pc-percents-section">
            <h3 className="pc-section-title">Percent Composition</h3>
            <div className="pc-percents-list">
              {options.map((p, i) => (
                <div
                  key={i}
                  className={`pc-percent-card ${isMatched(p) ? (isCorrectMatch(p) ? 'pc-card-correct' : 'pc-card-matched') : ''} ${draggedCompound && !isMatched(p) ? 'pc-card-droppable' : ''} ${wrongMatch === p ? 'pc-card-wrong' : ''} ${correctMatch === p ? 'pc-card-success-pop' : ''}`}
                  onDragOver={handleDragOver}
                  onDrop={(e) => handleDrop(e, p)}
                >
                  <div className="pc-percent-text">{p}</div>
                  {isMatched(p) ? (
                    <div className={`pc-matched-compound ${isCorrectMatch(p) ? 'pc-correct-indicator' : ''}`}>
                      {isCorrectMatch(p) && <span className="pc-check-icon">✓</span>}
                      {getMatchedCompound(p)}
                    </div>
                  ) : draggedCompound ? (
                    <div className="pc-drop-hint-text">Drop here</div>
                  ) : null}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="pc-bottom-controls">
          <button className="pc-reset-btn" onClick={handleReset}>
            ↻ Reset All
          </button>
        </div>

        {isCompleted && (
          <div className="pc-success-popup">
            <span className="pc-success-icon">🎉</span>
            <span className="pc-success-text">Perfect! All matches correct!</span>
          </div>
        )}
      </div>
    </div>
  );
}