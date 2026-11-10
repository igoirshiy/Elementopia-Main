import React from 'react';
import { DoctorAtomAssistant } from './DoctorAtomAssistant';
import { Layers, ArrowRight, LayoutDashboard, Sparkles, CheckCircle2, X } from 'lucide-react';

export function StageTransitionModal({ currentStage, maxStages, domain, nextStageData, onAdvanceStage, onReturnHome }) {
  const rewardHint = React.useMemo(() => {
    if (!nextStageData?.required || nextStageData.required.length === 0) return null;
    const randomIndex = Math.floor(Math.random() * nextStageData.required.length);
    return nextStageData.required[randomIndex];
  }, [nextStageData]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div 
        className="absolute inset-0 bg-background/90 backdrop-blur-md grid-bg" 
        onClick={onReturnHome}
      />

      <div className="relative w-full max-w-xl md:max-w-2xl rounded-3xl border border-cyan/40 bg-slate-950/95 p-5 sm:p-7 md:p-8 shadow-[0_0_50px_rgba(6,182,212,0.25)] animate-fade-up max-h-[94vh] overflow-y-auto my-auto flex flex-col justify-between">
        <div>
          {/* Header Bar */}
          <div className="flex items-center justify-between pb-3 mb-3 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan/20 text-cyan border border-cyan/40 font-mono text-xs font-bold uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" /> Stage {currentStage} / {maxStages} Debriefing
              </span>
              <span className="font-mono text-xs text-muted-foreground uppercase tracking-wider">
                {domain?.name}
              </span>
            </div>
            <button
              onClick={onReturnHome}
              className="text-slate-400 hover:text-white p-1.5 rounded-xl hover:bg-slate-900 border border-transparent hover:border-slate-800 transition-colors cursor-pointer min-h-[40px] min-w-[40px] flex items-center justify-center"
              aria-label="Close Debriefing"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Title */}
          <div className="mb-4">
            <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl font-bold text-glow-cyan mb-1 leading-tight">
              Stage {currentStage} Barrier Cleared!
            </h2>
          </div>

          {/* Clean Vertical Stacking Matching Deployed Platform */}
          <div className="space-y-4 mb-5">
            {/* 1. Full-Width Doctor Atom Debrief */}
            <DoctorAtomAssistant
              title={`Doctor Atom · Stage ${currentStage} Debrief`}
              message={`Outstanding reasoning! You have successfully mastered Stage ${currentStage} of ${domain?.name}. Here is what you achieved:`}
              isTalking={true}
            />

            {/* 2. Full-Width Masteries Unlocked */}
            <div className="p-4 rounded-2xl bg-slate-900/80 border border-cyan/30 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
              <div className="flex items-center gap-2 text-xs font-mono font-bold text-cyan uppercase mb-2">
                <CheckCircle2 className="w-4 h-4 text-cyan" /> Stage {currentStage} Masteries Unlocked
              </div>
              <ul className="text-xs sm:text-sm text-slate-200 space-y-1.5 font-mono list-disc list-inside">
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

            {/* 3. Bottom Row: 2-Column Split for Next Focus & Blueprint */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 items-stretch">
              {nextStageData && (
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex flex-col justify-between">
                  <div>
                    <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-magenta uppercase mb-1.5">
                      <Sparkles className="w-3.5 h-3.5 text-magenta" /> Next Focus: Stage {currentStage + 1}
                    </div>
                    <div className="text-sm font-bold text-white mb-1.5 leading-tight font-pixel">
                      {nextStageData.title}
                    </div>
                    <div className="text-xs text-slate-300 leading-relaxed font-sans line-clamp-4">
                      {nextStageData.story}
                    </div>
                  </div>
                </div>
              )}

              {rewardHint && (
                <div className="p-4 rounded-2xl bg-gradient-to-br from-amber-500/20 to-amber-700/5 border border-amber-500/40 relative overflow-hidden group flex flex-col justify-between">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-amber-400 uppercase mb-2 relative z-10">
                    <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" /> Blueprint Discovered
                  </div>
                  <div className="bg-slate-950/70 p-3.5 rounded-xl border border-amber-500/30 relative z-10 backdrop-blur-sm">
                    <div className="text-[10px] text-amber-400/80 font-mono uppercase tracking-widest mb-1">Upcoming Target</div>
                    <div className="text-base sm:text-lg font-bold text-amber-300 font-pixel tracking-wide">{rewardHint.name}</div>
                    <div className="text-xs text-amber-100/80 font-mono mt-2 flex items-center gap-1.5">
                      <span className="px-2 py-0.5 rounded bg-amber-500/20 border border-amber-500/40 text-amber-300 font-bold">
                        {Object.keys(rewardHint.recipe).join(', ')}
                      </span>
                      <span>Required elements</span>
                    </div>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>

        {/* Footer Actions: Prompts Return to Dashboard */}
        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          {nextStageData ? (
            <button
              type="button"
              onClick={onAdvanceStage}
              className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 px-5 py-3 font-mono font-bold text-xs sm:text-sm text-slate-300 hover:text-white transition-all cursor-pointer min-h-[48px]"
            >
              <span>Dive Deeper to Stage {currentStage + 1}</span>
              <ArrowRight className="w-4 h-4" />
            </button>
          ) : <div />}

          <button
            type="button"
            onClick={onReturnHome}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan to-blue-600 px-8 py-3 font-mono font-bold text-xs sm:text-sm text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] uppercase tracking-wider cursor-pointer min-h-[48px]"
          >
            <LayoutDashboard className="w-4 h-4" />
            <span>Return to Dashboard</span>
          </button>
        </div>

      </div>
    </div>
  );
}
