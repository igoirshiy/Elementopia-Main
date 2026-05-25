const accentMap = {
  cyan:    "bg-gradient-cyan glow-cyan",
  magenta: "bg-gradient-magenta glow-magenta",
  violet:  "bg-gradient-violet glow-violet",
  forge:   "bg-gradient-forge glow-magenta",
};

export function StoryCard({ domain, onEnter }) {
  return (
    <div className="fixed inset-0 z-40 flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-background/85 backdrop-blur-md grid-bg" />
      <div className="relative w-full max-w-2xl rounded-3xl border border-border bg-card/95 p-8 sm:p-10 shadow-2xl animate-fade-up">
        <div className={`mb-6 inline-flex rounded-xl ${accentMap[domain.accent]} px-3 py-1 text-xs font-mono uppercase tracking-[0.25em] text-primary-foreground`}>
          Domain Brief
        </div>
        <h2 className="font-display text-4xl font-bold sm:text-5xl text-glow-magenta">{domain.name}</h2>
        <p className="mt-2 font-mono text-sm text-cyan">{domain.tagline}</p>
        <p className="mt-6 text-base leading-relaxed text-muted-foreground sm:text-lg">{domain.story}</p>
        <div className="mt-8 flex items-center justify-between gap-4 border-t border-border pt-6">
          <div className="font-mono text-xs text-muted-foreground">
            Objective: synthesize 3 valid compounds to clear the obstacle.
          </div>
          <button
            onClick={onEnter}
            className="rounded-lg bg-gradient-magenta px-6 py-3 font-display font-semibold text-primary-foreground transition hover:opacity-90"
          >
            Enter Domain →
          </button>
        </div>
      </div>
    </div>
  );
}
