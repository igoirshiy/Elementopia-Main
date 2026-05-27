import '@/assets/styles/global/elementopia.css';
import { useCallback, useEffect, useMemo, useState } from "react";
import { Beaker, Lock, BarChart3, Gamepad2, X } from "lucide-react";
import { DOMAINS } from "@/features/resonance-puzzle/lib/game-data";
import { fetchProgress } from "@/features/mastery-dashboard/lib/progress";
import UserService from "@/features/auth-user";
import { StoryCard } from "@/features/resonance-puzzle/components/StoryCard";
import { GameBoard } from "@/features/resonance-puzzle";
import { Dashboard, DashboardHub } from "@/features/mastery-dashboard";
import { SiteHeader } from "@/components/common/SiteHeader";
export default function ElementopiaGame() {
  const [nickname, setNickname] = useState(null);
  const [rows, setRows] = useState([]);
  const [loading, setLoading] = useState(false);
  const [view, setView] = useState("home");
  const [activeDomain, setActiveDomain] = useState(null);
  const [storyOpen, setStoryOpen] = useState(false);
  const [completionBanner, setCompletionBanner] = useState(null);
  const [error, setError] = useState(null);

  const refresh = useCallback(async (nick) => {
    setLoading(true);
    try { setRows(await fetchProgress(nick)); }
    catch (e) { setError(e?.message ?? "Failed to load progress"); }
    finally { setLoading(false); }
  }, []);

  useEffect(() => { 
    const initNickname = async () => {
      const user = await UserService.getCurrentUser();
      if (user && user.username && user.username !== "Guest") {
        setNickname(user.username);
        void refresh(user.username);
      } else {
        // If they somehow got here without a nickname, send them back to land
        window.location.href = "/";
      }
    };
    initNickname();
  }, [refresh]);

  const completedIds = useMemo(() => new Set(rows.filter(r => r.completed).map(r => r.domain)), [rows]);

  const isUnlocked = (idx) => {
    if (idx === 0) return true;
    return completedIds.has(DOMAINS[idx - 1].id);
  };

  const enterDomain = (d, idx) => {
    if (!isUnlocked(idx)) return;
    setActiveDomain(d);
    setStoryOpen(true);
    setView("playing");
  };

  const onCleared = async () => {
    if (!activeDomain || !nickname) return;
    setCompletionBanner(`${activeDomain.name} cleared — next domain unlocked.`);
    await refresh(nickname);
    setView("home");
    setActiveDomain(null);
    setTimeout(() => setCompletionBanner(null), 5000);
  };

  if (!nickname) {
    return (
      <div style={{ display: "flex", width: "100%", minHeight: "100vh", backgroundColor: "#121212", justifyContent: "center", alignItems: "center" }}>
        <div className="text-white font-mono animate-pulse">Initializing Resonance...</div>
      </div>
    );
  }

  return (
    <div style={{ display: "flex", width: "100%", minHeight: "100vh", backgroundColor: "#121212" }}>
      <div 
        className="elementopia-scope flex flex-col"
        style={{ flexGrow: 1, transition: "all 225ms cubic-bezier(0.4, 0, 0.6, 1) 0ms", minHeight: "100vh" }}
      >
        <SiteHeader view={view} setView={setView} />

      {error && (
        <div className="mx-auto mt-3 flex max-w-[1600px] w-full items-center justify-between gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-6 py-2 text-sm text-destructive-foreground">
          <span>⚠ {error}</span>
          <button onClick={() => setError(null)}><X className="size-4" /></button>
        </div>
      )}
      {completionBanner && (
        <div className="mx-auto mt-3 max-w-[1600px] w-full rounded-lg border border-success/40 bg-success/10 px-6 py-3 text-center font-mono text-sm text-success animate-fade-up">
          ✓ {completionBanner}
        </div>
      )}

      {view === "home" && (
        <DashboardHub 
          onPlayDomain={(d) => enterDomain(d, DOMAINS.findIndex(x => x.id === d.id))} 
          onOpenMastery={() => { setView("dashboard"); if (nickname) void refresh(nickname); }} 
        />
      )}

      {view === "playing" && activeDomain && (
        <>
          {storyOpen && <StoryCard domain={activeDomain} onEnter={() => setStoryOpen(false)} />}
          {!storyOpen && (
            <GameBoard
              nickname={nickname}
              domain={activeDomain}
              onCleared={onCleared}
              onExit={() => { setView("home"); setActiveDomain(null); if (nickname) void refresh(nickname); }}
              onError={(m) => setError(m)}
            />
          )}
        </>
      )}

      {view === "dashboard" && <Dashboard nickname={nickname} rows={rows} />}

      <footer className="border-t border-border py-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-auto">
        Elementopia · prototype · elemental resonance module
      </footer>
      </div>
    </div>
  );
}


