import { useState } from "react";
import { Beaker } from "lucide-react";

export function NicknameGate({ onSubmit }) {
  const [name, setName] = useState("");
  const handleSubmit = (e) => {
    e.preventDefault();
    const v = name.trim();
    if (v.length >= 2) onSubmit(v);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 grid-bg scan-lines">
      <div className="absolute inset-0 bg-background/70 backdrop-blur-sm" />
      <div className="relative w-full max-w-md rounded-2xl border border-border/60 bg-card/95 px-8 py-10 shadow-2xl animate-fade-up">
        <div className="mb-6 flex items-center gap-4">
          <div className="rounded-xl bg-gradient-magenta p-2.5 glow-magenta">
            <Beaker className="size-6 text-primary-foreground" />
          </div>
          <div>
            <div className="text-[10px] uppercase tracking-[0.3em] text-muted-foreground">Elementopia</div>
            <div className="font-display text-2xl font-bold text-glow-magenta leading-none mt-1">Elemental Resonance</div>
          </div>
        </div>
        <p className="mb-8 font-mono text-xs leading-relaxed text-muted-foreground/80">
          Enter a session nickname. Your progress, accuracy, and timing will sync across any device.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. atomspark"
            maxLength={32}
            className="w-full rounded-lg border border-border/80 bg-input px-4 py-3 font-mono text-base text-foreground outline-none transition focus:border-muted-foreground/50"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="mt-6 w-full rounded-lg bg-gradient-magenta px-4 py-3 font-display font-medium text-primary-foreground transition hover:opacity-90"
          >
            Begin Session →
          </button>
        </form>
      </div>
    </div>
  );
}
