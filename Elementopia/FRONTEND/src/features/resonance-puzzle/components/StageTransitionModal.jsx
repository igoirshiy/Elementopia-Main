import React from 'react';
import { DoctorAtomAssistant } from './DoctorAtomAssistant';
import { Layers, ArrowRight, Home, Sparkles, CheckCircle2 } from 'lucide-react';

export function StageTransitionModal({ currentStage, maxStages, domain, nextStageData, onAdvanceStage, onReturnHome }) {
  const rewardHint = React.useMemo(() => {
    if (!nextStageData?.required || nextStageData.required.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * nextStageData.required.length);
    return nextStageData.required[randomIndex];
  }, [nextStageData]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-background/90 backdrop-blur-md grid-bg" />
      <div className="relative w-full max-w-xl rounded-3xl border border-cyan/50 bg-slate-950/95 p-6 md:p-8 shadow-[0_0_50px_rgba(6,182,212,0.25)] animate-fade-up max-h-[90vh] overflow-y-auto">
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
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-center">
              <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-magenta uppercase mb-2">
                <Sparkles className="w-3.5 h-3.5" /> Next Focus: Stage {currentStage + 1}
              </div>
              <div className="text-sm font-bold text-white mb-1 leading-tight">
                {nextStageData.title}
              </div>
              <div className="text-[10px] text-slate-400 mt-2">
                {nextStageData.story}
              </div>
            </div>

            {rewardHint && (
              <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/5 border border-amber-500/40 relative overflow-hidden group">
                <div className="absolute -right-4 -top-4 p-4 opacity-10 transition-transform duration-1000 group-hover:rotate-12 group-hover:scale-110">
                  <Sparkles className="w-24 h-24 text-amber-500" />
                </div>
                <div className="flex items-center gap-2 text-[10px] font-mono font-bold text-amber-400 uppercase mb-2 relative z-10">
                  <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Blueprint Discovered
                </div>
                <div className="bg-slate-950/60 p-3 rounded-xl border border-amber-500/30 relative z-10 backdrop-blur-sm">
                  <div className="text-[9px] text-amber-500/70 font-mono uppercase tracking-widest mb-1">Upcoming Target</div>
                  <div className="text-sm font-bold text-amber-300 font-pixel tracking-wide">{rewardHint.name}</div>
                  <div className="text-[10px] text-amber-100/70 font-mono mt-1.5 flex items-center gap-1.5">
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 border border-amber-500/30">
                      {Object.keys(rewardHint.recipe).join(', ')}
                    </span>
                    <span>Required elements</span>
                  </div>
                </div>
              </div>
            )}
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
