import React, { useState } from 'react';
import { DndContext, DragOverlay, useDraggable, useDroppable } from '@dnd-kit/core';
// Import the separated stylesheet
import '../../assets/css/CovalentBondingChallenge.css';

// --- Main Component ---
export default function CovalentChallenge1({ onComplete }) {
    // The "Supply Shelf" has one of each 'type'
    const [supplyShelf] = useState({
        h1: { type: 'hydrogen', location: 'bin' },
        c1: { type: 'carbon', location: 'bin' },
        n1: { type: 'nitrogen', location: 'bin' },
        o1: { type: 'oxygen', location: 'bin' },
        na1: { type: 'sodium', location: 'bin' },
        cl1: { type: 'chlorine', location: 'bin' },
    });
    
    // This state holds the atoms the user has *built*
    const [workspaceAtoms, setWorkspaceAtoms] = useState({});
    const [challengeStatus, setChallengeStatus] = useState('pending');
    const [activeId, setActiveId] = useState(null);

    function handleDragStart(event) { setActiveId(event.active.id); }

    function handleDragEnd(event) {
        const { over, active } = event;
        setActiveId(null);
        if (!over) return;

        const activeAtomType = supplyShelf[active.id]?.type || workspaceAtoms[active.id]?.type;
        
        // --- Dragging from the SHELF (bin) to the workspace ---
        if (over.id === 'workspace' && supplyShelf[active.id]) {
            const newAtomId = `${activeAtomType}-${Date.now()}`; // Create a unique new atom
            setWorkspaceAtoms(prev => ({
                ...prev,
                [newAtomId]: { type: activeAtomType, location: 'workspace' }
            }));
        }
        
        // --- Dragging from the WORKSPACE back to the shelf (bin) ---
        // This *destroys* the atom
        if (over.id === 'bin' && workspaceAtoms[active.id]) {
            setWorkspaceAtoms(prev => {
                const newAtoms = { ...prev };
                delete newAtoms[active.id]; // Destroy the atom
                return newAtoms;
            });
        }
    }

    function checkChallenge() {
        const atomsInWorkspace = Object.values(workspaceAtoms);
        const nitrogenCount = atomsInWorkspace.filter(a => a.type === 'nitrogen').length;
        const hydrogenCount = atomsInWorkspace.filter(a => a.type === 'hydrogen').length;
        const totalCount = atomsInWorkspace.length;

        // The test: 1 Nitrogen, 3 Hydrogens, and NOTHING else.
        if (nitrogenCount === 1 && hydrogenCount === 3 && totalCount === 4) {
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
                <InfoBox title="Challenge 1: The Alchemist's Order" description="An order just came in for a batch of **Ammonia**. Grab the correct atoms from the supply shelf to build the molecule." />
                <h2>NH<sub>3</sub></h2>
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
                            <p>Perfect! That's Ammonia (NH₃)! 💨</p>
                            <button onClick={onComplete} className="complete-btn">Complete Challenge</button>
                        </div>
                    )}
                </div>
            </div>
            
            {/* The DragOverlay clones the atom being dragged */}
            <DragOverlay>
                {activeId && dragOverlayAtom ? (
                    <DraggableAtom 
                        id="overlay" 
                        type={activeAtomType} 
                        // This class will be used to style the dragged atom
                        className="atom-drag-overlay" 
                    />
                ) : null}
            </DragOverlay>
        </DndContext>
    );
}

// --- Reusable Components (Self-Contained) ---

function InfoBox({ title, description }) {
    return (<div className="info-box"><h3>{title}</h3><p>{description}</p></div>);
}

function DraggableAtom({ id, type, isHidden = false, className = '' }) { // <-- Accept className prop
    const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });
    
    const style = {
        transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
        visibility: isHidden ? 'hidden' : 'visible',
    };

    // --- FIXED LABEL LOGIC ---
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
        // Append the extra className here
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