import React, { useState } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import { Menu, X, LogOut } from "lucide-react";

export function SiteHeader({ view, setView }) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const isMainPage = pathname === "/student-home-page" || pathname === "/student/elementopia";
  const isDashboardActive = isMainPage && (view === "home" || !view);
  const isMasteryActive = isMainPage && view === "dashboard";
  const isDiscoveryActive = pathname === "/student/discovery";
  const isChallengeActive = pathname.startsWith("/challenge");

  const handleDashboardClick = () => {
    if (setView && isMainPage) {
      setView("home");
    } else {
      window.location.href = "/student-home-page";
    }
    setMobileMenuOpen(false);
  };

  const handleMasteryClick = () => {
    if (setView && isMainPage) {
      setView("dashboard");
    } else {
      window.location.href = "/student-home-page?view=dashboard";
    }
    setMobileMenuOpen(false);
  };

  return (
    <header className="border-b border-border/60 backdrop-blur-md bg-background/60 sticky top-0 z-50">
      <div className="mx-auto max-w-[1600px] w-full px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
        <a 
          href="/student-home-page" 
          onClick={(e) => {
            if (setView && isMainPage) {
              e.preventDefault();
              setView("home");
            }
          }}
        >
          <h1
            className="font-pixel text-sm sm:text-base font-bold uppercase transition-all hover:scale-105 cursor-pointer"
            style={{ color: '#ec4899', letterSpacing: '1px', textShadow: '0 0 10px rgba(236,72,153,0.6)' }}
          >
            ELEMENTOPIA
          </h1>
        </a>

        <nav className="hidden sm:flex items-center gap-6 text-[0.95rem] font-sans">
          <button 
            onClick={handleDashboardClick} 
            className={`transition-colors cursor-pointer ${isDashboardActive ? "text-white font-bold text-glow-cyan" : "text-white/70 hover:text-white"}`}
          >
            Dashboard
          </button>
          <button 
            onClick={() => { window.location.href = "/student/discovery"; }} 
            className={`transition-colors cursor-pointer ${isDiscoveryActive ? "text-white font-bold text-glow-cyan" : "text-white/70 hover:text-white"}`}
          >
            Discoveries
          </button>
          <button 
            onClick={handleMasteryClick} 
            className={`transition-colors cursor-pointer ${isMasteryActive ? "text-white font-bold text-glow-cyan" : "text-white/70 hover:text-white"}`}
          >
            Mastery
          </button>
          <Link 
            to="/challenge" 
            className={`transition-colors cursor-pointer ${isChallengeActive ? "text-white font-bold text-glow-cyan" : "text-white/70 hover:text-white"}`}
          >
            Challenge
          </Link>
          <button
            onClick={() => { localStorage.clear(); window.location.href = "/"; }}
            className="rounded-full bg-gradient-to-br from-[#a855f7] to-[#ec4899] px-6 py-2 text-xs font-bold text-white shadow-md hover:shadow-lg transition-all cursor-pointer"
          >
            Exit
          </button>
        </nav>

        <button
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
          className="sm:hidden p-2 text-slate-300 hover:text-white rounded-lg bg-slate-900 border border-slate-800 cursor-pointer"
        >
          {mobileMenuOpen ? <X className="size-5" /> : <Menu className="size-5" />}
        </button>

      </div>

      {mobileMenuOpen && (
        <div className="sm:hidden border-b border-slate-800 bg-slate-950/95 backdrop-blur-xl p-4 space-y-3 animate-fade-down">
          <button onClick={handleDashboardClick} className="block w-full text-left font-mono text-sm py-2 px-3 rounded-lg hover:bg-slate-900 text-white cursor-pointer">
            Dashboard
          </button>
          <Link to="/student/discovery" onClick={() => setMobileMenuOpen(false)} className="block w-full font-mono text-sm py-2 px-3 rounded-lg hover:bg-slate-900 text-white cursor-pointer">
            Discoveries Catalog
          </Link>
          <button onClick={handleMasteryClick} className="block w-full text-left font-mono text-sm py-2 px-3 rounded-lg hover:bg-slate-900 text-white cursor-pointer">
            Mastery Analytics
          </button>
          <Link to="/challenge" onClick={() => setMobileMenuOpen(false)} className="block w-full font-mono text-sm py-2 px-3 rounded-lg hover:bg-slate-900 text-white cursor-pointer">
            Challenge Mode
          </Link>
          <button
            onClick={() => { localStorage.clear(); window.location.href = "/"; }}
            className="flex items-center gap-2 w-full font-mono text-sm py-2 px-3 rounded-lg bg-red-500/20 text-red-400 font-bold border border-red-500/30 cursor-pointer"
          >
            <LogOut className="size-4" /> Exit Game
          </button>
        </div>
      )}
    </header>
  );
}
