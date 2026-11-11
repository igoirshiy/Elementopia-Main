import React, { useState, useEffect } from "react";
import { CheckCircle2, AlertTriangle } from "lucide-react";
import {
  DndContext,
  useDroppable,
  useDraggable,
  DragOverlay,
} from "@dnd-kit/core";
import '@/assets/styles/legacy/AtomChallenge.css';

// --- Close Button Component ---
function CloseButton({ onClose }) {
  return (
    <button className="close-btn" onClick={onClose} aria-label="Close">
      <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
        <path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/>
      </svg>
    </button>
  );
}

// --- Draggable Particle ---
function DraggableParticle({ id, type, isHidden, location, index, total }) {
  const { attributes, listeners, setNodeRef, transform } = useDraggable({ id });

  const particleStyle = {
    visibility: isHidden ? "hidden" : "visible",
    position: "relative",
    transition: "all 0.3s cubic-bezier(0.4, 0, 0.2, 1)",
    transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : undefined,
    zIndex: transform ? 1000 : "auto",
  };

  // Position electrons in orbit when in shell
  if (location === "shell" && type === "electron" && index !== undefined && total !== undefined) {
    const angle = (index / total) * 360;
    const radius = window.innerWidth < 768 ? 80 : 100;
    const x = radius * Math.cos((angle * Math.PI) / 180);
    const y = radius * Math.sin((angle * Math.PI) / 180);

    Object.assign(particleStyle, {
      position: "absolute",
      top: `calc(50% + ${y}px - 12px)`,
      left: `calc(50% + ${x}px - 12px)`,
      transform: transform ? `translate3d(${transform.x}px, ${transform.y}px, 0)` : "none",
    });
  }

  return (
    <div
      ref={setNodeRef}
      {...listeners}
      {...attributes}
      className={`particle ${type} ${location} ${isHidden ? 'hidden' : ''}`}
      style={particleStyle}
      data-type={type}
    >
      <div className="particle-inner">
        <div className="particle-glow"></div>
      </div>
    </div>
  );
}

// --- Drop Zone ---
function DropZone({ id, children, className }) {
  const { setNodeRef, isOver } = useDroppable({ id });
  return (
    <div 
      ref={setNodeRef} 
      className={`${className} ${isOver ? "hovering" : ""} drop-zone`}
      data-zone={id}
    >
      {children}
    </div>
  );
}

// --- Combined Nucleus Display ---
function CombinedNucleusDisplay({ protons, neutrons }) {
  const protonOrbs = [];
  const neutronOrbs = [];
  
  let remainingProtons = protons;
  while (remainingProtons > 0) {
    const groupCount = Math.min(remainingProtons, 10);
    protonOrbs.push(groupCount);
    remainingProtons -= groupCount;
  }
  
  let remainingNeutrons = neutrons;
  while (remainingNeutrons > 0) {
    const groupCount = Math.min(remainingNeutrons, 10);
    neutronOrbs.push(groupCount);
    remainingNeutrons -= groupCount;
  }

  return (
    <div className="combined-nucleus">
      <div className="nucleus-orbs-container">
        {protonOrbs.length > 0 && (
          <div className="proton-orbs-group">
            {protonOrbs.map((count, index) => (
              <div
                key={`proton-${index}`}
                className="particle-orb proton-orb"
                style={{ '--particle-count': count }}
              >
                <div className="orb-glow"></div>
                <div className="orb-content">
                  <div className="orb-count">{count}</div>
                  <div className="orb-label">p</div>
                </div>
              </div>
            ))}
          </div>
        )}
        
        {neutronOrbs.length > 0 && (
          <div className="neutron-orbs-group">
            {neutronOrbs.map((count, index) => (
              <div
                key={`neutron-${index}`}
                className="particle-orb neutron-orb"
                style={{ '--particle-count': count }}
              >
                <div className="orb-glow"></div>
                <div className="orb-content">
                  <div className="orb-count">{count}</div>
                  <div className="orb-label">n</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Particle Controls ---
function ParticleControl({ type, current, max, onUpdate }) {
  const particleConfig = {
    proton: { color: '#FF6B6B', label: 'Protons', icon: '⚛️' },
    neutron: { color: '#BDC3C7', label: 'Neutrons', icon: '⚪' },
    electron: { color: '#3498DB', label: 'Electrons', icon: '⚡' }
  };

  const config = particleConfig[type];

  return (
    <div className="control-group" data-type={type}>
      <div className="control-header">
        <span className="control-icon">{config.icon}</span>
        <span className="control-label">{config.label}</span>
        <span className="particle-count-display">{current}</span>
      </div>
      <div className="control-buttons">
        <button 
          className="control-btn decrease"
          onClick={() => onUpdate(-1)}
          disabled={current === 0}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13H5v-2h14v2z"/>
          </svg>
        </button>
        <button 
          className="control-btn increase"
          onClick={() => onUpdate(1)}
          disabled={current === max}
        >
          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor">
            <path d="M19 13h-6v6h-2v-6H5v-2h6V5h2v6h6v2z"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

// --- Main Challenge Component ---
export default function AtomChallengeCore({ challenge, onChallengeComplete }) {
  const [particles, setParticles] = useState({});
  const [activeId, setActiveId] = useState(null);
  const [particleCounts, setParticleCounts] = useState({
    protons: 0,
    neutrons: 0,
    electrons: 0
  });
  const [feedbackModal, setFeedbackModal] = useState(null);

  useEffect(() => {
    const generatedParticles = {};
    let id = 1;

    const poolSize = Math.max(challenge.protons, challenge.neutrons, challenge.electrons) + 5;
    
    for (let i = 0; i < poolSize; i++) {
      generatedParticles[`p${id}`] = { type: "proton", location: "bin" };
      id++;
      generatedParticles[`n${id}`] = { type: "neutron", location: "bin" };
      id++;
      generatedParticles[`e${id}`] = { type: "electron", location: "bin" };
      id++;
    }

    setParticles(generatedParticles);
    setParticleCounts({ protons: 0, neutrons: 0, electrons: 0 });
  }, [challenge]);

  const activeParticleType = activeId ? particles[activeId]?.type : null;

  const handleDragStart = (event) => setActiveId(event.active.id);

  const handleDragEnd = (event) => {
    const { over, active } = event;
    setActiveId(null);
    if (!over) return;

    setParticles((prev) => ({
      ...prev,
      [active.id]: { ...prev[active.id], location: over.id },
    }));
  };

  const updateParticleCount = (type, change) => {
    setParticleCounts(prev => {
      const newCount = prev[type] + change;
      const maxAllowed = type === 'protons' ? challenge.protons :
                        type === 'neutrons' ? challenge.neutrons :
                        challenge.electrons;
      
      if (newCount >= 0 && newCount <= maxAllowed) {
        return { ...prev, [type]: newCount };
      }
      return prev;
    });
  };

  const getVisualParticles = () => {
    const visualParticles = {};
    let id = 1;

    for (let i = 0; i < particleCounts.protons; i++) {
      visualParticles[`visual-p${id}`] = { type: "proton", location: "nucleus" };
      id++;
    }

    for (let i = 0; i < particleCounts.neutrons; i++) {
      visualParticles[`visual-n${id}`] = { type: "neutron", location: "nucleus" };
      id++;
    }

    for (let i = 0; i < particleCounts.electrons; i++) {
      visualParticles[`visual-e${id}`] = { type: "electron", location: "shell" };
      id++;
    }

    return visualParticles;
  };

  const handleCheck = () => {
    const correct = particleCounts.protons === challenge.protons &&
                   particleCounts.neutrons === challenge.neutrons &&
                   particleCounts.electrons === challenge.electrons;

    if (correct) {
      setFeedbackModal({
        success: true,
        title: "Structure Verified!",
        message: `Excellent synthesis! You successfully constructed ${challenge.name} with stable subatomic orbital equilibrium.`
      });
    } else {
      setFeedbackModal({
        success: false,
        title: "Configuration Mismatch",
        message: "The subatomic particle configuration does not match the target element's atomic structure. Verify proton, neutron, and electron counts and try again!"
      });
    }
  };

  const renderParticlesIn = (location) => {
    const visualParticles = getVisualParticles();
    const particlesInLocation = Object.entries(visualParticles).filter(
      ([, p]) => p.location === location
    );

    if (location === "nucleus" && particlesInLocation.length > 3) {
      const protons = particlesInLocation.filter(([, p]) => p.type === "proton").length;
      const neutrons = particlesInLocation.filter(([, p]) => p.type === "neutron").length;
      return <CombinedNucleusDisplay protons={protons} neutrons={neutrons} />;
    }

    return particlesInLocation.map(([id, p], index) => (
      <DraggableParticle
        key={id}
        id={id}
        type={p.type}
        location={location}
        isHidden={id === activeId}
        index={location === "shell" ? index : undefined}
        total={location === "shell" ? particlesInLocation.length : undefined}
      />
    ));
  };

  const totalNucleusParticles = particleCounts.protons + particleCounts.neutrons;
  const isComplete = particleCounts.protons === challenge.protons &&
                    particleCounts.neutrons === challenge.neutrons &&
                    particleCounts.electrons === challenge.electrons;

  return (
    <DndContext onDragStart={handleDragStart} onDragEnd={handleDragEnd}>
      <div className="atom-challenge-wrapper">
        <div className="atom-builder">
          
          <div className="challenge-header">
            <h2>Build {challenge.name}</h2>
            <div className="element-info">
              <span className="atomic-number">Atomic #: {challenge.protons}</span>
              <span className="mass-number">Mass: {challenge.protons + challenge.neutrons}</span>
            </div>
          </div>

          <div className="atom-diagram-container">
            <div className="atom-diagram">
              <div className="electron-shell-shell">
                <div className="orbit-ring"></div>
                <div className="orbit-ring orbit-ring-2"></div>
              </div>
              <DropZone id="shell" className="electron-shell">
                {renderParticlesIn("shell")}
                {particleCounts.electrons === 0 && (
                  <div className="empty-hint">
                    <span>⚡</span>
                    <p>Electrons</p>
                  </div>
                )}
              </DropZone>
              
              <DropZone id="nucleus" className="nucleus">
                {renderParticlesIn("nucleus")}
                {totalNucleusParticles === 0 && (
                  <div className="empty-hint">
                    <span>⚛️</span>
                    <p>Nucleus</p>
                  </div>
                )}
              </DropZone>
            </div>
          </div>

          <div className="particle-controls-container">
            <div className="particle-controls">
              <ParticleControl
                type="proton"
                current={particleCounts.protons}
                max={challenge.protons}
                onUpdate={(change) => updateParticleCount('protons', change)}
              />
              <ParticleControl
                type="neutron"
                current={particleCounts.neutrons}
                max={challenge.neutrons}
                onUpdate={(change) => updateParticleCount('neutrons', change)}
              />
              <ParticleControl
                type="electron"
                current={particleCounts.electrons}
                max={challenge.electrons}
                onUpdate={(change) => updateParticleCount('electrons', change)}
              />
            </div>
          </div>

          <div className="controls-area">
            <button 
              onClick={handleCheck} 
              className={`complete-btn ${isComplete ? 'pulse' : ''}`}
            >
              <span className="btn-icon">🔬</span>
              Check Atom
            </button>
          </div>
        </div>
      </div>

      <DragOverlay>
        {activeId && (
          <div className={`particle ${activeParticleType} dragging-overlay`}>
            <div className="particle-inner">
              <div className="particle-glow"></div>
            </div>
          </div>
        )}
      </DragOverlay>

      {/* In-Platform Feedback Modal */}
      {feedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
          <div className={`max-w-md w-full rounded-3xl border ${feedbackModal.success ? 'border-cyan-500/50 shadow-[0_0_50px_rgba(6,182,212,0.3)]' : 'border-rose-500/50 shadow-[0_0_50px_rgba(244,63,94,0.3)]'} bg-slate-950 p-6 sm:p-8 text-center relative`}>
            <div className={`w-16 h-16 rounded-full ${feedbackModal.success ? 'bg-cyan-500/20 border-cyan-400 text-cyan-400' : 'bg-rose-500/20 border-rose-500 text-rose-500'} border-2 flex items-center justify-center mx-auto mb-4`}>
              {feedbackModal.success ? (
                <CheckCircle2 className="w-8 h-8 animate-bounce" />
              ) : (
                <AlertTriangle className="w-8 h-8 animate-pulse" />
              )}
            </div>
            <h3 className={`font-pixel text-xl sm:text-2xl font-bold mb-2 ${feedbackModal.success ? 'text-cyan-400' : 'text-rose-400'}`}>
              {feedbackModal.title}
            </h3>
            <p className="text-sm text-slate-300 font-sans leading-relaxed mb-6">
              {feedbackModal.message}
            </p>
            <button
              type="button"
              onClick={() => {
                const wasSuccess = feedbackModal.success;
                setFeedbackModal(null);
                if (wasSuccess) onChallengeComplete();
              }}
              className={`rounded-full px-8 py-2.5 font-mono font-bold text-xs uppercase tracking-wider text-white transition hover:scale-105 cursor-pointer ${feedbackModal.success ? 'bg-gradient-to-r from-teal-500 to-cyan-500 shadow-[0_0_20px_rgba(6,182,212,0.4)]' : 'bg-gradient-to-r from-rose-600 to-red-500 shadow-[0_0_20px_rgba(244,63,94,0.4)]'}`}
            >
              {feedbackModal.success ? 'Continue' : 'Adjust Configuration'}
            </button>
          </div>
        </div>
      )}
    </DndContext>
  );
}