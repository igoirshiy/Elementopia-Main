import React from "react";
import { Modal } from "@mui/material";
import { Sparkles, Atom, BookOpen, Lightbulb, CheckCircle2, Zap } from "lucide-react";

export function SynthesisFeedbackModal({ open, onClose, compound }) {
  if (!compound) return null;

  // Determine bonding color theme and explanation
  const getBondingMeta = (bondType = "") => {
    const bt = bondType.toLowerCase();
    if (bt.includes("ionic")) {
      return {
        badgeBg: "bg-rose-500/20 text-rose-300 border-rose-500/40",
        pillBg: "bg-rose-950/40 border-rose-500/30 text-rose-200",
        iconColor: "text-rose-400",
        label: "Ionic Bond",
        explanation: "Electrons transferred from metal to nonmetal to achieve full outer shells.",
      };
    } else if (bt.includes("diatomic")) {
      return {
        badgeBg: "bg-sky-500/20 text-sky-300 border-sky-500/40",
        pillBg: "bg-sky-950/40 border-sky-500/30 text-sky-200",
        iconColor: "text-sky-400",
        label: "Diatomic Covalent",
        explanation: "Two identical nonmetal atoms share electron pairs equally.",
      };
    } else if (bt.includes("polar")) {
      return {
        badgeBg: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40",
        pillBg: "bg-cyan-950/40 border-cyan-500/30 text-cyan-200",
        iconColor: "text-cyan-400",
        label: "Polar Covalent Bond",
        explanation: "Electrons are shared unequally between atoms with different electronegativity.",
      };
    } else {
      return {
        badgeBg: "bg-purple-500/20 text-purple-300 border-purple-500/40",
        pillBg: "bg-purple-950/40 border-purple-500/30 text-purple-200",
        iconColor: "text-purple-400",
        label: compound.BondType || "Covalent Bond",
        explanation: "Nonmetal atoms share pairs of valence electrons to achieve stability.",
      };
    }
  };

  const bondMeta = getBondingMeta(compound.BondType);

  // Group elements by count (e.g. H: 2, O: 1)
  const elementCounts = (compound.Elements || []).reduce((acc, el) => {
    acc[el] = (acc[el] || 0) + 1;
    return acc;
  }, {});

  return (
    <Modal open={open} onClose={onClose}>
      <div
        className="elementopia-scope absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[680px] max-w-[95vw] max-h-[92vh] outline-none focus:outline-none focus-visible:outline-none border-none ring-0 flex flex-col text-foreground animate-fade-up"
        style={{ minHeight: "auto", background: "transparent" }}
      >
        <div className="relative bg-[#0b0f19] border border-cyan/30 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.25)] flex flex-col max-h-full overflow-hidden">
          {/* Header Banner */}
          <div className="flex items-center justify-between gap-4 mb-4 pb-4 border-b border-white/10 shrink-0">
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-cyan/10 border border-cyan/30 text-cyan">
                <Sparkles size={18} className="animate-spin-slow" />
              </span>
              <div>
                <span className="font-mono text-[10px] text-cyan uppercase tracking-[0.25em] font-bold block">
                  Synthesis Verification
                </span>
                <h3 className="font-pixel text-xl sm:text-2xl font-bold text-white tracking-wide">
                  {compound.NAME}
                </h3>
              </div>
            </div>

            {/* Formula Pill */}
            <div className="flex flex-col items-end">
              <div className="font-mono text-xl sm:text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-cyan to-magenta drop-shadow-[0_0_12px_rgba(6,182,212,0.5)]">
                {compound.Symbol}
              </div>
              <span className="font-mono text-[9px] text-white/50 uppercase tracking-widest">
                Chemical Formula
              </span>
            </div>
          </div>

          {/* Scrollable Content Body */}
          <div className="flex-1 overflow-y-auto custom-scrollbar space-y-4 pr-1 text-left">
            {/* Bonding Type Section */}
            <div className={`p-4 rounded-2xl border ${bondMeta.pillBg} flex flex-col sm:flex-row sm:items-center justify-between gap-3`}>
              <div className="flex items-center gap-3">
                <div className={`p-2 rounded-xl border ${bondMeta.badgeBg}`}>
                  <Zap size={18} className={bondMeta.iconColor} />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-white uppercase tracking-wider">
                      {bondMeta.label}
                    </span>
                  </div>
                  <p className="text-xs text-white/70 mt-0.5 leading-relaxed">
                    {bondMeta.explanation}
                  </p>
                </div>
              </div>
            </div>

            {/* Description / Science Concept */}
            <div className="p-4 rounded-2xl bg-white/[0.03] border border-white/10">
              <div className="flex items-center gap-2 font-mono text-[11px] text-cyan font-bold uppercase tracking-widest mb-1.5">
                <BookOpen size={14} /> Scientific Overview
              </div>
              <p className="text-xs sm:text-sm text-slate-300 leading-relaxed">
                {compound.Description}
              </p>
            </div>

            {/* Real World Micro-Lesson (Instructional Feedback) */}
            {compound.RealWorldApplication && (
              <div className="p-4 rounded-2xl bg-gradient-to-r from-amber-500/10 to-orange-500/10 border border-amber-500/30">
                <div className="flex items-center gap-2 font-mono text-[11px] text-amber-300 font-bold uppercase tracking-widest mb-1.5">
                  <Lightbulb size={14} className="text-amber-400" /> Real-World Application & Micro-Lesson
                </div>
                <p className="text-xs sm:text-sm text-amber-100/90 leading-relaxed font-sans">
                  {compound.RealWorldApplication}
                </p>
              </div>
            )}

            {/* Elemental Composition Breakdown */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pt-1">
              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10">
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-white/50 uppercase tracking-widest mb-2">
                  <Atom size={12} className="text-cyan" /> Stoichiometric Ratio
                </div>
                <div className="flex flex-wrap gap-2">
                  {Object.entries(elementCounts).map(([symbol, count]) => (
                    <span
                      key={symbol}
                      className="px-2.5 py-1 rounded-lg bg-cyan/10 border border-cyan/30 text-cyan font-mono text-xs font-bold"
                    >
                      {symbol}: <span className="text-white">{count}</span>
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-3.5 rounded-2xl bg-white/[0.02] border border-white/10">
                <div className="flex items-center gap-1.5 font-mono text-[10px] text-white/50 uppercase tracking-widest mb-2">
                  <CheckCircle2 size={12} className="text-emerald-400" /> Common Uses
                </div>
                <div className="text-xs text-slate-300 font-sans leading-relaxed">
                  {Array.isArray(compound.Uses) ? compound.Uses.join(" • ") : compound.Uses}
                </div>
              </div>
            </div>
          </div>

          {/* Footer Action */}
          <div className="mt-5 pt-4 border-t border-white/10 flex items-center justify-between gap-4 shrink-0">
            <span className="font-mono text-[10px] text-white/40 uppercase tracking-wider hidden sm:inline">
              Validated Grade 8 Chemistry Standard
            </span>
            <button
              onClick={onClose}
              className="ml-auto w-full sm:w-auto px-6 py-2.5 rounded-full bg-gradient-to-r from-cyan-500 to-magenta text-white font-mono font-bold text-xs uppercase tracking-wider shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] transition-all hover:-translate-y-0.5"
            >
              Continue Experimenting →
            </button>
          </div>
        </div>
      </div>
    </Modal>
  );
}

export default SynthesisFeedbackModal;
