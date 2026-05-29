export function ObstacleGrid({ total, cleared, shake, glow, justCleared = 0 }) {
  const blocks = Array.from({ length: total });
  const newlyFrom = cleared - justCleared;
  return (
    <div
      className={`relative grid grid-cols-6 gap-1.5 rounded-2xl border border-border bg-card/50 p-3 ${shake ? "animate-shake" : ""}`}
    >
      {blocks.map((_, i) => {
        const gone = i < cleared;
        const justGone = gone && i >= newlyFrom;
        const stagger = justGone ? (i - newlyFrom) * 60 : 0;
        return (
          <div
            key={i}
            style={justGone ? { animationDelay: `${stagger}ms` } : undefined}
            className={`aspect-square w-full rounded-md transition-all ${
              gone
                ? "animate-disintegrate bg-transparent"
                : `relative bg-gradient-to-br from-fuchsia-500/70 to-violet-700/70 shadow-[0_0_12px_oklch(0.72_0.28_340/0.4)] border border-fuchsia-300/20 before:absolute before:inset-0 before:rounded-md before:bg-[repeating-linear-gradient(45deg,transparent_0,transparent_4px,oklch(1_0_0/0.08)_4px,oklch(1_0_0/0.08)_5px)] after:absolute after:inset-1 after:rounded-sm after:border after:border-white/10 ${glow ? "animate-pulse-glow" : ""}`
            }`}
          />
        );
      })}
    </div>
  );
}
