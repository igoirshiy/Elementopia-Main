import React, { useState, useEffect } from "react";
import {
  DndContext,
  useDroppable,
  useDraggable,
  DragOverlay,
} from "@dnd-kit/core";
import "../../assets/css/ChallengeOne.css";

export default function IonicChallenge2({ onComplete }) {
  const [challenge, setChallenge] = useState(1);
  const [items, setItems] = useState({});
  const [activeId, setActiveId] = useState(null);
  const [status, setStatus] = useState("pending");
  const [bondFormed, setBondFormed] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  // 🧩 SCIENTIFICALLY ACCURATE Challenge data
  const challenges = [
    {
      id: 1,
      title: "Potassium Fluoride (KF)",
      atom1: "potassium",
      atom2: "fluorine",
      atom1Start: 19,
      atom2Start: 9,
      atom1Target: 18,
      atom2Target: 10,
      targetTransfer: 1,
      message: "✅ Great! K⁺ and F⁻ form Potassium Fluoride!",
    },
    {
      id: 2,
      title: "Calcium Chloride (CaCl₂)",
      atom1: "calcium",
      atom2: "chlorine",
      atom1Start: 20,
      atom2Start: 17,
      atom1Target: 18,
      atom2Target: 18,
      targetTransfer: 2,
      message: "✅ Excellent! Ca²⁺ and 2Cl⁻ form Calcium Chloride!",
    },
    {
      id: 3,
      title: "Aluminum Oxide (Al₂O₃)",
      atom1: "aluminum",
      atom2: "oxy",
      atom1Start: 13,
      atom2Start: 8,
      atom1Target: 10,
      atom2Target: 10,
      targetTransfer: 3,
      message: "✅ Excellent! Al³⁺ and O²⁻ form Aluminum Oxide!",
    },
  ];

  const current = challenges[challenge - 1];

  // 🔁 Reset challenge when changing
  useEffect(() => {
    if (current) resetChallenge(current);
  }, [challenge]);

  const resetChallenge = (data) => {
    const { atom1, atom2, atom1Start, atom2Start } = data;

    const newItems = {
      [atom1]: { type: atom1 },
      [atom2]: { type: atom2 },
    };

    const atom1Extras = Math.floor(Math.random() * 3);
    const atom2Extras = Math.floor(Math.random() * 3);

    const totalAtom1Electrons = atom1Start + atom1Extras;
    const totalAtom2Electrons = atom2Start + atom2Extras;

    for (let i = 1; i <= totalAtom1Electrons; i++) {
      newItems[`e${i}`] = { type: "electron", location: atom1 };
    }

    for (
      let i = totalAtom1Electrons + 1;
      i <= totalAtom1Electrons + totalAtom2Electrons;
      i++
    ) {
      newItems[`e${i}`] = { type: "electron", location: atom2 };
    }

    setItems(newItems);
    setStatus("pending");
    setBondFormed(false);
    setShowCongrats(false);
  };

  // 🧲 Drag logic
  const handleDragStart = (event) => {
    if (items[event.active.id]?.type === "electron") {
      setActiveId(event.active.id);
    }
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
    Object.values(items).filter(
      (item) => item.type === "electron" && item.location === atomId
    ).length;

  // ✅ Check for correct bonding
  const checkBond = () => {
    const atom1Electrons = countElectronsOn(current.atom1);
    const atom2Electrons = countElectronsOn(current.atom2);
    const correct =
      atom1Electrons === current.atom1Target &&
      atom2Electrons === current.atom2Target;

    if (correct) {
      setStatus("correct");
      setBondFormed(true);
      setShowCongrats(true);

      setTimeout(() => {
        if (challenge < challenges.length) {
          setChallenge((prev) => prev + 1);
        } else {
          // ✅ All challenges complete → Notify MapTree
          if (onComplete) {
            console.log("✅ IonicChallenge2 completed, calling onComplete()");
            onComplete();
          }
          setShowCongrats(false);
        }
      }, 2500);
    } else {
      setStatus("incorrect");
      setTimeout(() => setStatus("pending"), 1000);
    }
  };

  if (challenge > challenges.length) {
    return (
      <div className="ionic-lesson-modal ionic-bonding-challenge ionic-completed">
        <h2>🎉 All Challenges Completed!</h2>
        <p>Excellent work forming all ionic bonds!</p>
      </div>
    );
  }

  const atom1ElectronCount = countElectronsOn(current.atom1);
  const atom2ElectronCount = countElectronsOn(current.atom2);

  const instruction =
    challenge === 1
      ? `Drag electrons until Potassium has ${current.atom1Target} and Fluorine has ${current.atom2Target} electrons.`
      : challenge === 2
      ? `Drag electrons until Calcium has ${current.atom1Target} and Chlorine has ${current.atom2Target} electrons.`
      : `Drag electrons until Aluminum has ${current.atom1Target} and Oxygen has ${current.atom2Target} electrons.`;

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="ionic-lesson-modal ionic-bonding-challenge">
        <div className={`ionic-challenge-box ${bondFormed ? "ionic-bonded" : ""}`}>
          <h3>
            Challenge {challenge}: {current.title}
          </h3>
          <p>{instruction}</p>

          {/* Electron counters */}
          <div className="ionic-electron-counters">
            <div className="ionic-counter">
              {getSymbol(current.atom1)}: {atom1ElectronCount} electrons
            </div>
            <div className="ionic-counter">
              {getSymbol(current.atom2)}: {atom2ElectronCount} electrons
            </div>
          </div>

          {showCongrats && (
            <div className="ionic-congrats-banner">🎉 {current.message}</div>
          )}

          <div className={`ionic-workspace ${bondFormed ? "ionic-bonded" : ""}`}>
            <DropZone
              id={current.atom1}
              className={`ionic-atom ionic-left-atom ionic-${current.atom1} ${
                bondFormed ? "ionic-final-state" : ""
              }`}
            >
              <div className="ionic-atom-symbol">{getSymbol(current.atom1)}</div>
              {renderElectronsOn(current.atom1, items, activeId)}
            </DropZone>

            <DropZone
              id={current.atom2}
              className={`ionic-atom ionic-right-atom ionic-${current.atom2} ${
                bondFormed ? "ionic-final-state ionic-opposite" : ""
              }`}
            >
              <div className="ionic-atom-symbol">{getSymbol(current.atom2)}</div>
              {renderElectronsOn(current.atom2, items, activeId)}
            </DropZone>

            <TrashBin />
          </div>

          {status === "correct" ? (
            <div className="ionic-success-message">{current.message}</div>
          ) : (
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
          )}
        </div>
      </div>

      <DragOverlay>
        {activeId ? <div className="ionic-electron ionic-is-dragging"></div> : null}
      </DragOverlay>
    </DndContext>
  );
}

/* --- Drop Zone --- */
function DropZone({ id, children, className }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div ref={setNodeRef} className={`${className} ${isOver ? "ionic-hovering" : ""}`}>
      {children}
    </div>
  );
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
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="ionic-electron"
      style={style}
    />
  );
}

/* --- Helpers --- */
function renderElectronsOn(atomId, items, activeId) {
  const electrons = Object.entries(items).filter(
    ([, item]) => item.type === "electron" && item.location === atomId
  );
  const total = electrons.length;
  return electrons.map(([id], i) => {
    const angle = total > 0 ? (i / total) * 360 : 0;
    return <Electron key={id} id={id} angle={angle} isHidden={id === activeId} />;
  });
}

function getSymbol(atom) {
  const map = {
    potassium: "K",
    fluorine: "F",
    calcium: "Ca",
    chlorine: "Cl",
    aluminum: "Al",
    oxy: "O",
  };
  return map[atom] || atom.charAt(0).toUpperCase();
}