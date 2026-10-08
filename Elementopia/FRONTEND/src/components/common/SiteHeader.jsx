import React, { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut, LayoutDashboard, Grid, Wrench, Image as ImageIcon, Search, Swords, FlaskConical, AlertTriangle, RotateCcw, Sparkles } from "lucide-react";
import { loadProgress, resetProgress, fetchProgress } from "@/features/mastery-dashboard/lib/progress";
import { useTour } from "@/features/tutorial-tour";

// Stat Component
function Stat({ label, value, accent }) {
  return (
    <div className="text-center">
      <p className={`font-display text-xl sm:text-3xl font-bold ${accent ? "text-cyan-400" : "text-white"}`} style={{ textShadow: accent ? '0 0 15px rgba(34,211,238,0.5)' : 'none' }}>
        {value}
      </p>
      <p className="font-mono text-[9px] sm:text-[10px] text-muted-foreground mt-1 uppercase tracking-[0.1em]">{label}</p>
    </div>
  );
}

export function SiteHeader({ view, setView }) {
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [isResetting, setIsResetting] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const { startTour } = useTour();
  const pathname = location.pathname;
  const isMainPage = pathname === "/student-home-page" || pathname === "/student/elementopia";
  const isDashboardActive = isMainPage && (view === "home" || !view);
  const isDiscoveryActive = pathname === "/student/discovery";
  const isGalleryActive = pathname === "/student/gallery" || pathname === "/gallery" || pathname === "/student/compound-gallery";
  const isWorkshopActive = pathname === "/student/workshop" || pathname === "/workshop" || pathname === "/student/dr-atom-workshop";
  const isMatrixActive = pathname === "/student/matrix" || pathname === "/matrix" || pathname === "/student/periodic-matrix" || pathname === "/periodic-matrix";
  const isChallengeActive = pathname.startsWith("/challenge");
  const isSandboxActive = pathname === "/student/Chem-Simulation";

  // Progress logic
  const [progress, setProgress] = useState(loadProgress());

  useEffect(() => {
    const initProgress = async () => {
      let localUser = null;
      try {
        const userStr = localStorage.getItem("elementopia_current_user");
        if (userStr) localUser = JSON.parse(userStr);
      } catch (e) { }

      const nick = localUser?.username || progress.nickname;
      if (nick && nick !== "Guest Alchemist") {
        await fetchProgress(nick);
      }
      setProgress(loadProgress());
    };
    initProgress();

    const h = () => setProgress(loadProgress());
    window.addEventListener("elementopia:progress", h);

    return () => window.removeEventListener("elementopia:progress", h);
  }, []);

  let localUser = null;
  try {
    const userStr = localStorage.getItem("elementopia_current_user");
    if (userStr) localUser = JSON.parse(userStr);
  } catch (e) { }

  const displayName = localUser?.username && localUser.username !== "Guest Alchemist"
    ? localUser.username
    : (progress.nickname && progress.nickname !== "Guest Alchemist" ? progress.nickname : "Alchemist");


  const handleDashboardClick = () => {
    if (setView && isMainPage) {
      setView("home");
    } else {
      window.location.href = "/student-home-page";
    }
    setSidebarOpen(false);
  };

  // Close sidebar on route change
  useEffect(() => {
    setSidebarOpen(false);
  }, [pathname]);

  return (
    <>
      <header className="border-b border-border/60 backdrop-blur-md bg-background/60 sticky top-0 z-40">
        <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button
              data-tour="tour-menu"
              onClick={() => setSidebarOpen(true)}
              className="p-2 text-slate-300 hover:text-white rounded-lg bg-slate-900/50 hover:bg-slate-800 border border-slate-700/50 transition-colors cursor-pointer"
              aria-label="Open menu"
            >
              <Menu className="size-5" />
            </button>
            <a
              href="/student-home-page"
              onClick={(e) => {
                if (setView && isMainPage) {
                  e.preventDefault();
                  setView("home");
                }
              }}
              className="flex items-center"
            >
              <h1
                className="font-pixel text-sm sm:text-base font-bold uppercase transition-all hover:scale-105 cursor-pointer"
                style={{ color: '#ec4899', letterSpacing: '1px', textShadow: '0 0 10px rgba(236,72,153,0.6)' }}
              >
                ELEMENTOPIA
              </h1>
            </a>
          </div>

          <div className="flex items-center gap-3 sm:gap-4">
            <div className="flex gap-4 sm:gap-6">
              <Stat label="Cleared" value={progress?.clearedDomains?.length || 0} />
              <Stat label="Sessions" value={progress?.sessions?.length || 0} />
              <Stat label="Wins" value={progress?.wins || 0} accent />
            </div>

            <button
              onClick={() => startTour(0)}
              className="flex items-center gap-1.5 rounded-full border border-cyan-500/40 bg-cyan-950/40 hover:bg-cyan-900/60 px-3 sm:px-4 py-1.5 font-mono font-bold text-[0.65rem] sm:text-[0.75rem] text-cyan-300 shadow-[0_0_15px_rgba(34,211,238,0.25)] hover:shadow-[0_0_20px_rgba(34,211,238,0.5)] transition-all uppercase tracking-wider cursor-pointer hover:-translate-y-0.5"
              title="Launch interactive feature tutorial"
            >
              <Sparkles className="size-3.5 text-cyan-400" />
              <span>Tour</span>
            </button>

            <button
              onClick={() => setShowResetModal(true)}
              className="hidden sm:block rounded-full bg-gradient-to-br from-indigo-500 to-magenta px-4 py-1.5 font-mono font-bold text-[0.65rem] sm:text-[0.75rem] text-white shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] uppercase tracking-wider cursor-pointer"
            >
              Reset Progress
            </button>
          </div>
        </div>
      </header>

      {/* Sidebar Overlay */}
      {sidebarOpen && (
        <div
          className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 transition-opacity"
          onClick={() => setSidebarOpen(false)}
        />
      )}

      {/* Sidebar Content */}
      <div
        className={`fixed top-0 left-0 h-full w-[82vw] max-w-[300px] sm:w-72 bg-slate-950 border-r border-slate-800 z-50 p-6 shadow-2xl transition-transform duration-300 ease-in-out flex flex-col ${sidebarOpen ? "translate-x-0" : "-translate-x-full"
          }`}
      >
        <div className="flex justify-between items-center mb-8">
          <h2 className="font-pixel text-lg font-bold text-white uppercase" style={{ color: '#ec4899' }}>Menu</h2>
          <button
            onClick={() => setSidebarOpen(false)}
            className="p-2 text-slate-400 hover:text-white hover:bg-slate-800 rounded-lg transition-colors cursor-pointer"
          >
            <X className="size-5" />
          </button>
        </div>

        <nav className="flex flex-col gap-2 overflow-y-auto flex-1 pb-4">
          {setView && isMainPage ? (
            <button
              type="button"
              onClick={handleDashboardClick}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer font-sans text-left w-full border-0 ${isDashboardActive
                  ? "bg-slate-800/80 text-white font-semibold shadow-inner shadow-cyan-500/20"
                  : "bg-transparent text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
            >
              <LayoutDashboard className={`size-5 ${isDashboardActive ? "text-cyan-400" : ""}`} />
              Dashboard
            </button>
          ) : (
            <Link
              to="/student-home-page"
              onClick={() => setSidebarOpen(false)}
              className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer font-sans text-left w-full border-0 ${isDashboardActive
                  ? "bg-slate-800/80 text-white font-semibold shadow-inner shadow-cyan-500/20"
                  : "bg-transparent text-slate-400 hover:text-white hover:bg-slate-900"
                }`}
            >
              <LayoutDashboard className={`size-5 ${isDashboardActive ? "text-cyan-400" : ""}`} />
              Dashboard
            </Link>
          )}

          <Link
            to="/student/matrix"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer font-sans text-left w-full border-0 ${isMatrixActive
                ? "bg-slate-800/80 text-white font-semibold shadow-inner shadow-cyan-500/20"
                : "bg-transparent text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
          >
            <Grid className={`size-5 ${isMatrixActive ? "text-cyan-400" : ""}`} />
            Periodic Matrix
          </Link>

          <Link
            to="/student/workshop"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer font-sans text-left w-full border-0 ${isWorkshopActive
                ? "bg-slate-800/80 text-white font-semibold shadow-inner shadow-cyan-500/20"
                : "bg-transparent text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
          >
            <Wrench className={`size-5 ${isWorkshopActive ? "text-cyan-400" : ""}`} />
            Workshop
          </Link>

          <Link
            to="/student/gallery"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer font-sans text-left w-full border-0 ${isGalleryActive
                ? "bg-slate-800/80 text-white font-semibold shadow-inner shadow-cyan-500/20"
                : "bg-transparent text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
          >
            <ImageIcon className={`size-5 ${isGalleryActive ? "text-cyan-400" : ""}`} />
            Gallery
          </Link>

          <Link
            to="/student/Chem-Simulation"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer font-sans text-left w-full border-0 ${isSandboxActive
                ? "bg-slate-800/80 text-white font-semibold shadow-inner shadow-cyan-500/20"
                : "bg-transparent text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
          >
            <FlaskConical className={`size-5 ${isSandboxActive ? "text-cyan-400" : ""}`} />
            Chemistry Sandbox
          </Link>

          <Link
            to="/student/discovery"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer font-sans text-left w-full border-0 ${isDiscoveryActive
                ? "bg-slate-800/80 text-white font-semibold shadow-inner shadow-cyan-500/20"
                : "bg-transparent text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
          >
            <Search className={`size-5 ${isDiscoveryActive ? "text-cyan-400" : ""}`} />
            Discoveries
          </Link>

          <Link
            to="/challenge"
            onClick={() => setSidebarOpen(false)}
            className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all cursor-pointer font-sans text-left w-full border-0 ${isChallengeActive
                ? "bg-slate-800/80 text-white font-semibold shadow-inner shadow-cyan-500/20"
                : "bg-transparent text-slate-400 hover:text-white hover:bg-slate-900"
              }`}
          >
            <Swords className={`size-5 ${isChallengeActive ? "text-cyan-400" : ""}`} />
            Challenge
          </Link>
        </nav>

        <div className="mt-auto pt-4 border-t border-slate-800 space-y-2">
          <button
            type="button"
            onClick={() => {
              setSidebarOpen(false);
              setShowResetModal(true);
            }}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-slate-900 hover:bg-slate-800 border border-slate-700/80 px-4 py-2.5 text-xs font-mono font-bold text-rose-400 hover:text-rose-300 transition-all cursor-pointer"
          >
            <RotateCcw className="size-3.5" />
            Reset Progress
          </button>
          <button
            type="button"
            onClick={() => { localStorage.clear(); window.location.href = "/"; }}
            className="flex items-center justify-center gap-2 w-full rounded-xl bg-gradient-to-br from-indigo-500/20 to-magenta/20 hover:from-indigo-500/40 hover:to-magenta/40 border border-magenta/30 px-6 py-2.5 text-sm font-bold text-white shadow-md hover:shadow-lg hover:shadow-[rgba(236,72,153,0.2)] transition-all cursor-pointer"
          >
            <LogOut className="size-4" />
            Exit
          </button>
        </div>
      </div>

      {/* Custom Elementopia Reset Confirmation Modal */}
      {showResetModal && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <div
            className="absolute inset-0 bg-black/80 backdrop-blur-sm transition-opacity"
            onClick={() => !isResetting && setShowResetModal(false)}
          />
          <div className="relative w-full max-w-md rounded-3xl border border-rose-500/40 bg-slate-950/95 p-6 sm:p-7 shadow-[0_0_50px_rgba(244,63,94,0.25)] animate-fade-up z-10">
            <div className="flex items-start gap-4 mb-4">
              <div className="p-3 rounded-2xl bg-rose-500/15 text-rose-400 border border-rose-500/30 shrink-0">
                <AlertTriangle className="size-6 text-rose-400 animate-pulse" />
              </div>
              <div>
                <div className="font-mono text-[10px] text-rose-400 uppercase tracking-widest font-bold">
                  Irreversible Action
                </div>
                <h3 className="font-pixel text-lg font-bold text-white mt-0.5">
                  Reset All Progress?
                </h3>
              </div>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed font-sans mb-6">
              This will permanently clear your completed domain records, session history, and synthesis performance for <strong className="text-white font-mono">{displayName}</strong>. Are you sure you want to proceed?
            </p>

            <div className="flex items-center justify-end gap-3 border-t border-slate-800/80 pt-4">
              <button
                type="button"
                disabled={isResetting}
                onClick={() => setShowResetModal(false)}
                className="px-4 py-2 rounded-xl border border-slate-700 text-slate-300 font-mono text-xs hover:bg-slate-800 transition disabled:opacity-50 cursor-pointer"
              >
                Cancel
              </button>
              <button
                type="button"
                disabled={isResetting}
                onClick={async () => {
                  setIsResetting(true);
                  try {
                    const fresh = await resetProgress(displayName);
                    setProgress(fresh);
                  } finally {
                    setIsResetting(false);
                    setShowResetModal(false);
                  }
                }}
                className="flex items-center gap-2 rounded-xl bg-gradient-to-r from-rose-600 to-red-500 px-5 py-2 font-mono font-bold text-xs text-white shadow-[0_0_15px_rgba(244,63,94,0.4)] transition-all hover:scale-105 hover:shadow-[0_0_25px_rgba(244,63,94,0.6)] uppercase tracking-wider disabled:opacity-50 cursor-pointer"
              >
                <RotateCcw className={`size-3.5 ${isResetting ? "animate-spin" : ""}`} />
                {isResetting ? "Resetting..." : "Reset Everything"}
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
