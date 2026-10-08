import React, { useEffect, useState } from "react";
import { Lock, Trophy, AlertCircle, Clock, Cloud } from "lucide-react";
import { DOMAINS } from "@/features/resonance-puzzle/lib/game-data";
import { loadProgress, fetchProgress } from "@/features/mastery-dashboard/lib/progress";
import UserService, { NicknameGate } from "@/features/auth-user";
import MasteryService from "../services/MasteryService";
import { useTour } from "@/features/tutorial-tour";

// Mastery Helper Components
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

export function DashboardHub({ onPlayDomain, onOpenMastery }) {
  const [progress, setProgress] = useState(loadProgress());
  const [rows, setRows] = useState([]);
  const [cloudMetrics, setCloudMetrics] = useState(null);
  const [showNicknameGate, setShowNicknameGate] = useState(() => !localStorage.getItem("elementopia_current_user"));
  const navigate = useNavigate();
  const { hasCompleted, startTour } = useTour();

  useEffect(() => {
    if (!showNicknameGate && !hasCompleted) {
      const timer = setTimeout(() => {
        startTour(0);
      }, 700);
      return () => clearTimeout(timer);
    }
  }, [showNicknameGate, hasCompleted, startTour]);

  useEffect(() => {
    const reloadData = async () => {
      let localUser = null;
      try {
        const userStr = localStorage.getItem("elementopia_current_user");
        if (userStr) localUser = JSON.parse(userStr);
      } catch (e) { }

      const nick = localUser?.username || progress.nickname;
      if (nick && nick !== "Guest Alchemist") {
        const pRows = await fetchProgress(nick);
        setRows(pRows);
        setProgress(loadProgress());

        MasteryService.getPersonalProficiencyMap(nick).then(data => {
          if (data && data.success && data.metrics) {
            const map = new Map(data.metrics.map(m => [m.domainName, m]));
            setCloudMetrics(map);
          } else {
            setCloudMetrics(null);
          }
        }).catch(() => setCloudMetrics(null));
      } else {
        setRows([]);
        setCloudMetrics(null);
        setProgress(loadProgress());
      }
    };

    void reloadData();

    const h = () => void reloadData();
    window.addEventListener("elementopia:progress", h);

    return () => window.removeEventListener("elementopia:progress", h);
  }, []);

  const handleNicknameSubmit = async (nickname) => {
    await UserService.loginUser(nickname, "guest");
    const freshRows = await fetchProgress(nickname);
    setRows(freshRows);
    setProgress(loadProgress());
    setShowNicknameGate(false);
  };

  const modules = [
    {
      title: "Periodic Matrix",
      dataTour: "tour-matrix",
      tag: "Interactive Table",
      desc: "Explore all 118 authentic elements with family filters, atomic coordinates, and deep structure analysis.",
      onClick: () => navigate("/student/matrix"),
      hue: "from-cyan to-indigo-500",
      glow: "shadow-[0_0_32px_rgba(6,182,212,0.4)]",
    },
    {
      title: "Dr. Atom's Workshop",
      dataTour: "tour-workshop",
      tag: "Interactive Academy",
      desc: "Learn atomic anatomy, Bohr models, periodic trends, and chemical bonding with Dr. Atom.",
      onClick: () => navigate("/student/workshop"),
      hue: "from-cyan to-magenta",
      glow: "shadow-[0_0_32px_rgba(6,182,212,0.4)]",
    },
    {
      title: "Compound Gallery",
      dataTour: "tour-gallery",
      tag: "Encyclopedia",
      desc: "Browse 50 real-world compounds, reveal molecular synthesis recipes, and learn scientific fun facts.",
      onClick: () => navigate("/student/gallery"),
      hue: "from-indigo-500 to-magenta",
      glow: "shadow-[0_0_32px_rgba(99,102,241,0.4)]",
    },
    {
      title: "Chemistry Sandbox",
      dataTour: "tour-sandbox",
      tag: "Simulation",
      desc: "Freely mix elements on the workbench to discover and catalog unique molecular compounds.",
      onClick: () => navigate("/student/Chem-Simulation"),
      hue: "from-magenta to-indigo-500",
      glow: "shadow-[0_0_32px_rgba(236,72,153,0.4)]",
    },
    {
      title: "Opponent Challenge",
      dataTour: "tour-challenge",
      tag: "Realtime 1v1",
      desc: "Generate a 5-digit code, share it, and race a friend to synthesize the target compound first.",
      onClick: () => navigate("/challenge"),
      hue: "from-magenta to-cyan",
      glow: "shadow-[0_0_32px_rgba(236,72,153,0.4)]",
    },
  ];

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

  // Mastery computations
  const byDomain = new Map(rows.map(r => [r.domain, r]));
  const completedCount = rows.filter(r => r.completed).length;
  const totalAttempts = rows.reduce((a, r) => a + r.attempts, 0);
  const totalCorrect = rows.reduce((a, r) => a + r.correct, 0);
  const overallAcc = totalAttempts ? Math.round((totalCorrect / totalAttempts) * 100) : 0;

  return (
    <main className="mx-auto max-w-[1400px] w-full px-8 md:px-16 lg:px-24 py-12">
      <div data-tour="tour-welcome" className="mb-10">
        <p className="font-mono text-xs text-muted-foreground tracking-[0.3em] uppercase">DASHBOARD</p>
        <h1 className="font-display text-4xl sm:text-5xl font-bold mt-2 text-white" style={{ textShadow: '0 0 20px rgba(236,72,153,0.3)' }}>
          Welcome back, {displayName}.
        </h1>
        <p className="text-muted-foreground mt-3 max-w-2xl text-[15px]">
          Choose a domain to start chemical resonance synthesis. All session data persists to your Mastery Dashboard.
        </p>
      </div>

      <div data-tour="tour-stats" className="mb-6 grid gap-3 sm:grid-cols-3">
        <BigStat icon={<Trophy className="size-5" />} label="Domains cleared" value={`${completedCount}/${DOMAINS.length}`} accent="magenta" />
        <BigStat icon={<AlertCircle className="size-5" />} label="Overall accuracy" value={`${overallAcc}%`} accent="cyan" tone={overallAcc < 50 && totalAttempts > 0 ? "warn" : "ok"} />
        <BigStat icon={<Clock className="size-5" />} label="Total time" value={fmtTime(rows.reduce((a, r) => a + r.time_seconds, 0))} accent="violet" />
      </div>

      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 mb-12">
        {DOMAINS.map(d => {
          const r = byDomain.get(d.id);
          const cloud = cloudMetrics?.get(d.id);
          const attempts = r?.attempts ?? 0;
          const correct = r?.correct ?? 0;

          let acc = null;
          let time = null;
          let isCloud = false;

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
            <div key={d.id} className="flex flex-col h-full rounded-2xl border border-border bg-card/70 p-6 transition-transform hover:-translate-y-1 hover:shadow-xl">
              <div className="flex items-start justify-between gap-3 mb-6">
                <div>
                  <div className="font-pixel text-sm sm:text-base font-bold text-white">{d.name}</div>
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

      <section className="mb-16">
        <h2 className="font-mono text-xs mb-4 text-white tracking-[0.2em]">INTERACTIVE MODULES</h2>
        <div className="grid gap-6" style={{ gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))' }}>
          {modules.map((m) => (
            <button
              key={m.title}
              data-tour={m.dataTour}
              onClick={m.onClick}
              className={`text-left flex flex-col h-full rounded-2xl border border-border/40 bg-card p-6 hover:-translate-y-1 transition group ${m.glow} cursor-pointer`}
            >
              <div className={`h-1.5 w-16 rounded-full bg-gradient-to-r ${m.hue} mb-5`} />
              <p className="font-mono text-[10px] text-muted-foreground mb-2 uppercase tracking-wider">
                {m.tag}
              </p>
              <h3 className="font-pixel text-sm sm:text-base font-bold mb-3 group-hover:text-glow-white text-white">
                {m.title}
              </h3>
              <p className="text-sm text-muted-foreground/80 leading-relaxed mb-6">{m.desc}</p>
              <span className="mt-auto self-end rounded-full bg-gradient-to-br from-indigo-500 to-magenta px-5 py-2 font-mono font-bold text-xs text-white shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] uppercase tracking-wider">
                Enter
              </span>
            </button>
          ))}
        </div>
      </section>

      <section id="domains-section" data-tour="tour-domains">
        <h2 className="font-mono text-xs mb-4 text-white tracking-[0.2em]">DOMAINS</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DOMAINS.map((d, i) => {
            const clearedDomains = progress?.clearedDomains || [];
            const sessions = progress?.sessions || [];
            const cleared = clearedDomains.includes(d.id);
            const prevId = DOMAINS[i - 1]?.id;
            const prevSession = sessions.find(s => s.domainId === prevId);
            const prevFullyCleared = clearedDomains.includes(prevId) && (prevSession?.stage >= 3 || prevSession?.cleared);
            const unlocked = i === 0 || prevFullyCleared;

            return (
              <button
                key={d.id}
                disabled={!unlocked}
                onClick={() => unlocked && onPlayDomain(d)}
                className={`group relative overflow-hidden flex flex-col h-full rounded-[24px] border border-border/40 bg-card p-6 text-left transition
                  ${unlocked ? "hover:-translate-y-1 hover:border-magenta/40 hover:shadow-2xl cursor-pointer" : "opacity-60 cursor-not-allowed"}`}
              >
                <div className={`absolute inset-x-0 top-0 h-[6px] ${d.accent === "cyan" ? "bg-gradient-cyan" :
                    d.accent === "magenta" ? "bg-gradient-magenta" :
                      d.accent === "violet" ? "bg-gradient-violet" : "bg-gradient-forge"
                  }`} />
                <div className="flex items-start justify-between">
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Domain {i + 1}</div>
                  {!unlocked && <Lock className="size-4 text-muted-foreground" />}
                  {cleared && <span className="rounded-md bg-success/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-success">Cleared</span>}
                </div>
                <h3 className="mt-5 font-pixel text-lg sm:text-xl font-bold text-white">{d.name}</h3>
                <p className="mt-2 font-mono text-xs text-cyan">{d.tagline}</p>
                <p className="mt-4 text-[15px] leading-relaxed text-muted-foreground/70 line-clamp-4">{d.story}</p>

              </button>
            );
          })}
        </div>
      </section>

    </main>
  );
}
