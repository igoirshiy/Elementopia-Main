import React, { useState, useEffect } from "react";
import { DndContext, useDroppable, useDraggable, DragOverlay } from "@dnd-kit/core";
import "../../assets/css/ChallengeOne.css";

export default function IonicChallenge3({ onComplete }) {
  const [challenge, setChallenge] = useState(1);
  const [items, setItems] = useState({});
  const [activeId, setActiveId] = useState(null);
  const [status, setStatus] = useState("pending");
  const [bondFormed, setBondFormed] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  // --- Challenge Data ---
  const challenges = [
    {
      id: 1,
      title: "Sodium Fluoride (NaF)",
      atom1: "sodium",
      atom2: "fluorine",
      symbol1: "Na",
      symbol2: "F",
      atom1Start: 11,
      atom2Start: 9,
      atom1Target: 10,
      atom2Target: 10,
      targetTransfer: 1,
      message: "✅ Nice! Na⁺ and F⁻ form Sodium Fluoride!",
    },
    {
      id: 2,
      title: "Magnesium Oxide (MgO)",
      atom1: "magnesium",
      atom2: "oxy",
      symbol1: "Mg",
      symbol2: "O",
      atom1Start: 12,
      atom2Start: 8,
      atom1Target: 10,
      atom2Target: 10,
      targetTransfer: 2,
      message: "✅ Excellent! Mg²⁺ and O²⁻ form Magnesium Oxide!",
    },
    {
      id: 3,
      title: "Lithium Chloride (LiCl)",
      atom1: "lithium",
      atom2: "chlorine",
      symbol1: "Li",
      symbol2: "Cl",
      atom1Start: 3,
      atom2Start: 17,
      atom1Target: 2,
      atom2Target: 18,
      targetTransfer: 1,
      message: "✅ Great! Li⁺ and Cl⁻ form Lithium Chloride!",
    },
  ];

  const current = challenges[challenge - 1];

  useEffect(() => {
    if (current) resetChallenge(current);
  }, [challenge]);

  // --- Reset Challenge ---
  const resetChallenge = (data) => {
    const { atom1, atom2, atom1Start, atom2Start } = data;
    const newItems = { [atom1]: { type: atom1 }, [atom2]: { type: atom2 } };

    const atom1Extras = Math.floor(Math.random() * 2);
    const atom2Extras = Math.floor(Math.random() * 2);

    const totalAtom1Electrons = atom1Start + atom1Extras;
    const totalAtom2Electrons = atom2Start + atom2Extras;

    for (let i = 1; i <= totalAtom1Electrons; i++) {
      newItems[`e${i}`] = { type: "electron", location: atom1 };
    }
    for (let i = totalAtom1Electrons + 1; i <= totalAtom1Electrons + totalAtom2Electrons; i++) {
      newItems[`e${i}`] = { type: "electron", location: atom2 };
    }

    setItems(newItems);
    setStatus("pending");
    setBondFormed(false);
    setShowCongrats(false);
  };

  const handleDragStart = (event) => {
    if (items[event.active.id]?.type === "electron") setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    if (!over || !items[active.id]) return;

    if (over.id === "trash") {
      setItems((prev) => {
        const newItems = { ...prev };
        delete newItems[active.id];
        return newItems;
      });
    } else {
      setItems((prev) => ({
        ...prev,
        [active.id]: { ...prev[active.id], location: over.id },
      }));
    }
  };

  const countElectronsOn = (atomId) =>
    Object.values(items).filter((item) => item.type === "electron" && item.location === atomId).length;

  // --- Bond Checking ---
  const checkBond = () => {
    const atom1Electrons = countElectronsOn(current.atom1);
    const atom2Electrons = countElectronsOn(current.atom2);

    const correct = atom1Electrons === current.atom1Target && atom2Electrons === current.atom2Target;

    if (correct) {
      setStatus("correct");
      setBondFormed(true);
      setShowCongrats(true);

      setTimeout(() => {
        if (challenge < challenges.length) {
          setChallenge((prev) => prev + 1);
        } else {
          // ✅ Notify parent (MapTree unlock)
          if (onComplete) onComplete();
        }
      }, 2500);
    } else {
      setStatus("incorrect");
      setTimeout(() => setStatus("pending"), 1000);
    }
  };

  // --- When all challenges done ---
  if (challenge > challenges.length) {
    return (
      <div className="ionic-lesson-modal ionic-bonding-challenge ionic-completed">
        <h2>🎉 All Challenges Completed!</h2>
        <p>Excellent work forming all ionic bonds!</p>
      </div>
    );
  }

  const atom1Count = countElectronsOn(current.atom1);
  const atom2Count = countElectronsOn(current.atom2);

  const instruction = `Drag electrons until ${capitalize(current.atom1)} has ${current.atom1Target} and ${capitalize(
    current.atom2
  )} has ${current.atom2Target} electrons. Remove extras in the trash.`;

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="ionic-lesson-modal ionic-bonding-challenge">
        <div className={`ionic-challenge-box ${bondFormed ? "ionic-bonded" : ""}`}>
          <h3>
            Challenge {challenge}: {current.title}
          </h3>
          <p>{instruction}</p>

          <div className="ionic-electron-counters">
            <div className="ionic-counter">
              {current.symbol1}: {atom1Count} electrons
            </div>
            <div className="ionic-counter">
              {current.symbol2}: {atom2Count} electrons
            </div>
          </div>

          {showCongrats && <div className="ionic-congrats-banner">🎉 {current.message}</div>}

          <div className={`ionic-workspace ${bondFormed ? "ionic-bonded" : ""}`}>
            <DropZone 
              id={current.atom1} 
              className={`ionic-atom ionic-left-atom ionic-${current.atom1} ${bondFormed ? "ionic-final-state" : ""}`}
            >
              <span className="ionic-atom-symbol">{current.symbol1}</span>
              {renderElectronsOn(current.atom1, items, activeId)}
            </DropZone>

            <DropZone 
              id={current.atom2} 
              className={`ionic-atom ionic-right-atom ionic-${current.atom2} ${bondFormed ? "ionic-final-state ionic-opposite" : ""}`}
            >
              <span className="ionic-atom-symbol">{current.symbol2}</span>
              {renderElectronsOn(current.atom2, items, activeId)}
            </DropZone>

            <TrashBin />
          </div>

          <div className="ionic-button-group">
            <button
              onClick={() => resetChallenge(current)}
              className="ionic-reset-btn"
            >
              Reset
            </button>

            <button
              onClick={checkBond}
              className={`ionic-check-btn ionic-${status}`}
            >
              Check
            </button>
          </div>
        </div>
      </div>

      <DragOverlay>{activeId ? <div className="ionic-electron ionic-is-dragging"></div> : null}</DragOverlay>
    </DndContext>
  );
}

/* --- Drop Zone --- */
function DropZone({ id, children, className }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return <div ref={setNodeRef} className={`${className} ${isOver ? "ionic-hovering" : ""}`}>{children}</div>;
}

/* --- Trash Bin --- */
function TrashBin() {
  const { setNodeRef, isOver } = useDroppable({ id: "trash" });
  return (
    <div
      ref={setNodeRef}
      className={`ionic-trash-bin ${isOver ? "ionic-hovering" : ""}`}
    >
      🗑️
    </div>
  );
}

/* --- Electron --- */
function Electron({ id, isHidden, angle }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : `rotate(${angle}deg) translate(55px) rotate(-${angle}deg)`,
    visibility: isHidden ? "hidden" : "visible",
  };
  return (
    <div ref={setNodeRef} {...listeners} {...attributes} className="ionic-electron" style={style} />
  );
}

/* --- Render Electrons Helper --- */
function renderElectronsOn(atomId, items, activeId) {
  const electrons = Object.entries(items).filter(([_, item]) => item.type === "electron" && item.location === atomId);
  const total = electrons.length;
  return electrons.map(([id], i) => {
    const angle = total > 0 ? (i / total) * 360 : 0;
    return <Electron key={id} id={id} angle={angle} isHidden={id === activeId} />;
  });
}

function capitalize(s) {
  return s.charAt(0).toUpperCase() + s.slice(1);
}