import React from 'react';
import { BohrAtomVisualizer } from './BohrAtomVisualizer';
import { ELEMENTS } from '../lib/game-data';
import { X } from 'lucide-react';

export function MolecularBondVisualizer({ workbench = {}, onRemove }) {
  const entries = Object.entries(workbench).filter(([, qty]) => (qty ?? 0) > 0);

  if (entries.length === 0) {
    return (
      <div className="py-4 px-4 rounded-xl border border-slate-800 bg-slate-950/60 text-center font-mono text-xs text-slate-500 italic min-h-[90px] flex items-center justify-center">
        Click elements below to add them to the workbench…
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
    <div className="flex flex-col rounded-xl border border-cyan/40 bg-slate-950/90 p-3 shadow-[0_0_15px_rgba(6,182,212,0.15)] animate-fade-up min-h-[100px] justify-between">
      <div className="flex items-center justify-between w-full mb-2.5 pb-1.5 border-b border-slate-800/80">
        <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider">
          Active Mixture
        </span>
        <span className="px-2.5 py-0.5 rounded-md bg-cyan/20 border border-cyan/30 font-mono text-[11px] font-bold text-cyan">
          {totalValenceOffered} e⁻ shared
        </span>
      </div>

      <div className="grid grid-cols-3 gap-2 w-full">
        {entries.map(([symbol, qty]) => (
          <button
            key={symbol}
            type="button"
            onClick={() => onRemove && onRemove(symbol)}
            className="group relative flex items-center justify-between rounded-lg bg-slate-900 border border-slate-800 hover:border-cyan/60 px-2 py-1 transition-all hover:scale-105"
            title="Click to remove one"
          >
            <div className="flex items-center gap-1.5 min-w-0">
              <BohrAtomVisualizer symbol={symbol} size="xs" animated={true} />
              <span className="font-mono text-[11px] font-bold text-white">×{qty}</span>
            </div>
            <X className="size-3 text-slate-400 group-hover:text-red-400 transition shrink-0 ml-1" />
          </button>
        ))}
      </div>
    </div>
  );
}
