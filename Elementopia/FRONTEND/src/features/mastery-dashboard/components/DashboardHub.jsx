import React, { useEffect, useState } from "react";
import { Lock, Trophy, AlertCircle, Clock, FlaskConical, RotateCcw, ArrowRight, Play, Sparkles } from "lucide-react";
import { DOMAINS } from "@/features/resonance-puzzle/lib/game-data";
import { loadProgress, fetchProgress } from "@/features/mastery-dashboard/lib/progress";
import UserService, { NicknameGate } from "@/features/auth-user";
import MasteryService from "../services/MasteryService";
import { useTour } from "@/features/tutorial-tour";
import { PreTestModal } from "@/features/resonance-puzzle/components/PreTestModal";
import { flushSyncQueue } from "../lib/OfflineSyncManager";

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
      <div className={`font-display text-base font-bold ${warn ? "text-destructive" : "text-foreground"}`}>{value}</div>
    </div>
  );
}

function fmtTime(s) {
  if (typeof s !== "number" || isNaN(s) || s < 0) return "—";
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const ss = Math.floor(s % 60).toString().padStart(2, "0");
  return `${m}:${ss}`;
}

export function DashboardHub({ onPlayDomain, nickname: propNickname, rows: propRows, onRefresh }) {
  const [progress, setProgress] = useState(loadProgress());
  const [rows, setRows] = useState(propRows || []);
  const [cloudMetrics, setCloudMetrics] = useState(null);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [showNicknameGate, setShowNicknameGate] = useState(() => !localStorage.getItem("elementopia_current_user"));
  const { hasCompleted, startTour } = useTour();
  const [showPreTest, setShowPreTest] = useState(false);
  const [pretestData, setPretestData] = useState(() => {
    try {
      let localUser = null;
      const userStr = localStorage.getItem("elementopia_current_user");
      if (userStr) localUser = JSON.parse(userStr);
      const nick = localUser?.username || "Alchemist";
      const stored = localStorage.getItem(`elementopia_pretest_${nick}`);
      return stored ? JSON.parse(stored) : null;
    } catch {
      return null;
    }
  });

  useEffect(() => {
    if (!showNicknameGate && !hasCompleted && !showPreTest) {
      const timer = setTimeout(() => {
        startTour(0);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [showNicknameGate, hasCompleted, showPreTest, startTour]);

  useEffect(() => {
    if (propRows && propRows.length > 0) {
      setRows(propRows);
    }
  }, [propRows]);

  const reloadData = async () => {
    setIsRefreshing(true);
    let localUser = null;
    try {
      const userStr = localStorage.getItem("elementopia_current_user");
      if (userStr) localUser = JSON.parse(userStr);
    } catch (e) { }

    const nick = propNickname || localUser?.username || progress.nickname;

    try {
      const stored = localStorage.getItem(`elementopia_pretest_${nick || 'guest'}`);
      if (stored) setPretestData(JSON.parse(stored));
    } catch (e) { }

    if (nick && nick !== "Guest Alchemist") {
      try {
        const pRows = await fetchProgress(nick);
        setRows(pRows);
        setProgress(loadProgress());

        const data = await MasteryService.getPersonalProficiencyMap(nick);
        if (data && data.success && data.metrics) {
          const map = new Map(data.metrics.map(m => [m.domainName, m]));
          setCloudMetrics(map);
        } else {
          setCloudMetrics(null);
        }
      } catch (err) {
        console.warn("Could not reload dashboard metrics:", err);
      }
    } else {
      setRows(propRows || []);
      setCloudMetrics(null);
      setProgress(loadProgress());
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
  }, [propNickname]);

  const handleNicknameSubmit = async (nickname) => {
    await UserService.loginUser(nickname, "guest");
    const freshRows = await fetchProgress(nickname);
    setRows(freshRows);
    setProgress(loadProgress());
    setShowNicknameGate(false);

    MasteryService.getPersonalProficiencyMap(nickname).then(data => {
      if (data && data.success && data.metrics) {
        const map = new Map(data.metrics.map(m => [m.domainName, m]));
        setCloudMetrics(map);
      }
    }).catch(() => { });

    if (onRefresh) onRefresh();
    window.dispatchEvent(new CustomEvent("elementopia:user-changed", { detail: { username: nickname } }));
    window.dispatchEvent(new Event("elementopia:progress"));

    try {
      const stored = localStorage.getItem(`elementopia_pretest_${nickname}`);
      if (stored) {
        setPretestData(JSON.parse(stored));
      } else {
        setShowPreTest(true);
      }
    } catch { }
  };

  useEffect(() => {
    if (!showNicknameGate) {
      let localUser = null;
      try {
        const userStr = localStorage.getItem("elementopia_current_user");
        if (userStr) localUser = JSON.parse(userStr);
      } catch { }
      const nick = localUser?.username || progress.nickname;
      if (nick && nick !== "Guest Alchemist") {
        try {
          const stored = localStorage.getItem(`elementopia_pretest_${nick}`);
          if (stored) {
            setPretestData(JSON.parse(stored));
          } else {
            setShowPreTest(true);
          }
        } catch { }
      }
    }
  }, [showNicknameGate, progress.nickname]);

  if (showNicknameGate) {
    return (
      <div className="elementopia-scope relative z-[100]">
        <NicknameGate onSubmit={handleNicknameSubmit} />
      </div>
    );
  }

  let localUser = null;
  try {
    const userStr = localStorage.getItem("elementopia_current_user");
    if (userStr) localUser = JSON.parse(userStr);
  } catch (e) { }

  const displayName = localUser?.username && localUser.username !== "Guest Alchemist"
    ? localUser.username
    : (progress.nickname && progress.nickname !== "Guest Alchemist" ? progress.nickname : "Alchemist");

  const byDomain = new Map(rows.map(r => [r.domain, r]));
  const completedCount = DOMAINS.filter(d => {
    const isLocalCleared = Boolean(progress?.clearedDomains?.includes(d.id));
    const isRowCleared = Boolean(byDomain.get(d.id)?.completed);
    const cloudEntry = cloudMetrics?.get(d.id);
    const isCloudCleared = Boolean(cloudEntry?.completed || cloudEntry?.cleared);
    return isLocalCleared || isRowCleared || isCloudCleared;
  }).length;

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

  const preScore = pretestData?.percentage ?? null;
  let learningGain = null;
  let gainCategory = null;

  if (preScore !== null && overallAcc > 0) {
    if (preScore >= 100) {
      learningGain = 1.0;
      gainCategory = "Complete Mastery (100%)";
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
    <main className="mx-auto max-w-[1400px] w-full px-4 sm:px-8 md:px-16 lg:px-24 py-6 sm:py-      10">
      <div data-tour="tour-welcome" className="mb-6">
        <div className="flex items-center justify-between">
          <p className="font-mono text-[10px] sm:text-xs text-muted-foreground tracking-[0.3em] uppercase">
            UNIFIED MASTERY HUB
          </p>
          <button
            type="button"
            onClick={async () => {
              await flushSyncQueue();
              void reloadData();
              if (onRefresh) onRefresh();
            }}
            disabled={isRefreshing}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-900/60 hover:bg-slate-800 border border-slate-700/60 text-slate-300 hover:text-white text-xs font-mono transition cursor-pointer disabled:opacity-50"
            title="Sync with cloud"
          >
            <RotateCcw className={`size-3.5 ${isRefreshing ? "animate-spin text-cyan" : ""}`} />
            <span>{isRefreshing ? "Syncing..." : "Sync"}</span>
          </button>
        </div>

        <h1 className="font-display text-2xl sm:text-4xl md:text-5xl font-bold mt-2 text-white" style={{ textShadow: '0 0 20px rgba(236,72,153,0.3)' }}>
          Welcome back, {displayName}.
        </h1>
        <p className="text-muted-foreground mt-2 w-full text-xs sm:text-sm leading-relaxed">
          Select a domain cavern below to synthesize target compounds. Real-time telemetry evaluates your applied chemistry mastery.
        </p>

        <div className="mt-4 flex flex-wrap items-center gap-3">
          {pretestData ? (
            <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl bg-cyan/15 border border-cyan/40 text-cyan font-mono text-xs shadow-sm">
              <FlaskConical className="size-4 text-cyan" />
              <span>Pre-Test Diagnostic: <strong>{pretestData.score}/{pretestData.total} ({pretestData.percentage}%)</strong></span>
              <button
                type="button"
                onClick={() => setShowPreTest(true)}
                className="ml-2 text-[10px] text-slate-300 hover:text-white underline underline-offset-2 cursor-pointer font-bold"
              >
                Review Scorecard
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => setShowPreTest(true)}
              className="inline-flex items-center gap-2 px-3.5 py-2 rounded-xl bg-gradient-to-r from-cyan/20 to-indigo-500/20 border border-cyan/40 hover:border-cyan text-cyan text-xs font-mono font-bold transition shadow-[0_0_15px_rgba(6,182,212,0.25)] hover:shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer"
            >
              <FlaskConical className="size-4 animate-pulse text-cyan" />
              <span>Take Pre-Game Diagnostic (Pre-Test)</span>
            </button>
          )}
        </div>
      </div>

      {pretestData && (
        <div className="mb-6 rounded-2xl border border-cyan/40 bg-slate-950/80 p-4 sm:p-5 shadow-[0_0_30px_rgba(6,182,212,0.15)]">
          <div className="flex flex-wrap items-center justify-between gap-3 mb-3">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs text-slate-400">
                Cognitive Growth Trajectory
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
              <div className="text-[9px] text-slate-500">({pretestData.score}/{pretestData.total} Correct)</div>
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
        </div>
      )}

      <div data-tour="tour-stats" className="mb-8 grid gap-3 sm:grid-cols-3">
        <BigStat icon={<Trophy className="size-5" />} label="Domains cleared" value={`${completedCount}/${DOMAINS.length}`} accent="magenta" />
        <BigStat icon={<AlertCircle className="size-5" />} label="Overall accuracy" value={`${overallAcc}%`} accent="cyan" tone={overallAcc < 50 && totalAttempts > 0 ? "warn" : "ok"} />
        <BigStat icon={<Clock className="size-5" />} label="Total time" value={fmtTime(totalTimeSeconds)} accent="violet" />
      </div>

      <section id="domains-section" data-tour="tour-domains">
        <div className="flex items-center justify-between mb-4">
          <h2 className="font-mono text-xs text-white tracking-[0.2em] uppercase font-bold">
            ELEMENTAL RESONANCE CAVERNS
          </h2>
          <span className="font-mono text-[10px] text-slate-400">
            Clear prerequisite chambers to unlock advanced domains
          </span>
        </div>

        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DOMAINS.map((d, i) => {
            const clearedDomains = progress?.clearedDomains || [];
            const isCleared = clearedDomains.includes(d.id) || byDomain.get(d.id)?.completed;
            const prevId = DOMAINS[i - 1]?.id;
            const prevCleared = i === 0 || clearedDomains.includes(prevId) || byDomain.get(prevId)?.completed;
            const unlocked = i === 0 || prevCleared;

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
              time = (cloudSpeed != null && !isNaN(cloudSpeed)) ? Math.round(cloudSpeed) : (r?.time_seconds ?? null);
            }

            const isStarted = isCleared || attempts > 0 || hasCloudData;
            const displayAttempts = attempts > 0 ? attempts : (hasCloudData ? 1 : 0);
            const lowAcc = acc !== null && acc < 60;

            return (
              <div
                key={d.id}
                className={`group relative overflow-hidden flex flex-col justify-between rounded-[24px] border border-border/50 bg-card/80 p-6 transition-all ${unlocked ? "hover:-translate-y-1 hover:border-cyan/50 hover:shadow-2xl" : "opacity-60"
                  }`}
              >
                <div className={`absolute inset-x-0 top-0 h-[6px] ${d.accent === "cyan" ? "bg-gradient-cyan" :
                  d.accent === "magenta" ? "bg-gradient-magenta" :
                    d.accent === "violet" ? "bg-gradient-violet" : "bg-gradient-forge"
                  }`} />

                <div>
                  <div className="flex items-start justify-between gap-2">
                    <span className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground font-bold">
                      Domain {i + 1}
                    </span>
                    <div>
                      {isCleared ? (
                        <span className="rounded-md bg-success/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-success border border-success/30 font-bold">
                          Cleared
                        </span>
                      ) : isStarted ? (
                        <span className="rounded-md bg-violet/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-violet border border-violet/30 font-bold">
                          In progress
                        </span>
                      ) : (
                        <span className="rounded-md bg-muted px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-muted-foreground border border-border/50">
                          {unlocked ? "Available" : "Locked"}
                        </span>
                      )}
                    </div>
                  </div>

                  <h3 className="mt-3 font-pixel text-lg sm:text-xl font-bold text-white flex items-center gap-2">
                    {!unlocked && <Lock className="size-4 text-slate-500" />}
                    <span>{d.name}</span>
                  </h3>
                  <p className="mt-1 font-mono text-xs text-cyan line-clamp-1">{d.tagline}</p>
                  <p className="mt-3 text-xs sm:text-[13px] leading-relaxed text-muted-foreground/80 line-clamp-2">
                    {d.story}
                  </p>

                  <div className="mt-4 grid grid-cols-2 gap-2">
                    <Mini label="Accuracy" value={acc === null ? "—" : `${acc}%`} warn={lowAcc} />
                    <Mini label="Attempts" value={`${displayAttempts}`} />
                    <Mini label="Time" value={time !== null ? fmtTime(time) : "—"} />
                    <Mini label="Hazmat" value={`${r?.hazmat_activations ?? 0}×`} />
                  </div>
                </div>

                <div className="mt-6 pt-4 border-t border-slate-800">
                  <button
                    type="button"
                    disabled={!unlocked}
                    onClick={() => unlocked && onPlayDomain(d)}
                    className={`w-full min-h-[46px] rounded-xl flex items-center justify-center gap-2 font-mono text-xs font-bold uppercase tracking-wider transition cursor-pointer ${unlocked
                      ? "bg-gradient-to-r from-cyan/20 to-blue-600/30 border border-cyan/50 text-cyan hover:bg-cyan hover:text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.2)]"
                      : "bg-slate-900 border border-slate-800 text-slate-600 cursor-not-allowed"
                      }`}
                  >
                    {unlocked ? (
                      <>
                        <span>{isCleared ? "Re-Enter Cavern" : (isStarted ? "Resume Synthesis" : "Enter Cavern")}</span>
                        <ArrowRight className="size-4" />
                      </>
                    ) : (
                      <>
                        <Lock className="size-3.5" />
                        <span>Chamber Sealed</span>
                      </>
                    )}
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {showPreTest && (
        <PreTestModal
          nickname={displayName}
          existingData={pretestData}
          onComplete={(res) => {
            setPretestData(res);
            setShowPreTest(false);
          }}
          onCancel={() => setShowPreTest(false)}
        />
      )}

    </main>
  );
}