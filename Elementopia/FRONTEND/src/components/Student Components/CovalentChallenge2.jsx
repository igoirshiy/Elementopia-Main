import React, { useState } from 'react';
import { DndContext, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';
import '../../assets/css/CovalentBondingChallenge.css'; // Make sure this import is correct

// --- Main Component ---
export default function CovalentChallenge2({ onComplete }) {
    const [supplyShelf] = useState({
        h1: { type: 'hydrogen', location: 'bin' },
        c1: { type: 'carbon', location: 'bin' },
        n1: { type: 'nitrogen', location: 'bin' },
        o1: { type: 'oxygen', location: 'bin' },
        na1: { type: 'sodium', location: 'bin' },
        cl1: { type: 'chlorine', location: 'bin' },
    });
    
    const [workspaceAtoms, setWorkspaceAtoms] = useState({});
    const [challengeStatus, setChallengeStatus] = useState('pending');
    const [activeId, setActiveId] = useState(null);

    function handleDragStart(event) { setActiveId(event.active.id); }

    function handleDragEnd(event) {
        const { over, active } = event;
        setActiveId(null);
        if (!over) return;
        const activeAtomType = supplyShelf[active.id]?.type || workspaceAtoms[active.id]?.type;
        if (over.id === 'workspace' && supplyShelf[active.id]) {
            const newAtomId = `${activeAtomType}-${Date.now()}`;
            setWorkspaceAtoms(prev => ({ ...prev, [newAtomId]: { type: activeAtomType, location: 'workspace' } }));
        }
        if (over.id === 'bin' && workspaceAtoms[active.id]) {
            setWorkspaceAtoms(prev => {
                const newAtoms = { ...prev };
                delete newAtoms[active.id];
                return newAtoms;
            });
        }
    }

    function checkChallenge() {
        const atomsInWorkspace = Object.values(workspaceAtoms);
        const carbonCount = atomsInWorkspace.filter(a => a.type === 'carbon').length;
        const oxygenCount = atomsInWorkspace.filter(a => a.type === 'oxygen').length;
        const totalCount = atomsInWorkspace.length;

        // The test: 1 Carbon, 2 Oxygens, and NOTHING else.
        if (carbonCount === 1 && oxygenCount === 2 && totalCount === 3) {
            setChallengeStatus('correct');
        } else {
            setChallengeStatus('incorrect');
            setTimeout(() => setChallengeStatus('pending'), 1500);
        }
    }

    const renderAtomsIn = (location) => {
        const atomSource = (location === 'bin') ? supplyShelf : workspaceAtoms;
        return Object.entries(atomSource)
            .map(([id, a]) => <DraggableAtom key={id} id={id} type={a.type} isHidden={id === activeId} />);
    };
    
    const activeAtomType = activeId ? (supplyShelf[activeId]?.type || workspaceAtoms[activeId]?.type) : null;
    const dragOverlayAtom = activeId ? (supplyShelf[activeId] || workspaceAtoms[activeId]) : null;

    return (
        <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
            <div className="lesson-modal covalent-challenge">
                <InfoBox title="Challenge 2: The Alchemist's Order" description="This one is for a terraforming colony... they need **Carbon Dioxide**. Get the formula right." />
                <h2>CO<sub>2</sub></h2>
                <DropZone id="workspace" className="workspace challenge-grid">
                    {renderAtomsIn('workspace')}
                </DropZone>
                
                <DropZone id="bin" className="parts-bin alchemist-shelf">
                    <h3>Supply Shelf (Infinite Atoms)</h3>
                    <div className="atoms-container">{renderAtomsIn('bin')}</div>
                </DropZone>

                <div className="controls-area">
                    {challengeStatus !== 'correct' && <button onClick={checkChallenge} className={`check-btn ${challengeStatus}`}>{challengeStatus === 'incorrect' ? 'Try Again!' : 'Check My Molecule'}</button>}
                    {challengeStatus === 'correct' && (
                        <div className="success-message">
                            <p>Correct! You made Carbon Dioxide (CO₂)! 💨</p>
                            <button onClick={onComplete} className="complete-btn">Complete Challenge</button>
                        </div>
                    )}
                </div>
            </div>
            <DragOverlay>
                {activeId && dragOverlayAtom ? (
                    <DraggableAtom 
                        id="overlay" 
                        type={activeAtomType} 
                        className="atom-drag-overlay"
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

// --- Reusable Components ---
function InfoBox({ title, description }) {
    return (<div className="info-box"><h3>{title}</h3><p>{description}</p></div>);
}

function DraggableAtom({ id, type, isHidden = false, className = '' }) {
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        visibility: isHidden ? 'hidden' : 'visible',
    };

    const ELEMENT_LABELS = {
        hydrogen: 'H',
        carbon: 'C',
        nitrogen: 'N',
        oxygen: 'O',
        sodium: 'Na',
        chlorine: 'Cl',
    };
    const label = ELEMENT_LABELS[type] || type.charAt(0).toUpperCase();
    
    return (
        <div ref={setNodeRef} style={style} {...listeners} {...attributes} className={`atom ${type} ${className}`}>
            {label}
        </div>
    );
}

function DropZone({ id, children, className }) {
    const { setNodeRef, isOver } = useDroppable({ id });
    return (
        <div ref={setNodeRef} className={`${className} ${isOver ? 'hovering' : ''}`}>
            {children}
        </div>
    );
}