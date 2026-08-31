import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { SiteHeader } from "@/components/common/SiteHeader";
import { WORKSHOP_SLIDES } from "../data/slides-data";
import { DrAtomAvatar } from "../components/DrAtomAvatar";
import { InteractivePeriodicMap } from "../components/InteractivePeriodicMap";
import { BohrModelVisualizer } from "../components/BohrModelVisualizer";
import { TileAnatomyVisualizer } from "../components/TileAnatomyVisualizer";
import { BondingTheater } from "../components/BondingTheater";
import {
  RadiusTrendVisualizer,
  IonizationTrendVisualizer,
  GoldenRuleSummary,
} from "../components/TrendVisualizers";
import { Sparkles, Atom, Compass, ArrowRight, LayoutDashboard, FlaskConical, RotateCcw, X, Award } from "lucide-react";

export function DrAtomWorkshopPage() {
  const [currentSlideIndex, setCurrentSlideIndex] = useState(0);
  const [activeElementNum, setActiveElementNum] = useState(1);
  const [selectedGroup, setSelectedGroup] = useState(null);
  const [selectedPeriod, setSelectedPeriod] = useState(null);
  const [customSubtitle, setCustomSubtitle] = useState(null);
  const [showCompletionModal, setShowCompletionModal] = useState(false);
  const navigate = useNavigate();

  const currentSlide = WORKSHOP_SLIDES[currentSlideIndex];

  const handleNext = () => {
    if (currentSlideIndex < WORKSHOP_SLIDES.length - 1) {
      const nextIdx = currentSlideIndex + 1;
      setCurrentSlideIndex(nextIdx);
      setCustomSubtitle(null);
      setSelectedGroup(null);
      setSelectedPeriod(null);
      if (WORKSHOP_SLIDES[nextIdx].defaultElement) {
        setActiveElementNum(WORKSHOP_SLIDES[nextIdx].defaultElement);
      }
    } else {
      setShowCompletionModal(true);
    }
  };

  const handlePrev = () => {
    if (currentSlideIndex > 0) {
      const prevIdx = currentSlideIndex - 1;
      setCurrentSlideIndex(prevIdx);
      setCustomSubtitle(null);
      setSelectedGroup(null);
      setSelectedPeriod(null);
      if (WORKSHOP_SLIDES[prevIdx].defaultElement) {
        setActiveElementNum(WORKSHOP_SLIDES[prevIdx].defaultElement);
      }
    }
  };

  const handleGoToSlide = (idx) => {
    setCurrentSlideIndex(idx);
    setCustomSubtitle(null);
    setSelectedGroup(null);
    setSelectedPeriod(null);
    if (WORKSHOP_SLIDES[idx].defaultElement) {
      setActiveElementNum(WORKSHOP_SLIDES[idx].defaultElement);
    }
  };

  const handleActionClick = (act) => {
    if (act.elementNum) {
      setActiveElementNum(act.elementNum);
    }
    if (act.groupNum) {
      setSelectedGroup(act.groupNum);
    }
    if (act.periodNum) {
      setSelectedPeriod(act.periodNum);
    }
  };

  const renderActiveVisualizer = () => {
    switch (currentSlide.visualizerType) {
      case "bohr":
        return <BohrModelVisualizer elementNum={activeElementNum} />;
      case "anatomy":
        return <TileAnatomyVisualizer />;
      case "bonding-theater":
        return <BondingTheater onSubtitleUpdate={(msg) => setCustomSubtitle(msg)} />;
      case "trend-radius":
        return <RadiusTrendVisualizer />;
      case "trend-ionization":
        return <IonizationTrendVisualizer />;
      case "bonding-rule-summary":
        return <GoldenRuleSummary />;
      default:
        return (
          <div className="text-center py-4 text-slate-400 text-xs font-mono">
            Explore the highlighted elements on Dr. Atom's interactive map above!
          </div>
        );
    }
  };

  return (
    <div className="elementopia-scope min-h-screen grid-bg text-foreground flex flex-col bg-slate-950">
      <SiteHeader />

      <main className="mx-auto max-w-[1400px] w-full px-4 sm:px-8 lg:px-12 py-8 flex-1 flex flex-col">
        {/* Page Top Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-6 pb-4 border-b border-slate-800">
          <div>
            <p className="font-mono text-xs text-cyan tracking-[0.3em] uppercase mb-1 flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-cyan" /> INTERACTIVE TUTORIAL
            </p>
            <h1
              className="font-display text-3xl sm:text-4xl font-bold text-white flex items-center gap-3"
              style={{ textShadow: "0 0 25px rgba(6,182,212,0.4)" }}
            >
              <Atom className="size-8 text-cyan shrink-0" /> Dr. Atom's Workshop
            </h1>
          </div>

          <div className="flex items-center gap-3">
            <span className="text-xs font-mono text-slate-400">
              Lesson <strong className="text-cyan">{currentSlideIndex + 1}</strong> of{" "}
              {WORKSHOP_SLIDES.length}: <span className="text-white">{currentSlide.title}</span>
            </span>
          </div>
        </div>

        {/* 2-Column Workshop Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-start pb-12">
          {/* Left Column: Periodic Table Map + Interactive Sub-Widget */}
          <div className="lg:col-span-2 space-y-6">
            {/* Interactive Map Box */}
            <div className="glass-panel p-5 rounded-3xl border border-slate-800/80 bg-slate-900/60 shadow-[0_4px_30px_rgba(0,0,0,0.5)]">
              <div className="flex items-center justify-between mb-3 text-xs font-mono">
                <span className="font-bold text-cyan flex items-center gap-1.5 uppercase tracking-wider">
                  <Compass className="size-3.5 text-cyan" /> Interactive Periodic Map
                </span>
                <span className="text-slate-400 text-[11px]">
                  Click any element tile to inspect
                </span>
              </div>

              {/* 18-Col Grid Map */}
              <InteractivePeriodicMap
                activeSlide={currentSlide}
                selectedGroup={selectedGroup}
                selectedPeriod={selectedPeriod}
                activeElementNum={activeElementNum}
                onSelectElement={(num) => setActiveElementNum(num)}
              />
            </div>

            {/* Sub-Widget (Bohr / Anatomy / Bonding / Trends) */}
            <div className="glass-panel p-5 rounded-3xl border border-slate-800/80 bg-slate-900/60 shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex flex-col items-center">
              {renderActiveVisualizer()}
            </div>
          </div>

          {/* Right Column: Dr. Atom Avatar, Subtitles & Slide Controls */}
          <div className="glass-panel p-6 rounded-3xl border border-slate-800/80 bg-slate-900/60 shadow-[0_4px_30px_rgba(0,0,0,0.5)] flex flex-col items-center sticky top-24">
            <DrAtomAvatar
              currentSlideIndex={currentSlideIndex}
              totalSlides={WORKSHOP_SLIDES.length}
              currentSlide={{
                ...currentSlide,
                subtitle: customSubtitle || currentSlide.subtitle,
              }}
              onPrev={handlePrev}
              onNext={handleNext}
              onGoToSlide={handleGoToSlide}
              onActionClick={handleActionClick}
            />
          </div>
        </div>
      </main>

      {/* Workshop Completion Modal */}
      {showCompletionModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fade-in">
          <div className="glass-panel p-6 sm:p-8 rounded-3xl max-w-md w-full text-center space-y-6 relative border border-cyan/40 shadow-[0_0_50px_rgba(6,182,212,0.3)] bg-slate-950/95">
            {/* Close Button */}
            <button
              onClick={() => setShowCompletionModal(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full bg-slate-900 border border-slate-800 text-slate-400 hover:text-white flex items-center justify-center transition cursor-pointer"
            >
              <X className="size-4" />
            </button>

            {/* Dr. Atom Avatar in Modal */}
            <div className="w-24 h-24 mx-auto rounded-full bg-cyan-500/10 border-2 border-cyan/40 p-2 flex items-center justify-center shadow-[0_0_25px_rgba(6,182,212,0.3)]">
              <img
                src="/doctor_atom_talking.gif"
                alt="Dr. Atom"
                className="w-full h-full object-contain"
              />
            </div>

            <div className="space-y-2">
              <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-cyan-500/20 text-cyan text-xs font-mono font-bold uppercase tracking-wider">
                <Award className="size-3.5" /> Workshop Complete
              </div>
              <h2 className="text-2xl font-bold text-white tracking-wide font-display">
                Splendid Job, Alchemist!
              </h2>
              <p className="text-xs text-slate-300 leading-relaxed max-w-xs mx-auto">
                You've completed all 8 lessons in <strong>Dr. Atom's Workshop</strong> and mastered the fundamental building blocks of matter!
              </p>
            </div>

            {/* Navigation Choices */}
            <div className="flex flex-col gap-3 pt-2">
              <button
                onClick={() => navigate("/student-home-page")}
                className="w-full py-3 px-4 rounded-xl bg-slate-900 border border-slate-700 hover:border-cyan text-white text-sm font-semibold flex items-center justify-center gap-2.5 transition-all hover:bg-slate-800 shadow-md cursor-pointer group"
              >
                <LayoutDashboard className="size-4 text-cyan group-hover:scale-110 transition-transform" />
                Return to Dashboard
              </button>

              <button
                onClick={() => navigate("/student/gallery")}
                className="w-full py-3 px-4 rounded-xl bg-gradient-to-r from-cyan to-blue-500 text-black font-bold text-sm flex items-center justify-center gap-2.5 hover:scale-[1.02] transition-all shadow-[0_0_20px_rgba(6,182,212,0.4)] cursor-pointer"
              >
                <FlaskConical className="size-4" />
                Explore Compound Gallery
              </button>

              <button
                onClick={() => {
                  setShowCompletionModal(false);
                  setCurrentSlideIndex(0);
                  setActiveElementNum(1);
                  setSelectedGroup(null);
                  setSelectedPeriod(null);
                }}
                className="w-full py-2 px-4 rounded-xl text-slate-400 hover:text-white text-xs font-mono flex items-center justify-center gap-1.5 transition-colors cursor-pointer"
              >
                <RotateCcw className="size-3.5" />
                Review Workshop from Beginning
              </button>
            </div>
          </div>
        </div>
      )}

      <footer className="border-t border-slate-800 py-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500 mt-auto shrink-0 bg-slate-950">
        Elementopia · Dr. Atom's Workshop · Periodic Foundations Academy
      </footer>
    </div>
  );
}
export default DrAtomWorkshopPage;
