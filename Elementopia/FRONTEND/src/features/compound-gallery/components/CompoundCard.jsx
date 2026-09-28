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
      className="group relative cursor-pointer select-none transition-all duration-300 hover:scale-[1.15] hover:z-[100] drop-shadow-[0_6px_12px_rgba(0,0,0,0.6)] hover:drop-shadow-[0_0_20px_rgba(6,182,212,0.6)] flex items-center justify-center bg-gradient-to-br from-cyan via-magenta to-indigo-500"
      style={{
        width: "281.7px",
        height: "244px",
        clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
      }}
      onClick={handleCardClick}
    >
      <div 
        className="relative"
        style={{
          width: "277.1px",
          height: "240px",
          clipPath: "polygon(25% 0%, 75% 0%, 100% 50%, 75% 100%, 25% 100%, 0% 50%)",
        }}
      >
        <div className={`flip-card w-full h-full relative transition-transform duration-500 ${isFlipped ? "flipped" : ""}`} style={{ transformStyle: "preserve-3d" }}>
          <div className="flip-card-inner w-full h-full relative" style={{ transformStyle: "preserve-3d" }}>
            
            {/* Front */}
            <div className="flip-card-front absolute inset-0 w-full h-full bg-gradient-to-br from-slate-700 via-slate-800 to-slate-950 flex flex-col items-center justify-center px-4 py-8 shadow-[inset_0_-10px_25px_rgba(0,0,0,0.9),inset_0_4px_15px_rgba(255,255,255,0.15)] transition-colors duration-300 group-hover:from-slate-600 group-hover:via-slate-800 group-hover:to-slate-900" style={{ backfaceVisibility: "hidden" }}>
              
              {/* Top Indicator */}
              <span className="text-[10px] font-mono uppercase tracking-widest text-slate-400 flex items-center gap-1 group-hover:text-cyan transition-colors mb-2 drop-shadow-md">
                <Sparkles className="size-3" /> Compound
              </span>

              {/* Photo Container */}
              <div className="w-20 h-20 shrink-0 rounded-full p-[2px] bg-gradient-to-tr from-cyan/60 via-slate-700 to-magenta/60 shadow-[0_4px_10px_rgba(0,0,0,0.5),inset_0_2px_5px_rgba(255,255,255,0.2)] group-hover:scale-105 transition-transform duration-300 overflow-hidden flex items-center justify-center mb-2">
                {imgError ? (
                  <div className="w-full h-full rounded-full bg-slate-900 flex items-center justify-center text-cyan shadow-inner">
                    <FlaskConical className="size-8 drop-shadow-lg" />
                  </div>
                ) : (
                  <img
                    src={compound.image}
                    alt={compound.name}
                    onError={() => setImgError(true)}
                    className="w-full h-full object-cover rounded-full shadow-[inset_0_2px_10px_rgba(0,0,0,0.8)]"
                    loading="lazy"
                  />
                )}
              </div>

              {/* Compound Name */}
              <div className="w-full text-center px-10">
                <h3 className="text-[15px] font-bold text-white group-hover:text-cyan transition-colors tracking-wide leading-tight line-clamp-2 drop-shadow-lg">
                  {compound.name}
                </h3>
                <p className="text-[10px] text-slate-300 group-hover:text-cyan mt-1 font-mono uppercase tracking-wider flex items-center justify-center gap-1 opacity-80 group-hover:opacity-100 transition-opacity drop-shadow-md">
                  <RefreshCw className="size-3 animate-spin-slow" /> Click for recipe
                </p>
              </div>
            </div>

            {/* Back */}
            <div className="flip-card-back absolute inset-0 w-full h-full bg-gradient-to-br from-indigo-800 via-indigo-950 to-slate-950 flex flex-col justify-center items-center px-8 py-6 text-center overflow-hidden shadow-[inset_0_-10px_25px_rgba(0,0,0,0.9),inset_0_4px_15px_rgba(255,255,255,0.1)]" style={{ backfaceVisibility: "hidden", transform: "rotateY(180deg)" }}>
              
              {/* Background Watermark */}
              <div className="absolute -right-2 -top-2 text-8xl text-white/5 blur-[1px] rotate-12 pointer-events-none drop-shadow-xl z-0">
                <Atom className="size-24" />
              </div>

              {/* Content Zone */}
              <div className="relative z-10 w-full flex flex-col items-center h-full pt-1 pb-1">
                
                {/* Top Recipe Badge */}
                <div className="w-full flex justify-center mb-3 shrink-0">
                  <div className="inline-flex items-center gap-1.5 bg-indigo-950/90 px-3 py-1 rounded-full border border-indigo-400/40 shadow-[inset_0_2px_8px_rgba(0,0,0,0.6),0_2px_5px_rgba(0,0,0,0.3)] max-w-full">
                    <FlaskConical className="size-3 text-cyan shrink-0" />
                    <span className="text-slate-300 text-[9px] uppercase tracking-wider">Recipe:</span>
                    <span className="text-white text-[11px] font-mono tracking-widest font-bold truncate drop-shadow-md">
                      {compound.mix}
                    </span>
                  </div>
                </div>

                {/* Fun Fact */}
                <div className="flex-1 flex flex-col justify-center items-center w-full px-2">
                  <h4 className="text-[10px] font-mono font-bold text-cyan uppercase tracking-[0.2em] mb-2 border-b border-indigo-500/50 pb-1 w-full text-center drop-shadow-md shrink-0">
                    Scientific Fact
                  </h4>
                  <p className="text-[14px] text-white font-semibold leading-relaxed font-sans break-words drop-shadow-md text-center w-full">
                    {compound.desc}
                  </p>
                </div>

                {/* Bottom Flip back */}
                <div className="text-[9px] font-mono uppercase tracking-widest text-indigo-300/80 flex items-center justify-center gap-1 mt-auto pt-2 opacity-70 group-hover:opacity-100 transition-opacity drop-shadow-md shrink-0 w-full">
                  <RefreshCw className="size-2.5" /> Click to flip back
                </div>
              </div>
            </div>
            
          </div>
        </div>
      </div>
    </div>
  );
}
