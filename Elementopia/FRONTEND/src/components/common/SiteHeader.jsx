import React from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";

export function SiteHeader({ view, setView }) {
  const navigate = useNavigate();
  const location = useLocation();
  const pathname = location.pathname;
  const isMainPage = pathname === "/student-home-page" || pathname === "/student/elementopia";
  const isDashboardActive = isMainPage && (view === "home" || !view); 
  const isMasteryActive = isMainPage && view === "dashboard";
  const isDiscoveryActive = pathname === "/student/discovery";
  const isChallengeActive = pathname.startsWith("/challenge");

  const handleDashboardClick = () => {
    if (setView) setView("home");
    else navigate("/student-home-page");
  };

  const handleMasteryClick = () => {
    if (setView) setView("dashboard");
    else navigate("/student-home-page", { state: { view: "dashboard" } }); 
  };

  return (
    <header className="border-b border-border/60 backdrop-blur-md bg-background/60 sticky top-0 z-50">
      <div className="mx-auto max-w-[1600px] w-full px-6 py-4 flex items-center justify-between">
        <h1 
          className="font-pixel text-sm sm:text-base font-bold uppercase transition-all duration-300 hover:scale-105 cursor-default"
          style={{ 
            color: '#ec4899', 
            letterSpacing: '1px', 
            textShadow: '0 0 10px rgba(236, 72, 153, 0.6), 0 0 20px rgba(236, 72, 153, 0.2)' 
          }}
        >
          ELEMENTOPIA
        </h1>
        <nav className="flex items-center gap-4 sm:gap-6 text-[0.95rem] font-sans">
          <button 
            onClick={handleDashboardClick}
            className={`outline-none focus:outline-none font-['Montserrat',sans-serif] font-[800] transition-colors duration-200 ${isDashboardActive ? "text-white" : "text-white/70 hover:text-white"}`}
          >
            Dashboard
          </button>
          <Link 
            to="/student/discovery"
            className={`outline-none focus:outline-none font-['Montserrat',sans-serif] font-[800] transition-colors duration-200 ${isDiscoveryActive ? "text-white" : "text-white/70 hover:text-white"}`}
          >
            Discoveries
          </Link>
          <button 
            onClick={handleMasteryClick}
            className={`outline-none focus:outline-none font-['Montserrat',sans-serif] font-[800] transition-colors duration-200 ${isMasteryActive ? "text-white" : "text-white/70 hover:text-white"}`}
          >
            Mastery
          </button>
          <Link 
            to="/challenge"
            className={`outline-none focus:outline-none font-['Montserrat',sans-serif] font-[800] transition-colors duration-200 ${isChallengeActive ? "text-white" : "text-white/70 hover:text-white"}`}
          >
            Challenge
          </Link>
          <button 
            onClick={() => {
              localStorage.removeItem("elementopia_current_user");
              localStorage.removeItem("token");
              localStorage.removeItem("role");
              window.location.href = "/";
            }}
            className="ml-2 rounded-full bg-gradient-to-br from-[#a855f7] to-[#ec4899] px-6 py-2 font-['Montserrat',sans-serif] font-[800] text-[0.9rem] text-white shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)]"
          >
            Exit
          </button>
        </nav>
      </div>
    </header>
  );
}
