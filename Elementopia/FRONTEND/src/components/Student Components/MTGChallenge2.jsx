import React, { useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
import "../../assets/css/MolesToGramsChallenge.css";

const TILE_DATA = [
  { id: "H", label: "H", mass: 1.01 },
  { id: "O", label: "O", mass: 16.0 },
  { id: "C", label: "C", mass: 12.01 },
  { id: "Na", label: "Na", mass: 22.99 },
  { id: "Cl", label: "Cl", mass: 35.45 },
];

// Two sequential challenges
const PROBLEMS = [
  {
    title: "Challenge 2-1: Carbon Dioxide (CO₂)",
    instruction: (
      <>
        Drag <b>1 C</b> tile and <b>2 O</b> tiles into the beaker to form
        carbon dioxide.
      </>
    ),
    check: (tiles) => {
      const cCount = tiles.filter((t) => t.id === "C").length;
      const oCount = tiles.filter((t) => t.id === "O").length;
      const totalMass = tiles.reduce((sum, t) => sum + t.mass, 0);
      const target = 44.01; // g/mol
      return cCount === 1 && oCount === 2 && Math.abs(totalMass - target) < 0.05;
    },
    molarMass: 44.01,
    moles: 2,
  },
  {
    title: "Challenge 2-2: Sodium Chloride (NaCl)",
    instruction: (
      <>
        Drag <b>1 Na</b> tile and <b>1 Cl</b> tile into the beaker to form
        sodium chloride.
      </>
    ),
    check: (tiles) => {
      const naCount = tiles.filter((t) => t.id === "Na").length;
      const clCount = tiles.filter((t) => t.id === "Cl").length;
      const totalMass = tiles.reduce((sum, t) => sum + t.mass, 0);
      const target = 58.44; // g/mol
      return naCount === 1 && clCount === 1 && Math.abs(totalMass - target) < 0.05;
    },
    molarMass: 58.44,
    moles: 3,
  },
];

export default function MolesToGrams2({ onComplete }) {
  const [currentProblem, setCurrentProblem] = useState(0);
  const problem = PROBLEMS[currentProblem];

  const [droppedTiles, setDroppedTiles] = useState([]);
  const [activeId, setActiveId] = useState(null);
  const [feedback, setFeedback] = useState("");
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
    const correct = problem.check(droppedTiles);
    if (correct) {
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
  };

  const handleSubmitAnswer = () => {
    const correctAnswer = problem.moles * problem.molarMass;
    const userValue = parseFloat(userAnswer);
    if (Math.abs(userValue - correctAnswer) < 0.1) {
      setAnswerFeedback("correct");
      setTimeout(() => {
        if (currentProblem < PROBLEMS.length - 1) {
          // Move to next problem
          setDroppedTiles([]);
          setShowConversion(false);
          setUserAnswer("");
          setAnswerFeedback("");
          setCurrentProblem((p) => p + 1);
        } else if (onComplete) {
          onComplete();
        }
      }, 1500);
    } else {
      setAnswerFeedback("wrong");
      setTimeout(() => setAnswerFeedback(""), 1000);
    }
  };

  const totalMass = droppedTiles
    .reduce((sum, t) => sum + t.mass, 0)
    .toFixed(2);

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="lesson-mtg-step mtg-challenge-wrapper">
        <div className="mtg-builder">
          <h2>{problem.title}</h2>
          <p>{problem.instruction}</p>

          <div className="element-bin">
            <h4>Available Elements</h4>
            <div className="elements-container">
              {TILE_DATA.map((tile) => (
                <DraggableTile key={tile.id} tile={tile} />
              ))}
            </div>
          </div>

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

          <div className="button-group">
            <button onClick={handleCheck} className="check-btn">
              Check Molar Mass
            </button>
            <button onClick={handleClear} className="clear-btn">
              Clear Beaker
            </button>
          </div>

          {showConversion && (
            <div className="conversion-section slide-in">
              <h3>Now convert moles → grams!</h3>
              <p>
                {problem.title.split(": ")[1]} has a molar mass of{" "}
                <b>{problem.molarMass} g/mol</b>.
              </p>
              <p>
                If you have <b>{problem.moles} moles</b>, how many grams is that?
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
                  ✅ Correct! {problem.moles} mol × {problem.molarMass} g/mol ={" "}
                  {(problem.moles * problem.molarMass).toFixed(2)} g
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
