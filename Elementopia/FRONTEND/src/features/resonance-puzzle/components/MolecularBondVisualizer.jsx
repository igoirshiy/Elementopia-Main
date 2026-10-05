import React from 'react';
import { BohrAtomVisualizer } from './BohrAtomVisualizer';
import { ELEMENTS, calculateValenceStatus } from '../lib/game-data';
import { X, CheckCircle2, AlertCircle, AlertTriangle, Sparkles } from 'lucide-react';

export function MolecularBondVisualizer({ workbench = {}, onRemove }) {
  const entries = Object.entries(workbench).filter(([, qty]) => (qty ?? 0) > 0);
  const valenceInfo = calculateValenceStatus(workbench);

  if (entries.length === 0) {
    return (
      <div className="py-4 px-4 rounded-xl border border-slate-800 bg-slate-950/60 text-center font-mono text-xs text-slate-500 italic min-h-[90px] flex flex-col items-center justify-center gap-1">
        <Sparkles className="size-4 text-slate-600 animate-pulse" />
        <span>Click elements from palette to place atoms on workbench…</span>
      </div>
    );
  }

  let totalValenceOffered = 0;
  entries.forEach(([symbol, qty]) => {
    const e = ELEMENTS[symbol];
    if (e && !e.noble) {
      totalValenceOffered += e.valence * qty;
    }
  });

  return (
    <div className={`flex flex-col rounded-xl border p-3 shadow-lg transition-all duration-300 ${
      valenceInfo.balanced
        ? "border-emerald-500/60 bg-emerald-950/20 shadow-[0_0_20px_rgba(16,185,129,0.2)]"
        : valenceInfo.isNoble
        ? "border-amber-500/50 bg-amber-950/20"
        : "border-cyan/40 bg-slate-950/90 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
    }`}>
      {/* Header with status badge */}
      <div className="flex items-center justify-between w-full mb-2 pb-1.5 border-b border-slate-800/80">
        <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Active Atoms
        </span>
        <div className="flex items-center gap-2">
          <span className="px-2 py-0.5 rounded-md bg-slate-900 border border-slate-700 font-mono text-[10px] font-bold text-slate-300">
            {totalValenceOffered} e⁻ in mix
          </span>
          {valenceInfo.balanced ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-emerald-500/20 border border-emerald-500/50 font-mono text-[10px] font-bold text-emerald-300 animate-pulse">
              <CheckCircle2 className="size-3 text-emerald-400" /> Stable Octet
            </span>
          ) : valenceInfo.isNoble ? (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/50 font-mono text-[10px] font-bold text-amber-300">
              <AlertTriangle className="size-3 text-amber-400" /> Inert Gas
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2 py-0.5 rounded-md bg-cyan/10 border border-cyan/30 font-mono text-[10px] font-bold text-cyan">
              <AlertCircle className="size-3 text-cyan" /> Incomplete
            </span>
          )}
        </div>
      </div>

      {/* Atom list */}
      <div className="grid grid-cols-3 gap-2 w-full mb-2.5">
        {entries.map(([symbol, qty]) => (
          <button
            key={symbol}
            type="button"
            onClick={() => onRemove && onRemove(symbol)}
            className="group relative flex items-center justify-between rounded-lg bg-slate-900/90 border border-slate-800 hover:border-red-500/60 px-2 py-1.5 transition-all hover:scale-105"
            title="Click to remove one atom"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <BohrAtomVisualizer symbol={symbol} size="xs" animated={true} />
              <span className="font-mono text-[11px] font-bold text-white">×{qty}</span>
            </div>
            <X className="size-3 text-slate-400 group-hover:text-red-400 transition shrink-0 ml-1" />
          </button>
        ))}
      </div>

      {/* Visual Valence & Octet Meter */}
      <div className="rounded-lg bg-slate-900/80 border border-slate-800 p-2 text-left">
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-1">
          <span>Valence Bonding Slots</span>
          <span className={valenceInfo.balanced ? "text-emerald-400 font-bold" : "text-cyan"}>
            {valenceInfo.slotsFilled} / {Math.max(valenceInfo.slotsNeeded, valenceInfo.slotsFilled, 1)} Filled
          </span>
        </div>

        {/* Progress bar representing bond slot completion */}
        <div className="h-1.5 w-full rounded-full bg-slate-800 overflow-hidden">
          <div
            className={`h-full transition-all duration-500 rounded-full ${
              valenceInfo.balanced
                ? "bg-gradient-to-r from-emerald-500 to-teal-400 shadow-[0_0_8px_rgba(16,185,129,0.8)]"
                : valenceInfo.isNoble
                ? "bg-amber-500"
                : "bg-gradient-to-r from-cyan-500 to-indigo-500"
            }`}
            style={{
              width: `${Math.min(
                100,
                valenceInfo.slotsNeeded > 0
                  ? (valenceInfo.slotsFilled / valenceInfo.slotsNeeded) * 100
                  : valenceInfo.balanced
                  ? 100
                  : 30
              )}%`
            }}
          />
        </div>

        <p className="mt-1.5 font-mono text-[10px] leading-tight text-slate-300">
          {valenceInfo.message}
        </p>
      </div>
    </div>
  );
}

