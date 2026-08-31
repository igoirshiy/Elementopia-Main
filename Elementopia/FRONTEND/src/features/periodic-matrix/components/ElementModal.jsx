import React from "react";
import { X, Sparkles, Lightbulb } from "lucide-react";
import { getFamilyClasses, BohrModelVisualizer } from "@/features/dr-atom-workshop";

export function ElementModal({ element, onClose }) {
  if (!element) return null;

  const familyClass = getFamilyClasses(element.family);
  const formattedFamily = element.family.charAt(0).toUpperCase() + element.family.slice(1);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
      <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-lg w-full space-y-5 relative border border-cyan-500/40 bg-slate-950/95 shadow-[0_0_50px_rgba(6,182,212,0.25)] max-h-[90vh] overflow-y-auto">
        {/* Close button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-800/80 text-gray-400 hover:text-white flex items-center justify-center transition cursor-pointer border border-slate-700 hover:border-cyan"
        >
          <X className="size-4" />
        </button>

        {/* Element Header Badge */}
        <div className="flex items-center gap-5">
          <div className={`w-20 h-20 sm:w-24 sm:h-24 rounded-2xl flex flex-col items-center justify-between text-white shadow-xl p-2.5 border shrink-0 ${familyClass}`}>
            <span className="text-xs font-mono self-start opacity-80 leading-none">{element.num}</span>
            <span className="text-3xl font-bold font-sans tracking-wide leading-none">{element.symbol}</span>
            <span className="text-[10px] font-mono opacity-80 leading-none">{element.mass}</span>
          </div>

          <div className="space-y-1 text-left">
            <div className={`inline-block px-2.5 py-0.5 rounded-full text-[10px] font-mono uppercase tracking-wider font-bold border ${familyClass}`}>
              {formattedFamily}
            </div>
            <h2 className="font-heading text-2xl font-bold text-white tracking-wide">
              {element.name}
            </h2>
            <p className="text-xs font-mono text-cyan-400">
              Group {element.group} · Period {element.period}
            </p>
          </div>
        </div>

        {/* Bohr Visualizer Preview */}
        <div className="bg-slate-900/60 p-3 rounded-2xl border border-slate-800 flex items-center justify-center">
          <BohrModelVisualizer elementNum={element.num} />
        </div>

        {/* Specifications Grid */}
        <div className="bg-slate-900/80 p-3.5 rounded-2xl border border-slate-800 flex items-center justify-between text-center">
          <div>
            <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Valence e⁻</div>
            <div className="text-xl font-heading font-bold text-rose-400">{element.valence}</div>
          </div>
          <div className="w-px h-7 bg-slate-800" />
          <div>
            <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Energy Shells</div>
            <div className="text-xl font-heading font-bold text-cyan-400">{element.shells}</div>
          </div>
          <div className="w-px h-7 bg-slate-800" />
          <div>
            <div className="text-[10px] text-gray-400 font-mono uppercase tracking-wider">Pulling Power (EN)</div>
            <div className="text-xl font-heading font-bold text-purple-400">{element.en}</div>
          </div>
        </div>

        {/* What this element is for / Everyday life explainer */}
        <div className="bg-gradient-to-br from-cyan-950/40 to-slate-900/90 p-4 rounded-2xl border border-cyan-500/30 text-left space-y-1.5 shadow-inner">
          <div className="flex items-center gap-1.5 text-[11px] font-mono font-bold text-cyan-300 uppercase tracking-wider">
            <Lightbulb className="size-3.5 text-yellow-400 shrink-0" />
            What is this element used for?
          </div>
          <p className="text-xs sm:text-sm text-slate-200 leading-relaxed font-sans font-medium">
            {element.desc}
          </p>
        </div>

        {/* Action Button */}
        <div className="pt-1 flex justify-end">
          <button
            onClick={onClose}
            className="px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-xs font-bold text-white transition cursor-pointer border border-slate-700 hover:border-cyan"
          >
            Close Inspection
          </button>
        </div>
      </div>
    </div>
  );
}
