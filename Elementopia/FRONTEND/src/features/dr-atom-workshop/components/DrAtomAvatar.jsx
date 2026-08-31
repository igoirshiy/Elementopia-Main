import React from "react";
import { ChevronLeft, ChevronRight, Sparkles } from "lucide-react";

export function DrAtomAvatar({
  currentSlideIndex,
  totalSlides,
  currentSlide,
  onPrev,
  onNext,
  onGoToSlide,
  onActionClick
}) {
  return (
    <div className="flex flex-col items-center text-center relative w-full space-y-4">
      {/* Subtitle Thought Cloud Bubble */}
      <div className="w-full min-h-[160px] flex items-center justify-center p-6 relative">
        {/* SVG Cloud Shape */}
        <svg
          viewBox="0 0 350 160"
          preserveAspectRatio="none"
          className="absolute inset-0 w-full h-full filter drop-shadow-[0_8px_20px_rgba(0,0,0,0.7)] z-0"
        >
          <path
            d="M 40 120 
               C 10 90, 20 40, 60 40 
               C 80 15, 140 15, 160 40 
               C 180 15, 240 15, 260 40 
               C 300 40, 310 90, 280 120 
               C 300 140, 260 160, 220 145 
               C 200 165, 120 165, 100 145 
               C 60 160, 20 140, 40 120 Z"
            fill="#090d16"
            stroke="#1e293b"
            strokeWidth="2"
          />
        </svg>

        {/* Thought Bubble Content */}
        <div className="z-10 relative text-center px-4 max-w-[88%] flex flex-col items-center">
          <p
            className="text-xs sm:text-sm text-slate-200 font-medium leading-relaxed"
            dangerouslySetInnerHTML={{ __html: `<strong>Dr. Atom:</strong> "${currentSlide.subtitle}"` }}
          />

          {/* Interactive Slide Action Buttons (if any) */}
          {currentSlide.actions && currentSlide.actions.length > 0 && (
            <div className="flex flex-wrap items-center justify-center gap-2 mt-3 z-20">
              {currentSlide.actions.map((act, i) => (
                <button
                  key={i}
                  onClick={() => onActionClick(act)}
                  className="px-2.5 py-1 rounded-lg bg-cyan-500/20 text-cyan-300 border border-cyan-500/40 text-[11px] font-bold font-mono hover:bg-cyan-500/30 hover:scale-105 transition-all shadow-sm"
                >
                  {act.label}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Thought bubble trail of dots */}
      <div className="flex flex-col gap-1.5 items-center -mt-2 -mb-1 select-none">
        <div className="w-3 h-3 rounded-full bg-slate-900 border border-slate-800 shadow"></div>
        <div className="w-2 h-2 rounded-full bg-slate-900 border border-slate-800 shadow"></div>
        <div className="w-1.5 h-1.5 rounded-full bg-slate-900 border border-slate-800 shadow"></div>
      </div>

      {/* Dr. Atom Avatar (GIF with seamless cutout look) */}
      <div className="w-32 h-44 flex items-center justify-center relative group select-none">
        <img
          src="/doctor_atom_talking.gif"
          alt="Dr. Atom"
          onError={(e) => {
            e.target.onerror = null;
            e.target.src = "/doctor_atom.png";
          }}
          className="w-full h-full object-contain filter drop-shadow-[0_0_15px_rgba(6,182,212,0.3)] transition-transform duration-300 group-hover:scale-105"
        />
      </div>

      <div className="text-xs font-mono font-bold text-cyan tracking-[0.2em] uppercase -mt-1 flex items-center gap-1.5">
        <Sparkles className="size-3 text-cyan" /> Dr. Atom (Workshop Mentor)
      </div>

      {/* Slide Navigation Controls */}
      <div className="flex items-center justify-between w-full pt-3 px-1 gap-2">
        <button
          onClick={onPrev}
          disabled={currentSlideIndex === 0}
          className="px-3 py-1.5 rounded-lg bg-slate-900 border border-slate-700 text-slate-400 hover:text-slate-200 text-xs font-semibold disabled:opacity-30 disabled:pointer-events-none transition flex items-center gap-1 cursor-pointer shrink-0"
        >
          <ChevronLeft className="size-3.5" /> Back
        </button>

        {/* Dots Tracker */}
        <div className="flex gap-1.5 items-center justify-center flex-wrap max-w-full">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => onGoToSlide(idx)}
              className={`p-0 m-0 border-0 rounded-full transition-all duration-300 cursor-pointer block shrink-0 ${
                idx === currentSlideIndex
                  ? "w-4 h-1.5 bg-cyan shadow-[0_0_8px_#22d3ee]"
                  : "w-1.5 h-1.5 bg-slate-700 hover:bg-slate-500"
              }`}
              style={{ padding: 0, minWidth: 0, minHeight: 0 }}
            />
          ))}
        </div>

        <button
          onClick={onNext}
          className="px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-cyan to-blue-500 text-black font-semibold text-xs hover:scale-105 transition flex items-center gap-1 shadow-md shadow-cyan/20 cursor-pointer shrink-0"
        >
          {currentSlideIndex === totalSlides - 1 ? "Finish" : "Next"} <ChevronRight className="size-3.5" />
        </button>
      </div>
    </div>
  );
}
