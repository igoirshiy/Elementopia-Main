import React from "react";
import { 
  Sparkles, 
  BarChart3, 
  Grid, 
  Wrench, 
  Image as ImageIcon, 
  FlaskConical, 
  Swords, 
  Menu, 
  Zap, 
  ChevronRight, 
  ChevronLeft, 
  X, 
  Lightbulb,
  CheckCircle2 
} from "lucide-react";
import { useTour } from "../context/TourContext";

const ICON_MAP = {
  Sparkles,
  BarChart3,
  Grid,
  Wrench,
  Image: ImageIcon,
  FlaskConical,
  Swords,
  Menu,
  Zap,
};

export function TourTooltipCard({ targetRect, position = "bottom" }) {
  const {
    currentStep,
    currentStepIndex,
    totalSteps,
    nextStep,
    prevStep,
    skipTour,
    goToStep,
  } = useTour();

  if (!currentStep) return null;

  const IconComponent = ICON_MAP[currentStep.icon] || Sparkles;
  const isFirstStep = currentStepIndex === 0;
  const isLastStep = currentStepIndex === totalSteps - 1;

  return (
    <div 
      className="w-[92vw] sm:w-[420px] max-w-[460px] rounded-2xl border border-cyan-500/40 bg-slate-950/95 p-5 sm:p-6 shadow-[0_0_50px_rgba(34,211,238,0.25)] backdrop-blur-xl text-white transition-all duration-300 animate-in fade-in zoom-in-95 pointer-events-auto"
      style={{
        boxShadow: "0 0 35px rgba(6, 182, 212, 0.25), 0 20px 40px rgba(0, 0, 0, 0.8)",
      }}
    >
      {/* Top Header Row */}
      <div className="flex items-center justify-between gap-3 mb-3">
        <div className="flex items-center gap-2">
          <span className="flex size-7 items-center justify-center rounded-lg bg-cyan-500/10 border border-cyan-500/30 text-cyan-400">
            <IconComponent className="size-4" />
          </span>
          <span className="font-mono text-[10px] tracking-wider uppercase text-cyan-300 font-bold px-2 py-0.5 rounded-full bg-cyan-950/60 border border-cyan-500/30">
            {currentStep.category}
          </span>
        </div>

        <div className="flex items-center gap-2">
          <span className="font-mono text-[11px] font-bold text-slate-400 tracking-wider">
            {currentStepIndex + 1} <span className="text-slate-600">/</span> {totalSteps}
          </span>
          <button
            onClick={skipTour}
            className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition-colors cursor-pointer"
            aria-label="Close tour"
            title="Exit Tour (Esc)"
          >
            <X className="size-4" />
          </button>
        </div>
      </div>

      {/* Title */}
      <h3 className="font-pixel text-base sm:text-lg font-bold text-white mb-2 leading-snug tracking-wide">
        {currentStep.title}
      </h3>

      {/* Description */}
      <p className="text-slate-300 text-xs sm:text-[13px] leading-relaxed mb-4">
        {currentStep.description}
      </p>

      {/* Pro-Tip Box */}
      {currentStep.tip && (
        <div className="mb-5 flex items-start gap-2.5 rounded-xl border border-amber-500/25 bg-amber-950/30 p-2.5 text-xs text-amber-200">
          <Lightbulb className="size-4 shrink-0 text-amber-400 mt-0.5" />
          <span className="font-sans text-[11px] sm:text-xs text-amber-200/90 leading-tight">
            <strong className="font-semibold text-amber-300">Pro-Tip: </strong>
            {currentStep.tip}
          </span>
        </div>
      )}

      {/* Interactive Progress Dots */}
      <div className="flex items-center justify-center gap-1.5 mb-5">
        {Array.from({ length: totalSteps }).map((_, idx) => (
          <button
            key={idx}
            onClick={() => goToStep(idx)}
            className={`h-1.5 rounded-full transition-all duration-300 cursor-pointer ${
              idx === currentStepIndex
                ? "w-6 bg-cyan-400 shadow-[0_0_8px_rgba(34,211,238,0.8)]"
                : idx < currentStepIndex
                ? "w-2 bg-indigo-400/80"
                : "w-2 bg-slate-700 hover:bg-slate-500"
            }`}
            aria-label={`Jump to step ${idx + 1}`}
          />
        ))}
      </div>

      {/* Bottom Actions Row */}
      <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
        <button
          onClick={skipTour}
          className="font-mono text-[11px] text-slate-400 hover:text-white transition-colors uppercase tracking-wider cursor-pointer"
        >
          Skip Tour
        </button>

        <div className="flex items-center gap-2">
          {!isFirstStep && (
            <button
              onClick={prevStep}
              className="flex items-center gap-1 px-3 py-1.5 rounded-xl border border-slate-700 bg-slate-900/80 hover:bg-slate-800 text-xs font-medium text-slate-200 transition cursor-pointer"
            >
              <ChevronLeft className="size-3.5" />
              <span>Back</span>
            </button>
          )}

          <button
            onClick={nextStep}
            className={`flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-white shadow-lg transition-all duration-300 hover:scale-[1.02] cursor-pointer ${
              isLastStep
                ? "bg-gradient-to-r from-emerald-500 to-cyan-500 shadow-[0_0_20px_rgba(16,185,129,0.4)]"
                : "bg-gradient-to-r from-indigo-500 via-purple-500 to-magenta shadow-[0_0_20px_rgba(236,72,153,0.35)]"
            }`}
          >
            {isLastStep ? (
              <>
                <CheckCircle2 className="size-3.5" />
                <span>Finish & Play</span>
              </>
            ) : (
              <>
                <span>Next</span>
                <ChevronRight className="size-3.5" />
              </>
            )}
          </button>
        </div>
      </div>

      {/* Subtle Keyboard Navigation Hint */}
      <div className="mt-3 text-center">
        <span className="font-mono text-[9px] text-slate-500 tracking-wider">
          Navigate with <kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">←</kbd> <kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">→</kbd> · Press <kbd className="px-1 py-0.5 rounded bg-slate-900 border border-slate-800 text-slate-400">Esc</kbd> to exit
        </span>
      </div>
    </div>
  );
}
