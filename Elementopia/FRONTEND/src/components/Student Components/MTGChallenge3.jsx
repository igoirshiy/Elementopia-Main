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
  { id: "Ca", label: "Ca", mass: 40.08 },
];

// Three sequential challenges
const PROBLEMS = [
  {
    title: "Challenge 3-1: Water (H₂O)",
    instruction: (
      <>
        Drag <b>2 H</b> tiles and <b>1 O</b> tile into the beaker to form water.
      </>
    ),
    check: (tiles) => {
      const hCount = tiles.filter((t) => t.id === "H").length;
      const oCount = tiles.filter((t) => t.id === "O").length;
      const totalMass = tiles.reduce((sum, t) => sum + t.mass, 0);
      const target = 18.02; // g/mol
      return hCount === 2 && oCount === 1 && Math.abs(totalMass - target) < 0.05;
    },
    molarMass: 18.02,
    moles: 4,
  },
  {
    title: "Challenge 3-2: Methane (CH₄)",
    instruction: (
      <>
        Drag <b>1 C</b> tile and <b>4 H</b> tiles into the beaker to form methane.
      </>
    ),
    check: (tiles) => {
      const cCount = tiles.filter((t) => t.id === "C").length;
      const hCount = tiles.filter((t) => t.id === "H").length;
      const totalMass = tiles.reduce((sum, t) => sum + t.mass, 0);
      const target = 16.05; // g/mol
      return cCount === 1 && hCount === 4 && Math.abs(totalMass - target) < 0.05;
    },
    molarMass: 16.05,
    moles: 3,
  },
  {
    title: "Challenge 3-3: Calcium Carbonate (CaCO₃)",
    instruction: (
      <>
        Drag <b>1 Ca</b> tile, <b>1 C</b> tile, and <b>3 O</b> tiles into the
        beaker to form calcium carbonate.
      </>
    ),
    check: (tiles) => {
      const caCount = tiles.filter((t) => t.id === "Ca").length;
      const cCount = tiles.filter((t) => t.id === "C").length;
      const oCount = tiles.filter((t) => t.id === "O").length;
      const totalMass = tiles.reduce((sum, t) => sum + t.mass, 0);
      const target = 100.09; // g/mol
      return (
        caCount === 1 &&
        cCount === 1 &&
        oCount === 3 &&
        Math.abs(totalMass - target) < 0.1
      );
    },
    molarMass: 100.09,
    moles: 2,
  },
];

export default function MolesToGrams3({ onComplete }) {
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
          // Go to next problem
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
