import React, { useState } from 'react';
import { BohrAtomVisualizer } from './BohrAtomVisualizer';
import { Sparkles, CheckCircle2, ChevronRight, ChevronLeft, Lightbulb, Zap } from 'lucide-react';

export function DoctorAtomTutorialModal({ domainId, currentStage, onClose }) {
  const [step, setStep] = useState(1);

  // Dynamic 3-Step Interactive Bonding Tutorial based on Domain
  const TUTORIAL_STEPS = domainId === "carbon" ? [
    {
      step: 1,
      tag: "👑 Golden Rule of Carbon",
      title: "Carbon ALWAYS Makes 4 Bonds!",
      desc: "Carbon (C) has 4 valence electrons and 4 empty seats. To reach a stable 8-electron octet, Carbon must always form exactly 4 bonds with other atoms!",
      visual: (
        <div className="flex items-center justify-center gap-6 py-2">
          <div className="flex flex-col items-center">
            <BohrAtomVisualizer symbol="C" size="sm" showEmptySeats={true} />
            <span className="text-[10px] font-mono text-amber-300 font-bold mt-1">Carbon (4/8 e⁻)</span>
            <span className="text-[9px] font-mono text-red-400">🔴 4 Empty Seats (Needs 4 bonds)</span>
          </div>
        </div>
      )
    },
    {
      step: 2,
      tag: "🐙 Filling Carbon's 4 Arms",
      title: "Balancing the 4 Slots",
      desc: "• Oxygen (O) fills 2 slots (Double bond)\n• Hydrogen (H) fills 1 slot\n• Nitrogen (N) fills 3 slots (Triple bond)\n• Noble gases (He, Ne) are inert (0 slots)!",
      visual: (
        <div className="flex items-center justify-center gap-2 py-2 bg-slate-900/60 rounded-xl border border-slate-800 p-2">
          <div className="flex items-center gap-1">
            <span className="text-[9px] font-mono text-pink-300 font-bold">O (2)</span>
            <span className="text-cyan font-bold text-xs">═</span>
            <span className="text-[9px] font-mono text-amber-300 font-bold px-1 py-0.5 rounded bg-amber-950/60 border border-amber-500/50">C (4)</span>
            <span className="text-cyan font-bold text-xs">═</span>
            <span className="text-[9px] font-mono text-pink-300 font-bold">O (2)</span>
          </div>
          <span className="text-[9px] font-mono text-emerald-300 ml-2 font-bold">✓ 4 Bonds (CO₂)</span>
        </div>
      )
    },
    {
      step: 3,
      tag: "Your Mission Gameplay",
      title: "2-Phase Mission Flow",
      desc: "1. Read the everyday clue and pick the compound name.\n2. On the Workbench, add the elements to satisfy Carbon's 4 bonds until the Live Shell turns GREEN!",
      visual: (
        <div className="space-y-1.5 py-1 text-left">
          <div className="flex items-center gap-2 p-1.5 rounded-lg bg-cyan/10 border border-cyan/30 text-[11px] font-mono text-cyan-200">
            <span className="px-1.5 py-0.5 rounded bg-cyan/20 font-bold">Phase 1</span>
            <span>Identify Target: <strong>Methane</strong></span>
          </div>
          <div className="flex items-center gap-2 p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-[11px] font-mono text-emerald-300">
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 font-bold">Phase 2</span>
            <span>Add <strong>1× C + 4× H</strong> to satisfy 4 bonds!</span>
          </div>
        </div>
      )
    }
  ] : [
    {
      step: 1,
      tag: "The 8-Seat Octet Rule",
      title: "Why Do Atoms Bond?",
      desc: "Every atom wants a completely full outer shell of 8 electrons (e⁻) to be stable and happy! (Hydrogen only needs 2). If an atom has open seats, it feels unstable and actively looks for partners.",
      visual: (
        <div className="flex items-center justify-center gap-6 py-2">
          <div className="flex flex-col items-center">
            <BohrAtomVisualizer symbol="O" size="sm" showEmptySeats={true} />
            <span className="text-[10px] font-mono text-cyan font-bold mt-1">Oxygen (6/8 e⁻)</span>
            <span className="text-[9px] font-mono text-red-400">🔴 2 Empty Seats</span>
          </div>
          <div className="text-xl font-bold text-slate-500">+</div>
          <div className="flex flex-col items-center">
            <BohrAtomVisualizer symbol="H" size="sm" showEmptySeats={true} />
            <span className="text-[10px] font-mono text-pink-400 font-bold mt-1">Hydrogen (1/2 e⁻)</span>
            <span className="text-[9px] font-mono text-red-400">🔴 1 Empty Seat</span>
          </div>
        </div>
      )
    },
    {
      step: 2,
      tag: "Holding Hands (Covalent Sharing)",
      title: "Sharing Outer Electrons",
      desc: "Since Oxygen needs 2 more electrons, it 'holds hands' (shares electrons) with TWO Hydrogen atoms simultaneously. Now all atoms have full outer shells!",
      visual: (
        <div className="flex items-center justify-center gap-2 py-2 bg-slate-900/60 rounded-xl border border-slate-800 p-2">
          <div className="flex flex-col items-center">
            <BohrAtomVisualizer symbol="H" size="xs" showEmptySeats={false} />
            <span className="text-[9px] font-mono text-pink-300">H (1e⁻)</span>
          </div>
          <div className="h-0.5 w-3 bg-cyan animate-pulse" />
          <div className="flex flex-col items-center">
            <div className="p-1 rounded-full border border-emerald-500/80 bg-emerald-950/40">
              <BohrAtomVisualizer symbol="O" size="xs" showEmptySeats={false} />
            </div>
            <span className="text-[9px] font-mono text-emerald-300 font-bold">O (8/8 e⁻ Full!)</span>
          </div>
          <div className="h-0.5 w-3 bg-cyan animate-pulse" />
          <div className="flex flex-col items-center">
            <BohrAtomVisualizer symbol="H" size="xs" showEmptySeats={false} />
            <span className="text-[9px] font-mono text-pink-300">H (1e⁻)</span>
          </div>
        </div>
      )
    },
    {
      step: 3,
      tag: "Your Mission Gameplay",
      title: "2-Phase Mission Flow",
      desc: "1. Read the everyday clue and pick the compound name.\n2. On the Workbench, place the right atom ratio so the Live Shell Assembly turns GREEN (Stable Octet)!",
      visual: (
        <div className="space-y-1.5 py-1 text-left">
          <div className="flex items-center gap-2 p-1.5 rounded-lg bg-cyan/10 border border-cyan/30 text-[11px] font-mono text-cyan-200">
            <span className="px-1.5 py-0.5 rounded bg-cyan/20 font-bold">Phase 1</span>
            <span>Identify Target: <strong>Water</strong></span>
          </div>
          <div className="flex items-center gap-2 p-1.5 rounded-lg bg-emerald-950/40 border border-emerald-500/30 text-[11px] font-mono text-emerald-300">
            <span className="px-1.5 py-0.5 rounded bg-emerald-500/20 font-bold">Phase 2</span>
            <span>Add <strong>2× H + 1× O</strong> to fill all 8 seats!</span>
          </div>
        </div>
      )
    }
  ];

  const currentInfo = TUTORIAL_STEPS[step - 1];

  return (
    <div className="fixed top-20 right-6 z-50 w-80 sm:w-96 rounded-2xl border border-cyan/50 bg-slate-950/98 p-4 shadow-[0_0_35px_rgba(6,182,212,0.4)] animate-fade-down backdrop-blur-md">
      {/* Header with Doctor Atom */}
      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2.5">
          <div className="w-10 h-10 rounded-full overflow-hidden border border-cyan bg-slate-950 shrink-0">
            <img
              src="/doctor_atom_talking.gif"
              alt="Doctor Atom"
              className="w-full h-full object-cover object-[center_12%] scale-125"
              onError={(e) => { e.target.src = "/doctor_atom.png"; }}
            />
          </div>
          <div>
            <span className="font-mono text-xs font-bold text-cyan uppercase tracking-wider block">
              Doctor Atom Briefing
            </span>
            <span className="font-mono text-[9px] text-slate-400">
              Tutorial Step {step} of 3
            </span>
          </div>
        </div>

        {/* Step Indicators */}
        <div className="flex items-center gap-1">
          {[1, 2, 3].map((s) => (
            <div
              key={s}
              className={`size-2 rounded-full transition-all ${
                s === step ? "bg-cyan w-4" : s < step ? "bg-emerald-400" : "bg-slate-700"
              }`}
            />
          ))}
        </div>
      </div>

      {/* Tutorial Content */}
      <div className="space-y-2 my-2">
        <div className="flex items-center justify-between">
          <span className="px-2 py-0.5 rounded bg-cyan/15 border border-cyan/30 text-cyan text-[10px] font-mono font-bold">
            {currentInfo.tag}
          </span>
        </div>

        <h4 className="font-pixel text-xs sm:text-sm text-white font-bold text-left">
          {currentInfo.title}
        </h4>

        {currentInfo.visual}

        <p className="text-xs text-slate-300 leading-relaxed font-sans text-left whitespace-pre-line">
          {currentInfo.desc}
        </p>
      </div>

      {/* Navigation Buttons */}
      <div className="flex items-center gap-2 pt-2 border-t border-slate-800">
        {step > 1 && (
          <button
            type="button"
            onClick={() => setStep(step - 1)}
            className="px-3 py-2 rounded-xl bg-slate-900 border border-slate-700 text-xs font-mono text-slate-300 hover:bg-slate-800 transition"
          >
            <ChevronLeft className="size-4" />
          </button>
        )}

        {step < 3 ? (
          <button
            type="button"
            onClick={() => setStep(step + 1)}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-cyan hover:bg-cyan/90 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider transition shadow-md"
          >
            <span>Next Step</span>
            <ChevronRight className="size-4" />
          </button>
        ) : (
          <button
            type="button"
            onClick={onClose}
            className="flex-1 flex items-center justify-center gap-1.5 py-2 rounded-xl bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-400 hover:to-teal-400 text-slate-950 font-mono text-xs font-bold uppercase tracking-wider transition shadow-md"
          >
            <CheckCircle2 className="size-4" />
            <span>Start Mission!</span>
          </button>
        )}
      </div>
    </div>
  );
}
