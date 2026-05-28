const accentMap = {
  cyan:    "bg-gradient-cyan glow-cyan",
  magenta: "bg-gradient-magenta glow-magenta",
  violet:  "bg-gradient-violet glow-violet",
  forge:   "bg-gradient-forge glow-magenta",
};

export function StoryCard({ domain, onEnter, onCancel }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-background/85 backdrop-blur-md grid-bg" />
      <div className="relative w-full max-w-2xl rounded-3xl border border-border bg-card/95 p-8 sm:p-10 shadow-2xl animate-fade-up">
        <button
          onClick={onCancel}
          style={{ width: '26px', height: '26px', minWidth: '26px', minHeight: '26px', padding: 0 }}
          className="absolute -top-3 -right-3 flex items-center justify-center rounded-full bg-gradient-to-br from-[#a855f7] to-[#ec4899] text-white shadow-[0_0_15px_rgba(236,72,153,0.4)] transition-all hover:scale-110 hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] z-10 font-sans leading-none"
        >
          <span className="text-[16px] font-bold pb-[2px]">&times;</span>
        </button>
        <div className={`mb-6 inline-flex rounded-xl ${accentMap[domain.accent]} px-3 py-1 text-xs font-mono uppercase tracking-[0.25em] text-primary-foreground`}>
          Domain Brief
        </div>
        <h2 className="font-pixel text-2xl font-bold sm:text-4xl text-glow-magenta">{domain.name}</h2>
        <p className="mt-2 font-mono text-sm text-cyan">{domain.tagline}</p>
        <p className="mt-6 text-sm leading-relaxed text-muted-foreground/80">{domain.story}</p>
        <div className="mt-8 flex items-center justify-between gap-4 border-t border-border pt-6">
          <div className="font-mono text-xs text-muted-foreground">
            Objective: synthesize 3 valid compounds to clear the obstacle.
          </div>
          <button
            onClick={onEnter}
            className="rounded-full bg-gradient-to-br from-[#a855f7] to-[#ec4899] px-6 py-2.5 font-['Montserrat',sans-serif] font-[800] text-[0.85rem] text-white shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] uppercase tracking-wider whitespace-nowrap"
          >
            Enter Domain
          </button>
        </div>
      </div>
    </div>
  );
}
