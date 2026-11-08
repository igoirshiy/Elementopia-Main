import { DOMAINS } from "@/features/resonance-puzzle/lib/game-data";
import { Trophy, AlertCircle, Clock, ArrowLeft, RotateCcw } from "lucide-react";
import MasteryService from "../services/MasteryService";
import { useEffect, useState } from "react";
import { loadProgress, fetchProgress } from "@/features/mastery-dashboard/lib/progress";

function fmtTime(s) {
  if (typeof s !== "number" || isNaN(s) || s < 0) return "—";
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const ss = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${ss}`;
}

export function Dashboard({ nickname, rows: propRows, onRefresh, onBack }) {
  const [cloudMetrics, setCloudMetrics] = useState(null);
  const [rows, setRows] = useState(propRows || []);
  const [progress, setProgress] = useState(loadProgress());
  const [isRefreshing, setIsRefreshing] = useState(false);

  const [pretest, setPretest] = useState(() => {
    try {
      const stored = localStorage.getItem(`elementopia_pretest_${nickname || 'guest'}`);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (propRows && propRows.length > 0) {
      setRows(propRows);
    }
  }, [propRows]);

  const reloadData = async () => {
    try {
      const stored = localStorage.getItem(`elementopia_pretest_${nickname || 'guest'}`);
      if (stored) setPretest(JSON.parse(stored));
    } catch (e) {
      console.warn("Could not read pretest locally:", e);
    }
    if (!nickname || nickname === "Guest Alchemist") return;
    setIsRefreshing(true);
    try {
      const pRows = await fetchProgress(nickname);
      setRows(pRows);
      setProgress(loadProgress());

      const data = await MasteryService.getPersonalProficiencyMap(nickname);
      if (data && data.success && data.metrics) {
        const map = new Map(data.metrics.map(m => [m.domainName, m]));
        setCloudMetrics(map);
      } else {
        setCloudMetrics(null);
      }
    } catch (err) {
      console.warn("Could not reload mastery analytics:", err);
    }
    setIsRefreshing(false);
  };

  useEffect(() => {
    void reloadData();

    const h = () => void reloadData();
    window.addEventListener("elementopia:progress", h);
    window.addEventListener("elementopia:user-changed", h);
    window.addEventListener("focus", h);

    return () => {
      window.removeEventListener("elementopia:progress", h);
      window.removeEventListener("elementopia:user-changed", h);
      window.removeEventListener("focus", h);
    };
  }, [nickname]);

  const byDomain = new Map(rows.map(r => [r.domain, r]));
  const completedCount = DOMAINS.filter(d =>
    progress?.clearedDomains?.includes(d.id) || byDomain.get(d.id)?.completed || cloudMetrics?.has(d.id)
  ).length;

  const totalAttempts = rows.reduce((a, r) => a + (r.attempts || 0), 0);
  const totalCorrect = rows.reduce((a, r) => a + (r.correct || 0), 0);

  let overallAcc = 0;
  if (totalAttempts > 0) {
    overallAcc = Math.min(100, Math.round((totalCorrect / totalAttempts) * 100));
  } else if (cloudMetrics && cloudMetrics.size > 0) {
    const cloudAccs = Array.from(cloudMetrics.values())
      .map(m => m.averageAccuracyPercentage ?? m.accuracyPercentage)
      .filter(v => typeof v === "number" && !isNaN(v));
    if (cloudAccs.length > 0) {
      overallAcc = Math.min(100, Math.round(cloudAccs.reduce((a, b) => a + b, 0) / cloudAccs.length));
    }
  }

  const totalTimeSeconds = rows.reduce((a, r) => a + (r.time_seconds || 0), 0) ||
    (cloudMetrics ? Array.from(cloudMetrics.values()).reduce((a, m) => a + (m.averageSpeedSeconds ?? m.speedSeconds ?? 0), 0) : 0);

  const preScore = pretest?.percentage ?? null;
  let learningGain = null;
  let gainCategory = null;

  if (preScore !== null && overallAcc > 0) {
    if (preScore >= 100) {
      learningGain = 1.0;
      gainCategory = "Mastery Maintained";
    } else {
      const g = (overallAcc - preScore) / (100 - preScore);
      learningGain = Math.round(g * 100) / 100;

      if (learningGain >= 0.70) {
        gainCategory = "High Learning Gain (g ≥ 0.70)";
      } else if (learningGain >= 0.30) {
        gainCategory = "Medium-to-High Gain (0.30 ≤ g < 0.70)";
      } else if (learningGain >= 0) {
        gainCategory = "Emerging Learning Gain (g < 0.30)";
      } else {
        gainCategory = "Baseline Needs Review";
      }
    }
  }

  return (
    <div className="mx-auto max-w-[1400px] w-full px-4 sm:px-8 md:px-16 lg:px-24 py-6 sm:py-12">
      <div className="mb-6 flex flex-wrap items-center justify-between gap-4">
        <div>
          <div className="mb-1 font-mono text-[10px] sm:text-xs uppercase tracking-[0.3em] text-muted-foreground">Mastery Dashboard</div>
          <h2 className="font-pixel text-xl sm:text-2xl font-bold text-glow-magenta">{nickname}</h2>
        </div>
        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => { void reloadData(); if (onRefresh) onRefresh(); }}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-mono transition-all cursor-pointer disabled:opacity-50"
            title="Refresh stats from cloud"
          >
            <RotateCcw className={`size-3.5 ${isRefreshing ? "animate-spin text-cyan" : ""}`} />
            <span>{isRefreshing ? "Syncing..." : "Sync"}</span>
          </button>
          {onBack && (
            <button
              type="button"
              onClick={onBack}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-800/80 hover:bg-slate-700 border border-slate-600/60 text-white text-xs font-mono transition-all cursor-pointer"
            >
              <ArrowLeft className="size-3.5" />
              <span>Back to Hub</span>
            </button>
          )}
        </div>
      </div>

      {pretest && (
        <div className="mb-6 rounded-2xl border border-cyan/40 bg-slate-950/80 p-5 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-1 rounded-lg bg-cyan/20 border border-cyan/40 font-mono text-[10px] font-bold text-cyan uppercase tracking-wider">
                Hake's Normalized Gain (g)
              </span>
              <span className="font-mono text-xs text-slate-400">
                Cognitive Growth Baseline
              </span>
            </div>
            {learningGain !== null && (
              <span className={`font-mono text-xs font-bold px-3 py-1 rounded-full border ${learningGain >= 0.30
                ? "bg-emerald-500/20 border-emerald-400 text-emerald-300"
                : "bg-amber-500/20 border-amber-400 text-amber-300"
                }`}>
                {gainCategory}
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-center font-mono">
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Pre-Test Baseline</div>
              <div className="text-xl font-bold text-cyan mt-0.5">{preScore}%</div>
              <div className="text-[9px] text-slate-500">({pretest.score}/{pretest.total} Correct)</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Current In-Game</div>
              <div className="text-xl font-bold text-emerald-400 mt-0.5">{overallAcc}%</div>
              <div className="text-[9px] text-slate-500">Applied Synthesis</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-slate-800">
              <div className="text-[10px] text-slate-400 uppercase">Knowledge Delta (Δ)</div>
              <div className={`text-xl font-bold mt-0.5 ${overallAcc >= preScore ? "text-emerald-400" : "text-rose-400"}`}>
                {overallAcc >= preScore ? `+${overallAcc - preScore}%` : `${overallAcc - preScore}%`}
              </div>
              <div className="text-[9px] text-slate-500">Absolute Increase</div>
            </div>
            <div className="p-3 rounded-xl bg-slate-900/90 border border-cyan/30 bg-cyan/5">
              <div className="text-[10px] text-cyan uppercase font-bold">Hake's Gain (g)</div>
              <div className="text-xl font-bold text-glow-cyan mt-0.5">
                {learningGain !== null ? (learningGain > 0 ? `+${learningGain}` : `${learningGain}`) : "—"}
              </div>
              <div className="text-[9px] text-cyan/70 font-sans">Formula: (Post - Pre) / (100 - Pre)</div>
            </div>
          </div>

          {pretest.answers && (
            <div className="mt-3.5 pt-3 border-t border-slate-800/80 text-xs font-mono flex flex-wrap gap-2 items-center text-slate-300">
              <span className="text-amber-400 font-bold">Remedial Focus:</span>
              {pretest.answers['q1'] !== 'b' && (
                <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-200 text-[11px]">
                  Domain 1: Covalent Electron Sharing
                </span>
              )}
              {pretest.answers['q2'] !== 'c' && (
                <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-200 text-[11px]">
                  Domain 3: Carbon Tetravalence Octet
                </span>
              )}
              {pretest.answers['q3'] !== 'a' && (
                <span className="px-2 py-0.5 rounded bg-amber-500/10 border border-amber-500/30 text-amber-200 text-[11px]">
                  Domain 2: Ionic Electron Transfer
                </span>
              )}
              {pretest.answers['q1'] === 'b' && pretest.answers['q2'] === 'c' && pretest.answers['q3'] === 'a' && (
                <span className="text-emerald-400 text-[11px]">
                  All foundational diagnostic competencies cleared. Ready for advanced synthesis challenges!
                </span>
              )}
            </div>
          )}
        </div>
      )}

      <div className="mb-6 grid gap-3 sm:grid-cols-3">
        <BigStat icon={<Trophy className="size-5" />} label="Domains cleared" value={`${completedCount}/${DOMAINS.length}`} accent="magenta" />
        <BigStat icon={<AlertCircle className="size-5" />} label="Overall accuracy" value={`${overallAcc}%`} accent="cyan" tone={overallAcc < 50 && totalAttempts > 0 ? "warn" : "ok"} />
        <BigStat icon={<Clock className="size-5" />} label="Total time" value={fmtTime(totalTimeSeconds)} accent="violet" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {DOMAINS.map(d => {
          const r = byDomain.get(d.id);
          const cloud = cloudMetrics?.get(d.id);
          const attempts = r?.attempts ?? 0;
          const correct = r?.correct ?? 0;

          const cloudAcc = cloud?.averageAccuracyPercentage ?? cloud?.accuracyPercentage;
          const cloudSpeed = cloud?.averageSpeedSeconds ?? cloud?.speedSeconds;
          const hasCloudData = cloudAcc != null && !isNaN(cloudAcc);

          let acc = null;
          let time = null;

          if (attempts > 0) {
            acc = Math.min(100, Math.round((correct / attempts) * 100));
            time = r?.time_seconds ?? (hasCloudData && cloudSpeed ? Math.round(cloudSpeed) : null);
          } else if (hasCloudData) {
            acc = Math.min(100, Math.round(cloudAcc));
            time = (cloudSpeed != null && !isNaN(cloudSpeed)) ? Math.round(cloudSpeed) : null;
          }

          const isCleared = progress?.clearedDomains?.includes(d.id) || r?.completed;
          const isStarted = isCleared || attempts > 0 || hasCloudData;
          const displayAttempts = attempts > 0 ? attempts : (hasCloudData ? 1 : 0);
          const lowAcc = acc !== null && acc < 60;
          return (
            <div key={d.id} className="flex flex-col rounded-2xl border border-border bg-card/70 p-5 transition-transform hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-start justify-between gap-3 mb-6">
                <div>
                  <div className="font-pixel text-sm sm:text-base font-bold">{d.name}</div>
                  <div className="font-mono text-[11px] text-muted-foreground mt-2 line-clamp-2">{d.tagline}</div>
                </div>
                <div className="shrink-0">
                  {isCleared ? (
                    <span className="rounded-md bg-success/15 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-success border border-success/30">Cleared</span>
                  ) : isStarted ? (
                    <span className="rounded-md bg-violet/15 px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-violet border border-violet/30">In progress</span>
                  ) : (
                    <span className="rounded-md bg-muted px-2 py-1 font-mono text-[10px] uppercase tracking-wider text-muted-foreground border border-border/50">Not started</span>
                  )}
                </div>
              </div>
              <div className="mt-auto grid grid-cols-2 gap-2">
                <Mini label="Accuracy" value={acc === null ? "—" : `${acc}%`} warn={lowAcc} />
                <Mini label="Attempts" value={`${displayAttempts}`} />
                <Mini label="Time" value={time !== null ? fmtTime(time) : "—"} />
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
