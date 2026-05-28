import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { Lock } from "lucide-react";
import { DOMAINS } from "@/features/resonance-puzzle/lib/game-data";
import { loadProgress, resetProgress } from "@/features/mastery-dashboard/lib/progress";
import UserService, { NicknameGate } from "@/features/auth-user";

export function DashboardHub({ onPlayDomain, onOpenMastery }) {
  const [progress, setProgress] = useState(loadProgress());
  const [showNicknameGate, setShowNicknameGate] = useState(() => !localStorage.getItem("elementopia_current_user"));
  const navigate = useNavigate();
  
  useEffect(() => {
    const h = () => setProgress(loadProgress());
    window.addEventListener("elementopia:progress", h);
    
    return () => window.removeEventListener("elementopia:progress", h);
  }, []);

  const handleNicknameSubmit = async (nickname) => {
    await UserService.loginUser(nickname, "guest");
    setShowNicknameGate(false);
  };

  const modules = [
    {
      title: "Chemistry Sandbox",
      tag: "Simulation",
      desc: "Freely mix elements on the workbench to discover and catalog unique molecular compounds.",
      onClick: () => navigate("/student/Chem-Simulation"),
      hue: "from-[oklch(0.7_0.32_0)] to-[oklch(0.65_0.28_320)]",
      glow: "shadow-[0_0_32px_oklch(0.7_0.32_0/0.4)]",
    },
    {
      title: "Mastery Dashboard",
      tag: "Assessment & Progress",
      desc: "Review accuracy, completion speed, and knowledge gaps across every Domain you've attempted.",
      onClick: onOpenMastery,
      hue: "from-[oklch(0.65_0.28_300)] to-[oklch(0.78_0.16_200)]",
      glow: "shadow-[0_0_32px_oklch(0.65_0.28_300/0.4)]",
    },
    {
      title: "Opponent Challenge",
      tag: "Realtime 1v1",
      desc: "Generate a 5-digit code, share it, and race a friend to synthesize the target compound first.",
      onClick: () => navigate("/challenge"),
      hue: "from-[oklch(0.88_0.18_95)] to-[oklch(0.7_0.32_0)]",
      glow: "shadow-[0_0_32px_oklch(0.88_0.18_95/0.4)]",
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
  } catch(e) {}
  
  const displayName = localUser?.username && localUser.username !== "Guest Alchemist" 
    ? localUser.username 
    : (progress.nickname && progress.nickname !== "Guest Alchemist" ? progress.nickname : "Alchemist");

  return (
    <main className="mx-auto max-w-[1400px] w-full px-8 md:px-16 lg:px-24 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4 mb-10">
        <div>
          <p className="font-mono text-xs text-muted-foreground tracking-[0.3em] uppercase">DASHBOARD</p>
          <h1 className="font-display text-4xl sm:text-5xl font-bold mt-2 text-white" style={{ textShadow: '0 0 20px rgba(236,72,153,0.3)' }}>
            Welcome back, {displayName}.
          </h1>
          <p className="text-muted-foreground mt-3 max-w-2xl text-[15px]">
            Choose a module. All session data persists locally to your Mastery Dashboard.
          </p>
        </div>
        <div className="flex flex-col items-end gap-5">
          <div className="flex gap-6 text-center">
            <Stat label="Cleared" value={progress.clearedDomains.length} />
            <Stat label="Sessions" value={progress.sessions.length} />
            <Stat label="Wins" value={progress.wins} accent />
          </div>
          <button 
            onClick={() => {
              if (window.confirm("Are you sure you want to reset all your progress?")) {
                resetProgress(progress.nickname);
              }
            }} 
            className="rounded-full bg-gradient-to-br from-[#a855f7] to-[#ec4899] px-5 py-2 font-['Montserrat',sans-serif] font-[800] text-[0.75rem] text-white shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] uppercase tracking-wider"
          >
            Reset Progress
          </button>
        </div>
      </div>

      <section className="grid md:grid-cols-3 gap-6 mb-12">
        {modules.map((m) => (
          <button
            key={m.title}
            onClick={m.onClick}
            className={`text-left flex flex-col rounded-2xl border border-border/40 bg-card p-6 hover:-translate-y-1 transition group ${m.glow}`}
          >
            <div className={`h-1.5 w-16 rounded-full bg-gradient-to-r ${m.hue} mb-5`} />
            <p className="font-mono text-[10px] text-muted-foreground mb-2 uppercase tracking-wider">
              {m.tag}
            </p>
            <h3 className="font-pixel text-sm sm:text-base font-bold mb-3 group-hover:text-glow-white text-white">
              {m.title}
            </h3>
            <p className="text-sm text-muted-foreground/80 leading-relaxed mb-6">{m.desc}</p>
            <span className="mt-auto self-end rounded-full bg-gradient-to-br from-[#a855f7] to-[#ec4899] px-5 py-2 font-['Montserrat',sans-serif] font-[800] text-[0.75rem] text-white shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all duration-300 group-hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] uppercase tracking-wider">
              Enter
            </span>
          </button>
        ))}
      </section>

      <section id="domains-section">
        <h2 className="font-mono text-xs mb-4 text-white tracking-[0.2em]">DOMAINS</h2>
        <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {DOMAINS.map((d, i) => {
            const cleared = progress.clearedDomains.includes(d.id);
            // Unlock if it's the first domain, or if the user cleared the PREVIOUS domain
            const unlocked = i === 0 || progress.clearedDomains.includes(DOMAINS[i - 1].id);
            return (
              <button
                key={d.id}
                //disabled={!unlocked}
                onClick={() => onPlayDomain(d)}
                className={`group relative overflow-hidden rounded-[24px] border border-border/40 bg-card p-8 text-left transition
                  ${unlocked ? "hover:-translate-y-1 hover:border-magenta/40 hover:shadow-2xl" : "opacity-60 cursor-not-allowed"}`}
              >
                <div className={`absolute inset-x-0 top-0 h-[6px] ${
                  d.accent === "cyan"    ? "bg-gradient-cyan" :
                  d.accent === "magenta" ? "bg-gradient-magenta" :
                  d.accent === "violet"  ? "bg-gradient-violet" : "bg-gradient-forge"
                }`} />
                <div className="flex items-start justify-between">
                  <div className="font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">Domain {i + 1}</div>
                  {!unlocked && <Lock className="size-4 text-muted-foreground" />}
                  {cleared && <span className="rounded-md bg-success/15 px-2 py-0.5 font-mono text-[10px] uppercase tracking-wider text-success">Cleared</span>}
                </div>
                <h3 className="mt-5 font-pixel text-lg sm:text-xl font-bold">{d.name}</h3>
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

function Stat({ label, value, accent }) {
  return (
    <div>
      <p className={`font-display text-3xl font-bold ${accent ? "text-cyan" : "text-white"}`} style={{ textShadow: accent ? '0 0 15px rgba(34,211,238,0.5)' : 'none' }}>
        {value}
      </p>
      <p className="font-mono text-[10px] text-muted-foreground mt-1 uppercase tracking-[0.1em]">{label}</p>
    </div>
  );
}
