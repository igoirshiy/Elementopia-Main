import React from 'react';
import { DoctorAtomAssistant } from './DoctorAtomAssistant';
import { Sparkles, CheckCircle2, Lightbulb } from 'lucide-react';

export function DoctorAtomTutorialModal({ domainId, currentStage, onClose }) {
  if (!["covalent", "salt"].includes(domainId)) return null;

  const TUTORIALS = {
    covalent: {
      1: {
        title: "Doctor Atom: Foundational Binary Sharing",
        briefing: "Welcome, Alchemist! In Stage 1, nonmetal atoms share pairs of valence electrons to complete their outer octets. Single and double covalent bonds form stable binary compounds.",
        hint: "💡 Try combining 2 Hydrogen + 1 Oxygen to synthesize Water (H₂O)!"
      },
      2: {
        title: "Doctor Atom: Multi-Element Covalent Bonding",
        briefing: "CRITICAL LESSON: Chemical bonding is NOT limited to 2 elements! Nonmetals like Carbon, Hydrogen, Nitrogen, and Oxygen can share electrons simultaneously across 3 distinct elements at once.",
        hint: "💡 Try combining 1 Hydrogen + 1 Carbon + 1 Nitrogen to create Hydrogen Cyanide (HCN)!"
      },
      3: {
        title: "Doctor Atom: 4-Element Macromolecular Core",
        briefing: "Entering the core cavern! Carbon forms complex 4-element organic macromolecule backbones. Balance Carbon, Hydrogen, Nitrogen, and Oxygen so every valence electron finds a home.",
        hint: "💡 Try combining 1 Carbon + 4 Hydrogens + 2 Nitrogens + 1 Oxygen to synthesize Urea (CH₄N₂O)!"
      }
    },
    salt: {
      1: {
        title: "Doctor Atom: Binary Ionic Electron Transfer",
        briefing: "Welcome to the Salt Flats! Metals surrender outer valence electrons to nonmetal acceptors, forming charged ionic crystal lattices.",
        hint: "💡 Try surrendering 1 Sodium (Na) valence electron to 1 Chlorine (Cl) to form neutral Table Salt (NaCl)!"
      },
      2: {
        title: "Doctor Atom: Multi-Element Divalent Salts",
        briefing: "IMPORTANT LESSON: Ionic bonding is NOT limited to 2 elements! Divalent metals like Magnesium (Mg) surrender electrons across 3 elements simultaneously.",
        hint: "💡 Try combining 1 Sodium + 1 Oxygen + 1 Hydrogen to synthesize Sodium Hydroxide (NaOH)!"
      },
      3: {
        title: "Doctor Atom: Polyatomic 4-Element Lattices",
        briefing: "Entering the core salt cave! Metals bind 3-and-4 element polyatomic groups like bicarbonate and ammonium into complex ionic crystals.",
        hint: "💡 Try combining 1 Sodium + 1 Hydrogen + 1 Carbon + 3 Oxygens to synthesize Baking Soda (NaHCO₃)!"
      }
    }
  };

  const info = TUTORIALS[domainId]?.[currentStage];
  if (!info) return null;

  return (
    <div className="fixed top-20 right-6 z-50 w-80 sm:w-96 rounded-2xl border border-cyan/50 bg-slate-950/95 p-4 shadow-[0_0_30px_rgba(6,182,212,0.35)] animate-fade-down backdrop-blur-md">
      <div className="flex items-center justify-between mb-2.5 pb-2 border-b border-slate-800">
        <div className="flex items-center gap-2">
          <DoctorAtomAssistant mood="teaching" size="md" />
          <div>
            <span className="font-mono text-xs font-bold text-cyan uppercase tracking-wider block">
              Doctor Atom Tutorial
            </span>
            <span className="font-mono text-[9px] text-slate-400">
              Stage {currentStage} Briefing
            </span>
          </div>
        </div>
      </div>

      <div className="space-y-2.5 my-2">
        <h4 className="font-pixel text-xs sm:text-sm text-white font-bold">
          {info.title}
        </h4>
        <p className="text-xs text-slate-300 leading-relaxed font-sans">
          {info.briefing}
        </p>

        <div className="rounded-xl border border-cyan/30 bg-cyan/10 p-2.5 font-mono text-[11px] text-cyan-200 leading-relaxed">
          {info.hint}
        </div>
      </div>

      <button
        onClick={onClose}
        className="mt-3 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-2.5 font-mono text-xs font-bold text-white shadow-md transition-all hover:scale-[1.02] hover:shadow-cyan-500/25 uppercase tracking-wider"
      >
        <CheckCircle2 className="size-4" /> Got it, Alchemist!
      </button>
    </div>
  );
}
