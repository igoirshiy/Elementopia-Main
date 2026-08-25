import React from 'react';
import { DoctorAtomAssistant } from './DoctorAtomAssistant';
import { Layers, ArrowRight, Home, Sparkles, CheckCircle2 } from 'lucide-react';

export function StageTransitionModal({ currentStage, maxStages, domain, nextStageData, onAdvanceStage, onReturnHome }) {
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-background/90 backdrop-blur-md grid-bg" />
      <div className="relative w-full max-w-xl rounded-3xl border border-cyan/50 bg-slate-950/95 p-6 md:p-8 shadow-[0_0_50px_rgba(6,182,212,0.25)] animate-fade-up">
        <div className="flex items-center gap-2 mb-3">
          <span className="flex items-center gap-1 px-3 py-1 rounded-xl bg-cyan/20 text-cyan border border-cyan/40 font-mono text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" /> Stage {currentStage} / {maxStages} Debriefing
          </span>
          <span className="text-xs font-mono text-slate-400">
            {domain?.name}
          </span>
        </div>

        <h2 className="font-pixel text-xl sm:text-2xl font-bold text-glow-cyan mb-3">
          Stage {currentStage} Barrier Cleared!
        </h2>

        <div className="mb-4">
          <DoctorAtomAssistant
            title={`Doctor Atom · Stage ${currentStage} Debrief`}
            message={`Outstanding reasoning! You have successfully mastered Stage ${currentStage} of ${domain?.name}. Here is what you achieved:`}
            isTalking={true}
          />
        </div>

        <div className="p-4 rounded-2xl bg-cyan/10 border border-cyan/30 mb-4">
          <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan uppercase mb-2">
            <CheckCircle2 className="w-4 h-4 text-cyan" /> Stage {currentStage} Masteries Unlocked
          </div>
          <ul className="text-xs text-slate-200 space-y-1.5 font-mono list-disc list-inside">
            {currentStage === 1 && (
              <>
                <li>Mastered 2-element binary electron sharing & octet balance</li>
                <li>Deducted valence electron ratios for neutral molecules</li>
              </>
            )}
            {currentStage === 2 && (
              <>
                <li>Mastered 3-element ternary bonding & multiple shared electron pairs</li>
                <li>Deducted balance rules for polyatomic ion structures</li>
              </>
            )}
            {currentStage === 3 && (
              <>
                <li>Mastered 3-to-4 element polyatomic macromolecular backbones</li>
                <li>Achieved complete domain resonance across all complex compounds</li>
              </>
            )}
          </ul>
        </div>

        {nextStageData && (
          <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 mb-6">
            <div className="flex items-center gap-2 text-xs font-mono font-bold text-magenta uppercase mb-1">
              <Sparkles className="w-3.5 h-3.5" /> Next Stage Focus (Stage {currentStage + 1})
            </div>
            <div className="text-sm font-bold text-white mb-1">
              {nextStageData.title}
            </div>
            <div className="text-xs text-slate-300">
              {nextStageData.story}
            </div>
          </div>
        )}

        <div className="flex items-center justify-between border-t border-slate-800 pt-4 gap-3">
          <button
            onClick={onReturnHome}
            className="flex items-center gap-2 px-5 py-2.5 rounded-full border border-slate-700 text-slate-300 font-mono text-xs hover:bg-slate-800 transition"
          >
            <Home className="w-4 h-4" /> Dashboard
          </button>

          <button
            onClick={onAdvanceStage}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan to-blue-600 px-7 py-3 font-mono font-bold text-xs text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] uppercase tracking-wider"
          >
            Dive Deeper to Stage {currentStage + 1} <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
