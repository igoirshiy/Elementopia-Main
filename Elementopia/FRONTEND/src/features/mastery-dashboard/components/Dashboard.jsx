import { DOMAINS } from "@/features/resonance-puzzle/lib/game-data";
import { Trophy, AlertCircle, Clock, Cloud } from "lucide-react";
import MasteryService from "../services/MasteryService";
import { useEffect, useState } from "react";

export function Dashboard({ nickname, rows }) {
  const [cloudMetrics, setCloudMetrics] = useState(null);

  useEffect(() => {
    if (nickname) {
      MasteryService.getPersonalProficiencyMap(nickname).then(data => {
        if (data && data.success && data.metrics) {
          const map = new Map(data.metrics.map(m => [m.domainName, m]));
          setCloudMetrics(map);
        }
      });
    }
  }, [nickname]);

  const byDomain = new Map(rows.map(r => [r.domain, r]));
  const completedCount = rows.filter(r => r.completed).length;
  const totalAttempts = rows.reduce((a, r) => a + r.attempts, 0);
  const totalCorrect = rows.reduce((a, r) => a + r.correct, 0);
  const overallAcc = totalAttempts ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  return (
    <div className="mx-auto max-w-[1400px] w-full px-8 md:px-16 lg:px-24 py-12">
      <div className="mb-6">
        <div className="mb-1 font-mono text-xs uppercase tracking-[0.3em] text-muted-foreground">Mastery Dashboard</div>
        <h2 className="font-pixel text-xl sm:text-2xl font-bold text-glow-magenta">{nickname}</h2>
      </div>

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <BigStat icon={<Trophy className="size-5" />} label="Domains cleared" value={`${completedCount}/${DOMAINS.length}`} accent="magenta" />
        <BigStat icon={<AlertCircle className="size-5" />} label="Overall accuracy" value={`${overallAcc}%`} accent="cyan" tone={overallAcc < 50 && totalAttempts > 0 ? "warn" : "ok"} />
        <BigStat icon={<Clock className="size-5" />} label="Total time" value={fmtTime(rows.reduce((a, r) => a + r.time_seconds, 0))} accent="violet" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DOMAINS.map(d => {
          const r = byDomain.get(d.id);
          const cloud = cloudMetrics?.get(d.id);
          const attempts = r?.attempts ?? 0;
          const correct = r?.correct ?? 0;
          
          let acc = null;
          let time = null;
          let isCloud = false;

          // Prefer cloud telemetry data if available for this domain
          if (cloud) {
            acc = Math.round(cloud.accuracyPercentage);
            time = cloud.speedSeconds;
            isCloud = true;
          } else if (attempts) {
            acc = Math.round((correct / attempts) * 100);
            time = r?.time_seconds ?? null;
          }
          const lowAcc = acc !== null && acc < 60;
          return (
            <div key={d.id} className="flex flex-col rounded-2xl border border-border bg-card/70 p-5 transition-transform hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-start justify-between gap-3 mb-6">
                <div>
                  <div className="font-pixel text-sm sm:text-base font-bold">{d.name}</div>
                  <div className="font-mono text-[11px] text-muted-foreground mt-2 line-clamp-2">{d.tagline}</div>
                </div>
                <div className="shrink-0">
                  {r?.completed ? (
                    <span className="rounded-md bg-success/15 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-success border border-success/30">Cleared</span>
                  ) : r ? (
                    <span className="rounded-md bg-violet/15 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-violet border border-violet/30">In progress</span>
                  ) : (
                    <span className="rounded-md bg-muted px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground border border-border/50">Not started</span>
                  )}
                </div>
              </div>
              <div className="mt-auto grid grid-cols-2 gap-2">
                <Mini label="Accuracy" value={acc === null ? "—" : `${acc}%`} warn={lowAcc} />
                <Mini label="Attempts" value={`${attempts}`} />
                <Mini label="Time" value={time !== null ? fmtTime(time) : "—"} />
                <Mini label="Hazmat" value={`${r?.hazmat_activations ?? 0}×`} />
                <div className="col-span-2">
                  <Mini label="Data Source" value={isCloud ? <><Cloud className="size-3 text-cyan inline mr-1" />Cloud</> : "Local"} />
                </div>
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
