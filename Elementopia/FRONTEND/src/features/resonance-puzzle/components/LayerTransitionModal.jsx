import React from 'react';
import { DoctorAtomAssistant } from './DoctorAtomAssistant';
import { Layers, ArrowRight, Sparkles } from 'lucide-react';

const DOMAIN_LAYER_BRIEFINGS = {
  water: {
    1: {
      title: "Surface Barrier Shattered!",
      message: "Great work synthesizing Water (H₂O)! Now descend deeper into the cavern where Hydrogen & Oxygen bond in higher ratios to form Hydrogen Peroxide (H₂O₂).",
    },
    2: {
      title: "Deep Water Barrier Dissolved!",
      message: "You've mastered peroxide covalent bonds! Now enter the Cavern Core where Nitrogen & Hydrogen combine to form Ammonia (NH₃).",
    },
    3: {
      title: "Water Cavern Core Cleared!",
      message: "Covalent mastery achieved across all depth layers!",
    }
  },
  salt: {
    1: {
      title: "Salt Crust Cracked!",
      message: "Table Salt (NaCl) formed! Now descend into the alkali depths to bond Sodium, Oxygen, and Hydrogen into Sodium Hydroxide (NaOH).",
    },
    2: {
      title: "Alkali Barrier Dissolved!",
      message: "Sodium Hydroxide mastered! Descend to the Crystal Core to bond Magnesium with Chlorine (MgCl₂).",
    },
    3: {
      title: "Salt Flats Core Cleared!",
      message: "Ionic lattice mastery achieved across all layers!",
    }
  },
  carbon: {
    1: {
      title: "Forge Entrance Melted!",
      message: "Carbon Dioxide (CO₂) synthesized! Descend into the Deep Forge to bond Carbon with Hydrogen to form Methane (CH₄).",
    },
    2: {
      title: "Hydrocarbon Gate Unlocked!",
      message: "Methane synthesized! Enter the Molten Core to synthesize complex Glucose (C₆H₁₂O₆).",
    },
    3: {
      title: "Carbon Forge Core Mastered!",
      message: "Organic carbon backbone mastery achieved!",
    }
  }
};

export function LayerTransitionModal({ currentLayer, domain, nextCompound, onDescend }) {
  const currentBriefing = DOMAIN_LAYER_BRIEFINGS[domain?.id]?.[currentLayer] || {
    title: `Layer ${currentLayer} Cleared!`,
    message: `Great reaction! Prepare to descend deeper into ${domain?.name}.`
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-background/90 backdrop-blur-md grid-bg" />

      <div className="relative w-full max-w-xl rounded-3xl border border-cyan/50 bg-slate-950/95 p-8 shadow-[0_0_50px_rgba(6,182,212,0.25)] animate-fade-up">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex items-center gap-1 px-3 py-1 rounded-xl bg-cyan/20 text-cyan border border-cyan/40 font-mono text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" /> Layer {currentLayer} / 3 Cleared
          </span>
          <span className="text-xs font-mono text-slate-400">
            {domain?.name}
          </span>
        </div>

        <h2 className="font-pixel text-2xl font-bold text-glow-cyan mb-4">
          {currentBriefing.title}
        </h2>

        <div className="mb-6">
          <DoctorAtomAssistant
            title="Doctor Atom Discovery Log"
            message={currentBriefing.message}
            isTalking={true}
          />
        </div>

        {nextCompound && (
          <div className="p-4 rounded-xl bg-slate-900/70 border border-slate-800 mb-6">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-magenta uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Next Target Compound (Layer {currentLayer + 1})
            </div>
            <div className="text-sm font-bold text-white">
              {nextCompound.name} <span className="font-mono text-cyan">({nextCompound.formula})</span>
            </div>
          </div>
        )}

        <div className="flex items-center justify-end border-t border-slate-800 pt-5">
          <button
            onClick={onDescend}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan to-blue-600 px-7 py-3 font-mono font-bold text-xs text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] uppercase tracking-wider"
          >
            Descend Deeper to Layer {currentLayer + 1} <ArrowRight className="w-4 h-4" />
          </button>
        </div>
      </div>
    </div>
  );
}