import { useState } from "react";
import { ELEMENTS } from "@/features/resonance-puzzle/lib/game-data";
import { BohrAtomVisualizer } from "./BohrAtomVisualizer";

export function ElementTile({ symbol, disabled, onAdd, index = 0 }) {
  const [hover, setHover] = useState(false);
  const e = ELEMENTS[symbol];

  // Since the Element Palette is docked on the right side of the screen,
  // the tooltip always flies out to the LEFT (towards the center of the screen)
  // so it is 100% visible and never clipped by the right viewport edge.
  const isTopRow = index <= 1;
  const isBottomRow = index >= 4;

  const posClass = isTopRow 
    ? "right-full mr-3 top-0" 
    : isBottomRow 
    ? "right-full mr-3 bottom-0" 
    : "right-full mr-3 top-1/2 -translate-y-1/2";

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
        className={`group relative aspect-square w-full overflow-hidden rounded-xl bg-gradient-to-br ${e.gradient} p-2 sm:p-2.5 text-left shadow-md transition-all
          ${disabled ? "opacity-25 saturate-0 cursor-not-allowed" : "hover:scale-105 hover:shadow-xl hover:ring-2 hover:ring-cyan active:scale-95 cursor-pointer"}`}
      >
        {e.noble && (
          <div className="absolute left-0 top-0 z-10 rounded-br-md bg-black/70 px-1 py-0.2 font-mono text-[7px] uppercase tracking-widest text-yellow-200">
            Noble
          </div>
        )}
        <div className="absolute right-1.5 top-1 font-mono text-[9px] opacity-80 text-white">{e.valence}e⁻</div>
        <div className="flex h-full flex-col justify-between">
          <div className="font-display text-2xl font-bold text-white drop-shadow sm:text-3xl">{e.symbol}</div>
          <div className="font-mono text-[9px] uppercase tracking-wider text-white/90 truncate">{e.name}</div>
        </div>
      </button>

      {hover && !disabled && (
        <div className={`pointer-events-none hidden sm:block absolute z-[100] ${posClass} w-72 rounded-xl border border-cyan/50 bg-slate-950/98 p-2.5 text-xs shadow-[0_0_30px_rgba(6,182,212,0.45)] backdrop-blur animate-fade-in`}>
          <div className="flex items-center justify-between gap-2 mb-1.5 pb-1 border-b border-slate-800">
            <div>
              <div className="font-display text-sm font-bold text-white flex items-center gap-1.5">
                <span>{e.name}</span>
                <span className="font-mono text-xs text-slate-400">({e.symbol})</span>
              </div>
              <div className={`font-mono text-[10px] ${e.noble ? "text-amber-300 font-bold" : "text-cyan"}`}>
                {e.noble
                  ? `⚠ Inert Noble Gas (8/8 Full)`
                  : ["Na", "Mg"].includes(symbol)
                  ? `⚡ Metal Donor (Donates ${e.valence}e⁻)`
                  : `🔴 ${e.valence}/${symbol === "H" ? "2" : "8"} e⁻ · ${symbol === "H" ? 2 - e.valence : 8 - e.valence} open seat${symbol === "H" ? "" : "s"} (Max: ${symbol === "H" ? "2" : "8"})`}
              </div>
            </div>
            <div className="shrink-0">
              <BohrAtomVisualizer symbol={symbol} size="xs" showEmptySeats={true} />
            </div>
          </div>

          <div className="rounded bg-slate-900/90 border border-slate-800 p-1.5 mb-1 text-[10px] font-mono leading-relaxed">
            {e.noble ? (
              <span className="text-amber-300">Outer shell has all 8 electrons (already full & stable). Does not bond!</span>
            ) : ["Na", "Mg"].includes(symbol) ? (
              <span className="text-amber-200">Surrenders its {e.valence} outer electron{e.valence > 1 ? "s" : ""} to help nonmetals reach a stable 8!</span>
            ) : (
              <div className="space-y-0.5">
                <span className="text-cyan-200 block">
                  Starts with <strong>{e.valence} e⁻</strong>. Needs <strong>{symbol === "H" ? 2 - e.valence : 8 - e.valence} e⁻</strong> (Max: {symbol === "H" ? "2" : "8"}).
                </span>
                <span className="text-emerald-300 block font-bold text-[9.5px]">
                  🤝 Share Rule: Shares exactly {symbol === "H" ? 2 - e.valence : 8 - e.valence} e⁻ {symbol !== "H" && e.valence > (8 - e.valence) ? `(keeps ${e.valence - (8 - e.valence)} unshared)` : ""} to reach {symbol === "H" ? "2" : "8"}!
                </span>
              </div>
            )}
          </div>

          <div className="text-slate-300 text-[10px] leading-relaxed font-sans">{e.fact}</div>
        </div>
      )}
    </div>
  );
}
