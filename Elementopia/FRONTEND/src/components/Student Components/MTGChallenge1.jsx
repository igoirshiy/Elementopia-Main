import React, { useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
import "../../assets/css/MolesToGramsChallenge.css";

const TILE_DATA = [
  { id: "H", label: "H (1.01 g/mol)", mass: 1.01 },
  { id: "O", label: "O (16.00 g/mol)", mass: 16.0 },
  { id: "C", label: "C (12.01 g/mol)", mass: 12.01 },
  { id: "Na", label: "Na (22.99 g/mol)", mass: 22.99 },
  { id: "Cl", label: "Cl (35.45 g/mol)", mass: 35.45 },
];

export default function MolesToGrams1({ onComplete }) {
  const [droppedTiles, setDroppedTiles] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [feedback, setFeedback] = useState(""); // "correct" | "wrong" | ""
  const [showConversion, setShowConversion] = useState(false);
  const [userAnswer, setUserAnswer] = useState("");
  const [answerFeedback, setAnswerFeedback] = useState("");

  const handleDragStart = (e) => setActiveId(e.active.id);

  const handleDragEnd = (e) => {
    const { over, active } = e;
    setActiveId(null);
    if (over && over.id === "beaker") {
      const tile = TILE_DATA.find((t) => t.id === active.id);
      setDroppedTiles((prev) => [...prev, tile]);
    }
  };

  const handleCheck = () => {
    const hCount = droppedTiles.filter((t) => t.id === "H").length;
    const oCount = droppedTiles.filter((t) => t.id === "O").length;
    const totalMass = droppedTiles.reduce((sum, t) => sum + t.mass, 0);
    const target = 18.02; // H₂O molar mass

    if (hCount === 2 && oCount === 1 && Math.abs(totalMass - target) < 0.05) {
      setFeedback("correct");
      setTimeout(() => {
        setFeedback("");
        setShowConversion(true);
      }, 1000);
    } else {
      setFeedback("wrong");
      setTimeout(() => setFeedback(""), 1000);
    }
  };

  const handleClear = () => {
    setDroppedTiles([]);
    setFeedback("");
    setShowConversion(false);
    setUserAnswer("");
    setAnswerFeedback("");
  };

  const handleSubmitAnswer = () => {
    const correctAnswer = 36.04; // 2 mol × 18.02 g/mol
    const userValue = parseFloat(userAnswer);
    if (Math.abs(userValue - correctAnswer) < 0.1) {
      setAnswerFeedback("correct");
      setTimeout(() => {
        setAnswerFeedback("");
        onComplete?.();
      }, 1500);
    } else {
      setAnswerFeedback("wrong");
      setTimeout(() => setAnswerFeedback(""), 1000);
    }
  };

  const totalMass = droppedTiles.reduce((sum, t) => sum + t.mass, 0).toFixed(2);

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="lesson-mtg-step mtg-challenge-wrapper">
        <div className="mtg-builder">
          <h2>Challenge 1: Water (H₂O)</h2>
          <p>Drag 2 H tiles and 1 O tile into the beaker to form water.</p>

          {/* Tile Bin */}
          <div className="element-bin">
            <h4>Available Elements</h4>
            <div className="elements-container">
              {TILE_DATA.map((tile) => (
                <DraggableTile key={tile.id} tile={tile} />
              ))}
            </div>
          </div>

          {/* Beaker + Total Mass Display */}
          <div className="mtg-beaker-section">
            <Beaker id="beaker" feedback={feedback}>
              {droppedTiles.map((tile, i) => (
                <div key={i} className="element-tile in-beaker">
                  {tile.label}
                </div>
              ))}
            </Beaker>

            <div className="mass-display">
              <h4>Total Mass</h4>
              <div className="mass-value">{totalMass} g/mol</div>
            </div>
          </div>

          {/* Buttons */}
          <div className="button-group">
            <button onClick={handleCheck} className="check-btn">
              Check Molar Mass
            </button>
            <button onClick={handleClear} className="clear-btn">
              Clear Beaker
            </button>
          </div>

          {/* Conversion Section */}
          {showConversion && (
            <div className="conversion-section slide-in">
              <h3>Now convert moles → grams!</h3>
              <p>
                H₂O has a molar mass of <b>18.02 g/mol</b>.
              </p>
              <p>
                If you have <b>2 moles</b> of water, how many grams is that?
              </p>

              <div className="conversion-input">
                <input
                  type="number"
                  value={userAnswer}
                  onChange={(e) => setUserAnswer(e.target.value)}
                  placeholder="Enter grams"
                  className={`answer-input ${answerFeedback}`}
                />
                <button onClick={handleSubmitAnswer} className="check-btn">
                  Submit
                </button>
              </div>

              {answerFeedback === "correct" && (
                <p className="feedback-text correct">
                  ✅ Correct! 2 mol × 18.02 g/mol = 36.04 g
                </p>
              )}
              {answerFeedback === "wrong" && (
                <p className="feedback-text wrong">
                  ❌ Not quite — try again!
                </p>
              )}
            </div>
          )}
        </div>
      </div>

      <DragOverlay>
        {activeId && (
          <div className="tile dragging">
            {TILE_DATA.find((t) => t.id === activeId)?.label}
          </div>
        )}
      </DragOverlay>
    </DndContext>
  );
}

function DraggableTile({ tile }) {
  const { attributes, listeners, setNodeRef } = useDraggable({ id: tile.id });
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} className="element-tile">
      {tile.label}
    </div>
  );
}

function Beaker({ id, children, feedback }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  const [reacting, setReacting] = useState(false);

  React.useEffect(() => {
    if (children && children.length > 0 && feedback === "") {
      setReacting(true);
      const timer = setTimeout(() => setReacting(false), 800);
      return () => clearTimeout(timer);
    }
  }, [children, feedback]);

  return (
    <div
      ref={setNodeRef}
      className={`beaker-zone ${isOver ? "hovering" : ""} ${
        feedback === "correct"
          ? "beaker-correct"
          : feedback === "wrong"
          ? "beaker-wrong"
          : reacting
          ? "reacting"
          : ""
      }`}
    >
      {children}
    </div>
  );
}
