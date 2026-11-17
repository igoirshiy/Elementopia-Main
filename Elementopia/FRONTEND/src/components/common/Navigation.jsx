import React from "react";
import { Menu } from "lucide-react";
import '@/assets/styles/legacy/navigation.css';

export default function Navigation() {

  return (
    <div className="landingpage-container">
      <nav className="nav-bar">

        <a className="logo flex items-center transition-all hover:scale-105" href="/">
          <img
            src="/header-logo.png"
            alt="Elementopia"
            className="h-11 sm:h-14 md:h-15 w-auto object-contain drop-shadow-[0_0_15px_rgba(236,72,153,0.6)] group-hover:brightness-110 transition-all duration-300"
          />
        </a>

        <div className="nav-links">
        </div>
      </nav>
    </div>
  );
}
