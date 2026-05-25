import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export function SiteHeader({ view, setView }) {
  const navigate = useNavigate();
  const location = useLocation();

  const pathname = location.pathname;
  
  // If we are on the main game page, check the `view` state. Otherwise, check the path.
  const isMainPage = pathname === "/student-home-page" || pathname === "/student/elementopia";
  const isDashboardActive = isMainPage && (view === "home" || !view); // Fallback to home if view is missing on main page
  const isMasteryActive = isMainPage && view === "dashboard";
  const isChemSimActive = pathname === "/student/Chem-Simulation";
  const isDiscoveryActive = pathname === "/student/discovery";
  const isChallengeActive = pathname.startsWith("/challenge");

  const handleDashboardClick = () => {
    if (setView) setView("home");
    else navigate("/student-home-page");
  };

  const handleMasteryClick = () => {
    if (setView) setView("dashboard");
    else navigate("/student-home-page"); // Or whatever route opens mastery directly if we set that up
  };

  return (
    <header className="border-b border-border/60 backdrop-blur-md bg-background/60 sticky top-0 z-50">
      <div className="mx-auto max-w-[1600px] w-full px-6 py-4 flex items-center justify-between">
        <button onClick={handleDashboardClick} className="font-mono text-base sm:text-lg text-magenta tracking-wider font-bold uppercase">
          ELEMENTOPIA
        </button>
        <nav className="flex items-center gap-2 sm:gap-4 text-sm font-mono uppercase tracking-wider">
          <button 
            onClick={handleDashboardClick}
            className={`transition ${isDashboardActive ? "text-white font-bold" : "text-muted-foreground hover:text-white"}`}
          >
            Dashboard
          </button>
          <Link 
            to="/student/discovery"
            className={`transition ${isDiscoveryActive ? "text-white font-bold" : "text-muted-foreground hover:text-white"}`}
          >
            Discoveries
          </Link>
          <button 
            onClick={handleMasteryClick}
            className={`transition ${isMasteryActive ? "text-white font-bold" : "text-muted-foreground hover:text-white"}`}
          >
            Mastery
          </button>
          <Link 
            to="/challenge"
            className={`transition ${isChallengeActive ? "text-white font-bold" : "text-muted-foreground hover:text-white"}`}
          >
            Challenge
          </Link>
          <Link to="/" className="rounded-xl bg-gradient-magenta px-4 py-2 font-bold text-white text-sm shadow-[0_0_15px_rgba(236,72,153,0.3)] hover:scale-105 transition">
            Exit
          </Link>
        </nav>
      </div>
    </header>
  );
}
