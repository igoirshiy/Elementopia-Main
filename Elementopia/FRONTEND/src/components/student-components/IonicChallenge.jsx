import React, { useState } from "react";
import {
  DndContext,
  useDraggable,
  useDroppable,
  DragOverlay,
} from "@dnd-kit/core";
import "../assets/css/ChallengeOne.css";

// --- Electron (draggable) ---
function Electron({ id }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const style = {
    transform: transform
      ? `translate3d(${transform.x}px, ${transform.y}px, 0)`
      : "none",
  };

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className="electron"
      style={style}
    />
  );
}

// --- Atom (droppable) ---
function Atom({ id, electrons }) {
  const { isOver, setNodeRef } = useDroppable({ id });

  return (
    <div ref={setNodeRef} className={`atom ${isOver ? "highlight" : ""}`}>
      <div className="nucleus" />
      <div className="electron-shell">
        {electrons.map((e) => (
          <Electron key={e.id} id={e.id} />
        ))}
      </div>
    </div>
  );
}

// --- Main Challenge Component ---
export default function ChallengeOne() {
  const [atoms] = useState([
    { id: "sodium", electrons: [{ id: "e1" }, { id: "e2" }] },
  ]);
  const [activeId, setActiveId] = useState(null);

  return (
    <div className="lesson-modal ionic-bonding">
      <DndContext onDragStart={(e) => setActiveId(e.active.id)} onDragEnd={() => setActiveId(null)}>
        <div className="workspace">
          {atoms.map((atom) => (
            <Atom key={atom.id} id={atom.id} electrons={atom.electrons} />
          ))}
        </div>

        <DragOverlay>
          {activeId ? <div className="electron overlay" /> : null}
        </DragOverlay>
      </DndContext>
    </div>
  );
}
