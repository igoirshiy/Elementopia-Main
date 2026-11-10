import React from "react";
import { DoctorAtomAssistant } from "./DoctorAtomAssistant";
import { Target, BookOpen, Layers, X, ArrowRight, LayoutDashboard, FlaskConical } from "lucide-react";

export function StoryCard({ domain, currentStage = 1, onEnter, onCancel }) {
  const hasStages = Boolean(domain?.stages);
  const maxStages = hasStages ? Object.keys(domain.stages).length : 1;
  const activeStage = hasStages ? (domain.stages[currentStage] || domain.stages[1]) : domain;
  const requiredCompounds = activeStage?.required || [];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 overflow-y-auto">
      <div
        className="absolute inset-0 bg-background/90 backdrop-blur-md grid-bg"
        onClick={onCancel}
      />
      <div className="relative w-full max-w-lg md:max-w-3xl lg:max-w-5xl rounded-3xl border border-cyan/40 bg-slate-950/95 p-5 sm:p-7 md:p-8 shadow-[0_0_50px_rgba(6,182,212,0.25)] animate-fade-up max-h-[94vh] overflow-y-auto my-auto flex flex-col justify-between">
        <div>
          <div className="flex items-center justify-between pb-3 mb-4 border-b border-slate-800">
            <div className="flex items-center gap-2">
              <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan/20 text-cyan border border-cyan/40 font-mono text-xs font-bold uppercase tracking-wider">
                <Layers className="w-3.5 h-3.5" /> Stage {currentStage} of {maxStages} Briefing
              </span>
              <span className="hidden sm:inline-block font-mono text-xs text-muted-foreground uppercase tracking-wider">
                {domain?.name}
              </span>
            </div>
          </div>

          <div className="mb-5">
            <h2 className="font-pixel text-xl sm:text-2xl md:text-3xl font-bold text-glow-cyan mb-1.5 leading-tight">
              {activeStage.title || domain?.name}
            </h2>
            <p className="font-mono text-xs sm:text-sm text-cyan/80 leading-relaxed">
              {domain?.tagline}
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 mb-6 items-stretch">
            <div className="lg:col-span-7 flex flex-col h-full">
              <DoctorAtomAssistant
                className="h-full flex-1"
                title={`Doctor Atom · Stage ${currentStage} Guidance`}
                message={
                  `${activeStage.story || domain?.story || ""}\n\n💡 Remember: Chemical bonding is NOT limited to just 2 elements! Pay attention to open valence slots and combine 3 or 4 elements to balance complex polyatomic structures.`
                }
                isTalking={true}
              />
            </div>

            <div className="lg:col-span-5 flex flex-col justify-between gap-3.5 h-full">
              {requiredCompounds.length > 0 && (
                <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800">
                  <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan uppercase mb-2">
                    <FlaskConical className="w-4 h-4 text-cyan" /> Target Synthesis Formulas ({requiredCompounds.length})
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {requiredCompounds.map((comp, idx) => (
                      <div
                        key={idx}
                        className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-950 border border-cyan/30 text-xs font-mono text-slate-200"
                        title={comp.clue || comp.name}
                      >
                        <span className="font-bold text-cyan">{comp.formula}</span>
                        <span className="text-[11px] text-muted-foreground">({comp.name})</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan uppercase mb-2">
                  <Target className="w-4 h-4 text-cyan" /> Stage Objectives
                </div>
                <ul className="text-xs sm:text-sm text-slate-300 space-y-1.5 list-disc list-inside font-mono">
                  <li>Synthesize all required compounds</li>
                  <li>Avoid hazardous unstable reactions</li>
                  <li>Deactivate cavern resonance barrier</li>
                </ul>
              </div>

              <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 flex-1 flex flex-col justify-center">
                <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-magenta uppercase mb-2">
                  <BookOpen className="w-4 h-4 text-magenta" /> Core Learnings
                </div>
                <ul className="text-xs sm:text-sm text-slate-300 space-y-1.5 list-disc list-inside font-mono">
                  <li>Valence electron sharing & transfer</li>
                  <li>Octet stability & noble gas inertness</li>
                  <li>Compound stoichiometry & formulas</li>
                </ul>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col-reverse sm:flex-row items-center justify-between gap-3 pt-4 border-t border-slate-800">
          <button
            type="button"
            onClick={onCancel}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-xl border border-slate-700 bg-slate-900/60 hover:bg-slate-800 px-5 py-3 font-mono font-bold text-xs sm:text-sm text-slate-300 hover:text-white transition-all cursor-pointer min-h-[48px]"
          >
            <LayoutDashboard className="w-4 h-4 text-slate-400" />
            Return to Dashboard
          </button>

          <button
            type="button"
            onClick={onEnter}
            className="w-full sm:w-auto flex items-center justify-center gap-2 rounded-full bg-gradient-to-r from-cyan to-blue-600 px-8 py-3 font-mono font-bold text-xs sm:text-sm text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] uppercase tracking-wider cursor-pointer min-h-[48px]"
          >
            Initiate Stage {currentStage} Mission
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}