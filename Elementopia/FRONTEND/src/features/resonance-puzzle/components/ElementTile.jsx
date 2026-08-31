import { useState } from "react";
import { ELEMENTS } from "@/features/resonance-puzzle/lib/game-data";
import { BohrAtomVisualizer } from "./BohrAtomVisualizer";

export function ElementTile({ symbol, disabled, onAdd }) {
  const [hover, setHover] = useState(false);
  const e = ELEMENTS[symbol];
  return (
    <div
      className="relative w-full aspect-square"
      onMouseEnter={() => setHover(true)}
      onMouseLeave={() => setHover(false)}
    >
      <button
        type="button"
        disabled={disabled}
        onClick={() => onAdd(symbol)}
        className={`group relative aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br ${e.gradient} p-3 text-left shadow-lg transition-all
          ${disabled ? "opacity-25 saturate-0 cursor-not-allowed" : "hover:scale-105 hover:shadow-2xl active:scale-95"}`}
      >
        {e.noble && (
          <div className="absolute left-0 top-0 z-10 rounded-br-md bg-black/70 px-1.5 py-0.5 font-mono text-[8px] uppercase tracking-widest text-yellow-200">
            Noble · Inert
          </div>
        )}
        <div className="absolute right-2 top-2 font-mono text-[10px] opacity-80 text-white">{e.valence}e⁻</div>
        <div className="flex h-full flex-col justify-between">
          <div className="font-display text-3xl font-bold text-white drop-shadow sm:text-4xl">{e.symbol}</div>
          <div className="font-mono text-[10px] uppercase tracking-wider text-white/90 sm:text-xs">{e.name}</div>
        </div>
      </button>
      {hover && !disabled && (
        <div className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-72 -translate-x-1/2 rounded-xl border border-cyan/50 bg-slate-950/95 p-3.5 text-xs shadow-[0_0_25px_rgba(6,182,212,0.3)] backdrop-blur animate-fade-up">
          <div className="flex items-center justify-between gap-2 mb-2 pb-2 border-b border-slate-800">
            <div>
              <div className="font-display text-base font-bold text-white">{e.name}</div>
              <div className={`font-mono text-[10px] ${e.noble ? "text-yellow-300" : "text-cyan"}`}>
                {e.noble ? `⚠ NOBLE GAS · inert octet` : `${e.valence} valence e⁻ · partners: ${e.partners}`}
              </div>
            </div>
            <div className="shrink-0">
              <BohrAtomVisualizer symbol={symbol} size="sm" />
            </div>
          </div>
          <div className="text-slate-300 text-[11px] leading-relaxed">{e.fact}</div>
        </div>
      )}
    </div>
  );
}
