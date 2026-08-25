import { DoctorAtomAssistant } from "./DoctorAtomAssistant";
import { Sparkles, Target, BookOpen, Layers, X } from "lucide-react";

export function StoryCard({ domain, currentStage = 1, onEnter, onCancel }) {
  const hasStages = Boolean(domain?.stages);
  const maxStages = hasStages ? Object.keys(domain.stages).length : 1;
  const activeStage = hasStages ? (domain.stages[currentStage] || domain.stages[1]) : domain;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-background/90 backdrop-blur-md grid-bg" />
      <div className="relative w-full max-w-xl rounded-3xl border border-cyan/40 bg-slate-950/95 p-6 md:p-8 shadow-[0_0_50px_rgba(6,182,212,0.25)] animate-fade-up">
        <div className="flex items-center justify-between mb-3">
          <span className="flex items-center gap-1.5 px-3 py-1 rounded-xl bg-cyan/20 text-cyan border border-cyan/40 font-mono text-xs font-bold uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5" /> Stage {currentStage} / {maxStages} Briefing
          </span>
          <button onClick={onCancel} className="text-slate-400 hover:text-white p-1 rounded-lg">
            <X className="w-5 h-5" />
          </button>
        </div>

        <h2 className="font-pixel text-xl sm:text-2xl font-bold text-glow-cyan mb-1">
          {activeStage.title || domain.name}
        </h2>
        <div className="font-mono text-xs text-cyan/80 mb-4">
          {domain.tagline}
        </div>

        <div className="mb-5">
          <DoctorAtomAssistant
            title={`Doctor Atom · Stage ${currentStage} Briefing`}
            message={
              (activeStage.story || domain.story) +
              " 💡 Remember: Chemical bonding is NOT limited to just 2 elements! Pay attention to missing valence electrons and combine 3 or 4 elements to stabilize complex polyatomic structures."
            }
            isTalking={true}
          />
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mb-6">
          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-cyan uppercase mb-2">
              <Target className="w-3.5 h-3.5" /> Stage Objectives
            </div>
            <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside font-mono">
              <li>Synthesize required compounds</li>
              <li>Clear obstacle barrier</li>
              <li>Maintain high accuracy</li>
            </ul>
          </div>

          <div className="p-3.5 rounded-2xl bg-slate-900/80 border border-slate-800">
            <div className="flex items-center gap-1.5 text-xs font-mono font-bold text-magenta uppercase mb-2">
              <BookOpen className="w-3.5 h-3.5" /> Target Learnings
            </div>
            <ul className="text-xs text-slate-300 space-y-1 list-disc list-inside font-mono">
              <li>Valence electron sharing</li>
              <li>Octet rule stability</li>
              <li>Chemical compound structure</li>
            </ul>
          </div>
        </div>

        <div className="flex justify-end pt-2 border-t border-slate-800">
          <button
            onClick={onEnter}
            className="flex items-center gap-2 rounded-full bg-gradient-to-r from-cyan to-blue-600 px-7 py-3 font-mono font-bold text-xs text-white shadow-[0_0_20px_rgba(6,182,212,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_30px_rgba(6,182,212,0.6)] uppercase tracking-wider"
          >
            Initiate Stage {currentStage} Mission →
          </button>
        </div>
      </div>
    </div>
  );
}
