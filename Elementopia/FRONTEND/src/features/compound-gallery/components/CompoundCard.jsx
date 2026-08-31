import React, { useState } from "react";
import { FlaskConical, Atom, RefreshCw, Sparkles } from "lucide-react";

export function CompoundCard({ compound }) {
  const [isFlipped, setIsFlipped] = useState(false);
  const [imgError, setImgError] = useState(false);

  const handleCardClick = () => {
    setIsFlipped(!isFlipped);
  };

  return (
    <div
      className="h-72 w-full group perspective cursor-pointer select-none"
      onClick={handleCardClick}
    >
      <div className={`flip-card w-full h-full relative ${isFlipped ? "flipped" : ""}`}>
        <div className="flip-card-inner w-full h-full">
          {/* Front */}
          <div className="flip-card-front bg-slate-900/90 border border-slate-700/60 hover:border-cyan/70 rounded-2xl flex flex-col items-center justify-between p-5 shadow-[0_4px_20px_rgba(0,0,0,0.5)] transition-all duration-300 group-hover:shadow-[0_0_25px_rgba(6,182,212,0.25)]">
            <div className="w-full flex justify-end items-center">
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-500 flex items-center gap-1 group-hover:text-cyan/70 transition-colors">
                <Sparkles className="size-3" /> Compound
              </span>
            </div>

            {/* Photo Container */}
            <div className="w-28 h-28 my-auto rounded-full p-1 bg-gradient-to-tr from-cyan/30 via-slate-800 to-magenta/30 border border-slate-700/80 shadow-inner group-hover:scale-105 transition-transform duration-300 overflow-hidden flex items-center justify-center">
              {imgError ? (
                <div className="w-full h-full rounded-full bg-slate-950 flex items-center justify-center text-cyan">
                  <FlaskConical className="size-10" />
                </div>
              ) : (
                <img
                  src={compound.image}
                  alt={compound.name}
                  onError={() => setImgError(true)}
                  className="w-full h-full object-cover rounded-full"
                  loading="lazy"
                />
              )}
            </div>

            {/* Compound Name */}
            <div className="w-full text-center">
              <h3 className="text-lg font-bold text-white group-hover:text-cyan transition-colors tracking-wide line-clamp-1">
                {compound.name}
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5 font-mono uppercase tracking-wider flex items-center justify-center gap-1">
                <RefreshCw className="size-3 text-cyan/70 animate-spin-slow" /> Click for Recipe & Fact
              </p>
            </div>
          </div>

          {/* Back */}
          <div className="flip-card-back bg-gradient-to-br from-indigo-950/95 via-purple-950/90 to-slate-950/95 border border-indigo-500/50 hover:border-magenta/70 rounded-2xl flex flex-col justify-between p-5 shadow-[0_4px_25px_rgba(0,0,0,0.6)] relative overflow-hidden text-center">
            {/* Background Watermark */}
            <div className="absolute -right-4 -top-4 text-8xl text-white/5 blur-[1px] rotate-12 pointer-events-none">
              <Atom className="size-28" />
            </div>

            {/* Top Recipe Badge */}
            <div className="relative z-10">
              <div className="inline-flex items-center gap-2 bg-indigo-950/90 px-3.5 py-1.5 rounded-full border border-indigo-400/40 text-xs font-semibold text-indigo-200 shadow-inner max-w-full">
                <FlaskConical className="size-3.5 text-cyan shrink-0" />
                <span className="text-slate-400 text-[11px] uppercase tracking-wider">Recipe:</span>
                <span className="text-white font-mono tracking-widest font-bold truncate">
                  {compound.mix}
                </span>
              </div>
            </div>

            {/* Fun Fact */}
            <div className="relative z-10 my-auto px-1">
              <h4 className="text-[10px] font-mono font-bold text-cyan uppercase tracking-[0.2em] mb-1.5 border-b border-indigo-500/30 pb-1 w-full text-center">
                Scientific Fact
              </h4>
              <p className="text-xs sm:text-[13px] text-indigo-100/90 leading-relaxed font-sans line-clamp-4">
                {compound.desc}
              </p>
            </div>

            {/* Bottom Flip back */}
            <div className="relative z-10 text-[10px] font-mono uppercase tracking-widest text-indigo-400/70 flex items-center justify-center gap-1">
              <RefreshCw className="size-3" /> Click to flip back
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
