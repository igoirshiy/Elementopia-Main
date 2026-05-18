import React, { useState, useEffect } from "react";
import {
  DndContext,
  useDroppable,
  useDraggable,
  DragOverlay,
} from "@dnd-kit/core";
import "../../assets/css/ChallengeOne.css";

export default function ChallengeOne({ onComplete }) {
  const [challenge, setChallenge] = useState(1);
  const [items, setItems] = useState({});
  const [activeId, setActiveId] = useState(null);
  const [status, setStatus] = useState("pending");
  const [bondFormed, setBondFormed] = useState(false);
  const [showCongrats, setShowCongrats] = useState(false);

  useEffect(() => {
    resetChallenge(challenge);
  }, [challenge]);

  const handleDragStart = (event) => {
    if (items[event.active.id]?.type === "electron")
      setActiveId(event.active.id);
  };

  const handleDragEnd = (event) => {
    const { active, over } = event;
    setActiveId(null);
    
    if (!over || !items[active.id]) return;
    
    // If dropped in trash bin, remove the electron
    if (over.id === "trash") {
      setItems((prev) => {
        const newItems = { ...prev };
        delete newItems[active.id];
        return newItems;
      });
    } else {
      // Otherwise, move electron to the new location
      setItems((prev) => ({
        ...prev,
        [active.id]: { ...prev[active.id], location: over.id },
      }));
    }
  };

  // --- Count electrons on specific atom ---
  const countElectronsOn = (atomId) =>
    Object.values(items).filter(
      (item) => item.type === "electron" && item.location === atomId
    ).length;

  // --- SCIENTIFICALLY ACCURATE bond checks ---
  const checkNaCl = () => {
    const naElectrons = countElectronsOn("na");
    const clElectrons = countElectronsOn("cl");
    // Na should lose 1 electron (have 10 total), Cl should gain 1 (have 18 total)
    return naElectrons === 10 && clElectrons === 18;
  };

  const checkMgCl2 = () => {
    const mgElectrons = countElectronsOn("mg");
    const clElectrons = countElectronsOn("cl");
    // Mg should lose 2 electrons (have 10 total), each Cl should gain 1 (have 18 each)
    return mgElectrons === 10 && clElectrons === 18;
  };

  const checkCaO = () => {
    const caElectrons = countElectronsOn("ca");
    const oElectrons = countElectronsOn("o");
    // Ca should lose 2 electrons (have 18 total), O should gain 2 (have 10 total)
    return caElectrons === 18 && oElectrons === 10;
  };

  const checkBond = () => {
    let correct = false;
    if (challenge === 1) correct = checkNaCl();
    else if (challenge === 2) correct = checkMgCl2();
    else if (challenge === 3) correct = checkCaO();

    if (correct) {
      setStatus("correct");
      setBondFormed(true);
      setShowCongrats(true);

      setTimeout(() => {
        if (challenge < 3) {
          setChallenge((prev) => prev + 1);
        } else {
          if (onComplete) onComplete();
        }
      }, 2500);
    } else {
      setStatus("incorrect");
      setTimeout(() => setStatus("pending"), 1000);
    }
  };

  // --- SCIENTIFICALLY ACCURATE starting electron counts with random extras ---
  const resetChallenge = (num) => {
    let atoms = {};
    let leftId, rightId;
    let leftStartElectrons, rightStartElectrons;

    if (num === 1) {
      // Sodium: 11 electrons total, Chlorine: 17 electrons total
      leftId = "na";
      rightId = "cl";
      leftStartElectrons = 11;
      rightStartElectrons = 17;
      atoms = {
        [leftId]: { type: "sodium" },
        [rightId]: { type: "chlorine" },
      };
    } else if (num === 2) {
      // Magnesium: 12 electrons total, Chlorine: 17 electrons total
      leftId = "mg";
      rightId = "cl";
      leftStartElectrons = 12;
      rightStartElectrons = 17;
      atoms = {
        [leftId]: { type: "magnesium" },
        [rightId]: { type: "chlorine" },
      };
    } else {
      // Calcium: 20 electrons total, Oxygen: 8 electrons total
      leftId = "ca";
      rightId = "o";
      leftStartElectrons = 20;
      rightStartElectrons = 8;
      atoms = {
        [leftId]: { type: "calcium" },
        [rightId]: { type: "oxy" },
      };
    }

    const newElectrons = {};

    // 🎲 Add correct starting electrons PLUS random extras for challenge
    // Left atom: correct count + 0-2 random extra electrons
    const leftExtras = Math.floor(Math.random() * 3);
    const totalLeftElectrons = leftStartElectrons + leftExtras;
    
    for (let i = 1; i <= totalLeftElectrons; i++) {
      newElectrons[`e${i}`] = { type: "electron", location: leftId };
    }

    // Right atom: correct count + 0-2 random extra electrons
    const rightExtras = Math.floor(Math.random() * 3);
    const totalRightElectrons = rightStartElectrons + rightExtras;
    
    for (let i = totalLeftElectrons + 1; i <= totalLeftElectrons + totalRightElectrons; i++) {
      newElectrons[`e${i}`] = { type: "electron", location: rightId };
    }

    setItems({ ...atoms, ...newElectrons });
    setStatus("pending");
    setBondFormed(false);
    setShowCongrats(false);
  };

  // --- Dynamic labels with SCIENTIFICALLY ACCURATE instructions ---
  const atomLeft = challenge === 1 ? "na" : challenge === 2 ? "mg" : "ca";
  const atomRight = challenge === 1 ? "cl" : challenge === 2 ? "cl" : "o";
  const symbolLeft = challenge === 1 ? "Na" : challenge === 2 ? "Mg" : "Ca";
  const symbolRight = challenge === 1 ? "Cl" : challenge === 2 ? "Cl" : "O";

  const title =
    challenge === 1
      ? "Challenge 1: Form Sodium Chloride (NaCl)"
      : challenge === 2
        ? "Challenge 2: Form Magnesium Chloride (MgCl₂)"
        : "Challenge 3: Form Calcium Oxide (CaO)";

  const instruction =
    challenge === 1
      ? "Drag electrons until Sodium has 10 and Chlorine has 18 electrons. Remove excess electrons in the trash."
      : challenge === 2
        ? "Drag electrons until Magnesium has 10 and Chlorine has 18 electrons. Remove excess electrons in the trash."
        : "Drag electrons until Calcium has 18 and Oxygen has 10 electrons. Remove excess electrons in the trash.";

  // Calculate current electron counts for display
  const leftElectronCount = countElectronsOn(atomLeft);
  const rightElectronCount = countElectronsOn(atomRight);

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="ionic-lesson-modal ionic-bonding-challenge">
        <div className="ionic-challenge-box">
          <h3>{title}</h3>
          <p>{instruction}</p>

          {/* Electron counters */}
          <div className="ionic-electron-counters">
            <div className="ionic-counter">
              {symbolLeft}: {leftElectronCount} electrons
            </div>
            <div className="ionic-counter">
              {symbolRight}: {rightElectronCount} electrons
            </div>
          </div>

          {showCongrats && (
            <div className="ionic-congrats-banner">
              🎉 Congratulations! You formed the correct ionic bond!
            </div>
          )}

          <div className={`ionic-workspace ${bondFormed ? "ionic-bonded" : ""}`}>
            <DropZone
              id={atomLeft}
              className={`ionic-atom ionic-left-atom ionic-${items[atomLeft]?.type} ${bondFormed ? "ionic-final-state" : ""
                }`}
            >
              <span className="ionic-atom-symbol">{symbolLeft}</span>
              {renderElectronsOn(atomLeft, items, activeId)}
            </DropZone>

            <DropZone
              id={atomRight}
              className={`ionic-atom ionic-right-atom ionic-${items[atomRight]?.type} ${bondFormed ? "ionic-final-state ionic-opposite" : ""
                }`}
            >
              <span className="ionic-atom-symbol">{symbolRight}</span>
              {renderElectronsOn(atomRight, items, activeId)}
            </DropZone>

            {/* Trash Bin for excess electrons */}
            <TrashBin />
          </div>

          <div className="ionic-button-group">
            <button
              onClick={() => resetChallenge(challenge)}
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

/* --- Trash Bin Component --- */
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
    ></div>
  );
}

/* --- Helper --- */
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