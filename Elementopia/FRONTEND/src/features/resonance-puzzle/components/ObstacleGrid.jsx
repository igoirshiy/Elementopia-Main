import React, { useMemo } from "react";

export function ObstacleGrid({ total, cleared, shake, glow, justCleared = 0 }) {
  const shufflePattern = useMemo(() => {
    const scatter24 = [
      0, 5, 7, 10, 13, 16, 18, 23,
      1, 4, 6, 11, 12, 17, 19, 22,
      2, 3, 8, 9, 14, 15, 20, 21
    ];
    if (total === 24) return scatter24;

    const cols = 6;
    const rows = Math.ceil(total / cols);
    const pattern = [];
    for (let colGroup = 0; colGroup < cols; colGroup++) {
      for (let r = 0; r < rows; r++) {
        const idx = r * cols + ((r + colGroup) % cols);
        if (idx < total && !pattern.includes(idx)) pattern.push(idx);
      }
    }
    for (let i = 0; i < total; i++) {
      if (!pattern.includes(i)) pattern.push(i);
    }
    return pattern;
  }, [total]);

  const brokenSet = useMemo(() => {
    const broken = new Set();
    for (let rank = 0; rank < cleared; rank++) {
      broken.add(shufflePattern[rank]);
    }
    return broken;
  }, [cleared, shufflePattern]);

  const newlyFrom = cleared - justCleared;
  const justBrokenSet = useMemo(() => {
    const justBroken = new Set();
    for (let rank = newlyFrom; rank < cleared; rank++) {
      justBroken.add(shufflePattern[rank]);
    }
    return justBroken;
  }, [cleared, newlyFrom, shufflePattern]);

  const rows = Math.ceil(total / 6);

  return (
    <div 
      style={{ gridTemplateRows: `repeat(${rows}, minmax(0, 1fr))` }}
      className={`relative grid grid-cols-6 gap-1 sm:gap-1.5 h-[360px] sm:h-[400px] w-full rounded-2xl border border-purple-500/30 bg-slate-950/80 p-2.5 sm:p-3 shadow-[0_0_20px_rgba(168,85,247,0.15)] ${shake ? "animate-shake" : ""}`}
    >
      {Array.from({ length: total }).map((_, i) => {
        const gone = brokenSet.has(i);
        const justGone = justBrokenSet.has(i);
        const stagger = justGone ? (i % 6) * 60 : 0;

        return (
          <div
            key={i}
            style={justGone ? { animationDelay: `${stagger}ms` } : undefined}
            className={`w-full h-full rounded-md transition-all ${gone
              ? "animate-disintegrate bg-transparent opacity-0 scale-75"
              : `relative bg-gradient-to-br from-fuchsia-500/70 to-violet-700/70 shadow-[0_0_12px_oklch(0.72_0.28_340/0.4)] border border-fuchsia-300/20 ${glow ? "animate-pulse-glow" : ""}`
              }`}
          />
        );
      })}
    </div>
  );
}
