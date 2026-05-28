import { useState, useEffect } from "react";
import { Beaker, X } from "lucide-react";

export function NicknameGate({ onSubmit }) {
  const [name, setName] = useState("");

  useEffect(() => {
    document.body.style.overflow = "hidden";
    return () => {
      document.body.style.overflow = "";
    };
  }, []);

  const handleSubmit = (e) => {
    e.preventDefault();
    const v = name.trim();
    if (v.length >= 2) onSubmit(v);
  };
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 bg-[#0a0612] grid-bg scan-lines overflow-hidden">
      {/* Decorative Chemistry Line Art */}
      <div className="absolute inset-0 pointer-events-none opacity-[0.2]">
        <svg viewBox="0 0 1920 1080" preserveAspectRatio="xMidYMid slice" className="w-full h-full" xmlns="http://www.w3.org/2000/svg">
          <defs>
            <linearGradient id="chem-grad" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#a855f7" />
              <stop offset="100%" stopColor="#ec4899" />
            </linearGradient>
          </defs>
          {/* Top Left */}
          <g stroke="url(#chem-grad)" strokeWidth="2.5" fill="none" transform="translate(200, 150) scale(2)">
            <polygon points="50,0 100,28.8 100,86.6 50,115.4 0,86.6 0,28.8" />
            <line x1="100" y1="86.6" x2="150" y2="115.4" />
            <polygon points="150,115.4 200,86.6 200,28.8 150,0 100,28.8" />
            <circle cx="200" cy="86.6" r="4" fill="url(#chem-grad)" />
            <circle cx="0" cy="28.8" r="4" fill="url(#chem-grad)" />
            <line x1="50" y1="115.4" x2="50" y2="173.2" />
          </g>
          {/* Bottom Left */}
          <g stroke="url(#chem-grad)" strokeWidth="2" fill="none" transform="translate(300, 900) scale(1.8) rotate(-20)">
            <polygon points="50,0 100,28.8 100,86.6 50,115.4 0,86.6 0,28.8" />
            <line x1="100" y1="28.8" x2="150" y2="0" />
            <polygon points="150,0 200,28.8 200,86.6 150,115.4 100,86.6" />
            <circle cx="50" cy="0" r="3" fill="url(#chem-grad)" />
            <circle cx="200" cy="86.6" r="3" fill="url(#chem-grad)" />
          </g>
          {/* Center Left (Peeking) */}
          <g stroke="url(#chem-grad)" strokeWidth="2" fill="none" transform="translate(550, 450) scale(1.5) rotate(15)">
            <polygon points="50,0 100,28.8 100,86.6 50,115.4 0,86.6 0,28.8" />
            <line x1="0" y1="86.6" x2="-40" y2="109.7" />
            <circle cx="-40" cy="109.7" r="5" fill="url(#chem-grad)" />
          </g>
          {/* Center Right (Peeking) */}
          <g stroke="url(#chem-grad)" strokeWidth="2" fill="none" transform="translate(1200, 600) scale(1.7) rotate(-10)">
            <polygon points="50,0 100,28.8 100,86.6 50,115.4 0,86.6 0,28.8" />
            <line x1="100" y1="86.6" x2="150" y2="115.4" />
            <circle cx="150" cy="115.4" r="5" fill="url(#chem-grad)" />
            <line x1="0" y1="28.8" x2="-50" y2="0" />
            <circle cx="-50" cy="0" r="5" fill="url(#chem-grad)" />
          </g>
          {/* Top Right */}
          <g stroke="url(#chem-grad)" strokeWidth="2" fill="none" transform="translate(1500, 150) scale(2.2) rotate(45)">
            <polygon points="50,0 100,28.8 100,86.6 50,115.4 0,86.6 0,28.8" />
            <line x1="100" y1="28.8" x2="150" y2="0" />
            <polygon points="150,0 200,28.8 200,86.6 150,115.4 100,86.6" />
            <circle cx="50" cy="0" r="3" fill="url(#chem-grad)" />
            <circle cx="200" cy="86.6" r="3" fill="url(#chem-grad)" />
          </g>
          {/* Bottom Right */}
          <g stroke="url(#chem-grad)" strokeWidth="1.5" fill="none" transform="translate(1450, 950) scale(1.5) rotate(30)">
            <polygon points="50,0 100,28.8 100,86.6 50,115.4 0,86.6 0,28.8" />
            <line x1="0" y1="86.6" x2="-40" y2="109.7" />
            <circle cx="-40" cy="109.7" r="5" fill="url(#chem-grad)" />
          </g>
        </svg>
      </div>
      <div className="relative w-full max-w-md rounded-2xl border border-border/60 bg-card/95 px-8 py-10 shadow-2xl animate-fade-up">
        <button
          onClick={() => window.location.href = "/"}
          style={{ width: '26px', height: '26px', minWidth: '26px', minHeight: '26px', padding: 0 }}
          className="absolute -top-3 -right-3 flex items-center justify-center rounded-full bg-gradient-to-br from-[#a855f7] to-[#ec4899] text-white shadow-[0_0_15px_rgba(236,72,153,0.4)] transition-all hover:scale-110 hover:shadow-[0_0_20px_rgba(236,72,153,0.6)] z-10 font-sans leading-none"
        >
          <span className="text-[16px] font-bold pb-[2px]">&times;</span>
        </button>
        <div className="mb-8 flex justify-center">
          <h2 className="font-pixel text-xl sm:text-2xl font-bold uppercase tracking-wider text-[#ec4899] text-center drop-shadow-[0_0_15px_rgba(236,72,153,0.8)]">
            ELEMENTOPIA
          </h2>
        </div>
        <p className="mb-8 font-['Montserrat',sans-serif] text-[0.95rem] leading-[1.6] text-white/65 text-justify">
          Enter a nickname to begin your chemical journey and track your mastery.
        </p>
        <form onSubmit={handleSubmit}>
          <input
            autoFocus
            value={name}
            onChange={(e) => setName(e.target.value)}
            placeholder="e.g. atomspark"
            maxLength={32}
            className="w-full rounded-lg border border-border/80 bg-input px-4 py-3 font-mono text-base text-foreground outline-none transition focus:border-muted-foreground/50"
          />
          <button
            type="submit"
            disabled={!name.trim()}
            className="mt-6 w-full rounded-full bg-gradient-to-br from-[#a855f7] to-[#ec4899] px-4 py-3.5 font-['Montserrat',sans-serif] font-[800] text-[1.05rem] text-white shadow-[0_0_20px_rgba(236,72,153,0.3),0_0_40px_rgba(168,85,247,0.2)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_25px_rgba(236,72,153,0.6),0_0_50px_rgba(168,85,247,0.4)] disabled:pointer-events-none disabled:opacity-50"
          >
            Begin Session
          </button>
        </form>
      </div>
    </div>
  );
}
