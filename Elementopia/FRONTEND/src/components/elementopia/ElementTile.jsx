import { useState } from "react";
import { ELEMENTS } from "@/lib/game-data";

export function ElementTile({ symbol, disabled, onAdd }) {
  const [hover, setHover] = useState(false);
  const e = ELEMENTS[symbol];
  return (
    <div
      className="relative"
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
        <div className="pointer-events-none absolute bottom-full left-1/2 z-30 mb-2 w-64 -translate-x-1/2 rounded-lg border border-border bg-popover/95 p-3 text-xs shadow-2xl backdrop-blur animate-fade-up">
          <div className="mb-1 flex items-baseline justify-between">
            <span className="font-display text-base font-bold text-foreground">{e.name}</span>
            <span className="font-mono text-magenta">{e.symbol}</span>
          </div>
          <div className={`mb-1 font-mono text-[10px] ${e.noble ? "text-yellow-300" : "text-cyan"}`}>
            {e.noble ? `⚠ NOBLE GAS · full shell · bonds with nothing` : `${e.valence} valence e⁻ · bonds with ${e.partners}`}
          </div>
          <div className="text-muted-foreground">{e.fact}</div>
        </div>
      )}
    </div>
  );
}
