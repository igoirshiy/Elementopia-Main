import { DOMAINS } from "@/features/resonance-puzzle/lib/game-data";
import { Trophy, AlertCircle, Clock } from "lucide-react";

export function Dashboard({ nickname, rows }) {
  const byDomain = new Map(rows.map(r => [r.domain, r]));
  const completedCount = rows.filter(r => r.completed).length;
  const totalAttempts = rows.reduce((a, r) => a + r.attempts, 0);
  const totalCorrect = rows.reduce((a, r) => a + r.correct, 0);
  const overallAcc = totalAttempts ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  return (
    <div className="mx-auto max-w-[1600px] w-full px-6 py-8">
      <div className="mb-6">
        <div className="mb-1 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">Mastery Dashboard</div>
        <h2 className="font-display text-3xl font-bold text-glow-magenta">{nickname}</h2>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <BigStat icon={<Trophy className="size-5" />} label="Domains cleared" value={`${completedCount}/${DOMAINS.length}`} accent="magenta" />
        <BigStat icon={<AlertCircle className="size-5" />} label="Overall accuracy" value={`${overallAcc}%`} accent="cyan" tone={overallAcc < 50 && totalAttempts > 0 ? "warn" : "ok"} />
        <BigStat icon={<Clock className="size-5" />} label="Total time" value={fmtTime(rows.reduce((a, r) => a + r.time_seconds, 0))} accent="violet" />
      </div>

      <div className="space-y-3">
        {DOMAINS.map(d => {
          const r = byDomain.get(d.id);
          const attempts = r?.attempts ?? 0;
          const correct = r?.correct ?? 0;
          const acc = attempts ? Math.round((correct / attempts) * 100) : null;
          const lowAcc = acc !== null && acc < 60;
          return (
            <div key={d.id} className="rounded-2xl border border-border bg-card/70 p-4">
              <div className="flex flex-wrap items-center justify-between gap-3">
                <div>
                  <div className="font-display text-lg font-bold">{d.name}</div>
                  <div className="font-mono text-xs text-muted-foreground">{d.tagline}</div>
                </div>
                <div className="flex items-center gap-2">
                  {r?.completed ? (
                    <span className="rounded-md bg-success/15 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-success">Cleared</span>
                  ) : r ? (
                    <span className="rounded-md bg-violet/15 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-violet">In progress</span>
                  ) : (
                    <span className="rounded-md bg-muted px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground">Not started</span>
                  )}
                </div>
              </div>
              <div className="mt-3 grid grid-cols-2 gap-2 sm:grid-cols-4">
                <Mini label="Accuracy" value={acc === null ? "—" : `${acc}%`} warn={lowAcc} />
                <Mini label="Attempts" value={`${attempts}`} />
                <Mini label="Time" value={r ? fmtTime(r.time_seconds) : "—"} />
                <Mini label="Hazmat" value={`${r?.hazmat_activations ?? 0}×`} />
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function BigStat({ icon, label, value, accent, tone }) {
  const c = tone === "warn" ? "text-destructive" : accent === "magenta" ? "text-magenta" : accent === "cyan" ? "text-cyan" : "text-violet";
  return (
    <div className="rounded-2xl border border-border bg-card/70 p-4">
      <div className={`mb-1 flex items-center gap-2 ${c}`}>
        {icon}
        <span className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</span>
      </div>
      <div className={`font-display text-3xl font-bold ${c}`}>{value}</div>
    </div>
  );
}

function Mini({ label, value, warn }) {
  return (
    <div className="rounded-lg border border-border bg-background/40 p-2">
      <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`font-display text-lg font-bold ${warn ? "text-destructive" : "text-foreground"}`}>{value}</div>
    </div>
  );
}

function fmtTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const ss = (s % 60).toString().padStart(2, "0");
  return `${m}:${ss}`;
}
