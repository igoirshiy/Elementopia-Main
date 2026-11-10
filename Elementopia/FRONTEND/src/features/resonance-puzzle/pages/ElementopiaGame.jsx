import '@/assets/styles/global/elementopia.css';
import { useCallback, useEffect, useState } from "react";
import { Beaker, Lock, BarChart3, Gamepad2, X } from "lucide-react";
import { DOMAINS } from "@/features/resonance-puzzle/lib/game-data";
import { fetchProgress } from "@/features/mastery-dashboard/lib/progress";
import UserService from "@/features/auth-user";
import { StoryCard } from "@/features/resonance-puzzle/components/StoryCard";
import { GameBoard } from "../components/GameBoard";
import { DashboardHub } from "@/features/mastery-dashboard";
import { SiteHeader } from "@/components/common/SiteHeader";
import { useLocation } from "react-router-dom";
import { API_BASE_URL } from "@/config/apiConfig";
import { DebriefingModal } from "../components/DebriefingModal";

export default function ElementopiaGame() {
  const location = useLocation();
  const [rows, setRows] = useState([]);
  const [nickname, setNickname] = useState(null);
  const queryParams = new URLSearchParams(location.search);
  const initialView = queryParams.get("view") || location.state?.view || "home";
  const [view, setView] = useState(initialView);

  useEffect(() => {
    const qView = new URLSearchParams(location.search).get("view");
    if (qView) {
      setView(qView);
    } else if (location.state?.view) {
      setView(location.state.view);
    }
  }, [location.search, location.state]);
  const [activeDomain, setActiveDomain] = useState(null);
  const [storyOpen, setStoryOpen] = useState(false);
  const [completionBanner, setCompletionBanner] = useState(null);
  const [error, setError] = useState(null);
  const [debriefOpen, setDebriefOpen] = useState(false);
  const [debriefStats, setDebriefStats] = useState(null);
  const refresh = useCallback(async (nick) => {
    if (!nick || nick === "Guest Alchemist") return;
    try { setRows(await fetchProgress(nick)); }
    catch (e) { setError(e?.message ?? "Failed to load progress"); }
  }, []);

  useEffect(() => {
    const syncUser = async () => {
      let localUser = null;
      try {
        const userStr = localStorage.getItem("elementopia_current_user");
        if (userStr) localUser = JSON.parse(userStr);
      } catch (e) { }

      const nick = localUser?.username;
      if (nick && nick !== "Guest" && nick !== "Guest Alchemist") {
        setNickname(nick);
        void refresh(nick);
        return;
      }

      const user = await UserService.getCurrentUser();
      const finalNick = user?.username || "Guest Alchemist";
      setNickname(finalNick);
      if (finalNick && finalNick !== "Guest" && finalNick !== "Guest Alchemist") {
        void refresh(finalNick);
      }
    };

    void syncUser();

    const handleProgressChange = () => {
      void syncUser();
    };

    window.addEventListener("elementopia:progress", handleProgressChange);
    window.addEventListener("elementopia:user-changed", handleProgressChange);
    window.addEventListener("focus", handleProgressChange);
    window.addEventListener("storage", handleProgressChange);

    return () => {
      window.removeEventListener("elementopia:progress", handleProgressChange);
      window.removeEventListener("elementopia:user-changed", handleProgressChange);
      window.removeEventListener("focus", handleProgressChange);
      window.removeEventListener("storage", handleProgressChange);
    };
  }, [refresh]);

  // Auto-refresh data whenever view switches back to home or dashboard
  useEffect(() => {
    if (nickname && nickname !== "Guest Alchemist") {
      void refresh(nickname);
    }
  }, [view, nickname, refresh]);

  useEffect(() => {
    const handlePopState = (event) => {
      if (view === "playing" || view === "dashboard") {
        event.preventDefault();
        setView("home");
        setActiveDomain(null);
        setStoryOpen(false);
        setDebriefOpen(false);
      }
    };

    if (view === "playing" || view === "dashboard") {
      window.history.pushState({ view }, "", window.location.href);
      window.addEventListener("popstate", handlePopState);
    }

    return () => window.removeEventListener("popstate", handlePopState);
  }, [view]);


  const enterDomain = async (d, idx) => {
    const roomId = idx + 1;

    try {
      const response = await fetch(`${API_BASE_URL}/api/features/progression/verify-access?nicknameWithTag=${encodeURIComponent(nickname)}&roomId=${roomId}`);
      const data = await response.json();

      if (data.action === "LAUNCH_PUZZLE_ARENA") {
        setActiveDomain(d);
        setStoryOpen(true);
        setView("playing");
        setError(null);
      } else if (data.action === "DISPLAY_LOCKED_WARNING") {
        setError(data.message);
      }
    } catch (err) {
      setError("Network error: Could not verify domain access with the server.", err);
    }
  };

  const onCleared = async (stats) => {
    if (!activeDomain || !nickname) return;
    setDebriefStats(stats || null);
    setCompletionBanner(`${activeDomain.name} cleared — next domain unlocked.`);
    await refresh(nickname);
    setDebriefOpen(true);
    setTimeout(() => setCompletionBanner(null), 5000);
  };

  const handleDebriefContinue = async () => {
    setDebriefOpen(false);
    setDebriefStats(null);
    setView("home");
    setActiveDomain(null);
    if (nickname) {
      await refresh(nickname);
    }
  };

  const handleDebriefRetry = async () => {
    setDebriefOpen(false);
    setDebriefStats(null);
    setStoryOpen(true);
    if (nickname) {
      await refresh(nickname);
    }
  };

  if (!nickname) {
    return (
      <div style={{ display: "flex", width: "100%", minHeight: "100vh", backgroundColor: "#121212", justifyContent: "center", alignItems: "center" }}>
        <div className="text-white font-mono animate-pulse">Initializing Resonance...</div>
      </div>
    );
  }

  return (
    <div className="h-screen overflow-hidden" style={{ display: "flex", width: "100%", backgroundColor: "#121212" }}>
      <div
        className="elementopia-scope flex flex-col h-full w-full"
        style={{ flexGrow: 1 }}
      >
        <SiteHeader view={view} setView={setView} />

        <div className="flex-1 overflow-y-auto w-full flex flex-col">
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

          {(view === "home" || view === "dashboard") && (
            <DashboardHub
              nickname={nickname}
              rows={rows}
              onRefresh={() => { if (nickname) void refresh(nickname); }}
              onPlayDomain={(d) => enterDomain(d, DOMAINS.findIndex(x => x.id === d.id))}
            />
          )}

          {view === "playing" && activeDomain && (
            <>
              {storyOpen && (
                <StoryCard
                  domain={activeDomain}
                  currentStage={rows.find(r => r.domain === activeDomain?.id)?.stage || 1}
                  onEnter={() => setStoryOpen(false)}
                  onCancel={() => { setView("home"); setActiveDomain(null); setStoryOpen(false); }}
                />
              )}

              {!storyOpen && !debriefOpen && (
                <GameBoard
                  nickname={nickname}
                  domain={activeDomain}
                  initialStage={rows.find(r => r.domain === activeDomain?.id)?.stage || 1}
                  onCleared={onCleared}
                  onExit={() => { setView("home"); setActiveDomain(null); if (nickname) void refresh(nickname); }}
                  onError={(m) => setError(m)}
                />
              )}

              {debriefOpen && (
                <DebriefingModal
                  domain={activeDomain}
                  stats={debriefStats}
                  onContinue={handleDebriefContinue}
                  onRetry={handleDebriefRetry}
                />
              )}
            </>
          )}

          <footer className="border-t border-border py-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mt-auto shrink-0">
            Elementopia · prototype · elemental resonance module
          </footer>
        </div>
      </div>
    </div>
  );
}


