import { useEffect, useMemo, useRef, useState } from "react";
import { ELEMENTS, shuffle, liveCommentary, matchCompound, isCompoundInDomain, isCompoundInCurrentStage, explainFailure } from "@/features/resonance-puzzle/lib/game-data";
import { ElementTile } from "./ElementTile";
import { ObstacleGrid } from "./ObstacleGrid";
import { upsertProgress } from "@/features/mastery-dashboard/lib/progress";
import DiscoveryService from "@/features/student-discovery/services/DiscoveryService";
import UserService from "@/features/auth-user";
import { AlertTriangle, FlaskConical, Sparkles, X, Trash2, RotateCcw, Target, CheckCircle2, Lightbulb, ChevronDown, ChevronUp, BookOpen } from "lucide-react";
import { DoctorAtomAssistant } from "./DoctorAtomAssistant";
import { StageTransitionModal } from "./StageTransitionModal";
import { DoctorAtomTutorialModal } from "./DoctorAtomTutorialModal";
import { MolecularBondVisualizer } from "./MolecularBondVisualizer";
import { BohrAtomVisualizer } from "./BohrAtomVisualizer";
import { API_BASE_URL } from "@/config/apiConfig";

export function GameBoard({ nickname, domain, initialStage = 1, onCleared, onExit, onError }) {
  const [workbench, setWorkbench] = useState({});
  const [solved, setSolved] = useState([]);
  const [showHintsDropdown, setShowHintsDropdown] = useState(false);
  const [showRulesPopover, setShowRulesPopover] = useState(false);
  const [byproduct, setByproduct] = useState(null);
  const [shake, setShake] = useState(false);
  const [glow, setGlow] = useState(false);
  const [attempts, setAttempts] = useState(0);
  const [correct, setCorrect] = useState(0);
  const [hazmat, setHazmat] = useState(false);
  const [hazmatCount, setHazmatCount] = useState(0);
  const [synthLog, setSynthLog] = useState([]);
  const [justCleared, setJustCleared] = useState(0);
  const [consecutiveFailures, setConsecutiveFailures] = useState(0);
  const [showFailsafeModal, setShowFailsafeModal] = useState(false);
  const [currentStage, setCurrentStage] = useState(() => initialStage || 1);
  const [stageModalOpen, setStageModalOpen] = useState(false);
  const [showTutorialModal, setShowTutorialModal] = useState(true);
  const [discoveryVideo, setDiscoveryVideo] = useState(null);
  const [inspectedElement, setInspectedElement] = useState(null);
  const [identifiedTarget, setIdentifiedTarget] = useState(null);
  const [wrongChoiceClicked, setWrongChoiceClicked] = useState(null);

  useEffect(() => {
    setShowTutorialModal(true);
    setIdentifiedTarget(null);
  }, [currentStage]);

  const hasStages = Boolean(domain?.stages);
  const maxStages = hasStages ? Object.keys(domain.stages).length : 1;
  const activeStageData = hasStages ? (domain.stages[currentStage] || domain.stages[1]) : domain;
  const paletteOrder = activeStageData.palette || domain.palette;
  const requiredOrder = useMemo(() => shuffle(activeStageData.required || domain.required), [activeStageData, domain]);
  const validInDomain = activeStageData.validInDomain || domain.validInDomain;

  const TOTAL_BLOCKS = useMemo(() => {
    const reqCount = requiredOrder.length || 3;
    return reqCount * 6; // Each reaction clears exactly 6 blocks
  }, [requiredOrder]);

  const blocksPerReaction = useMemo(() => {
    return Math.max(1, Math.ceil(TOTAL_BLOCKS / (requiredOrder.length || 3)));
  }, [TOTAL_BLOCKS, requiredOrder]);

  const cleared = Math.min(TOTAL_BLOCKS, solved.length * blocksPerReaction);

  const currentTargetIndex = Math.min(solved.length, Math.max(0, requiredOrder.length - 1));
  const currentTarget = requiredOrder[currentTargetIndex] || requiredOrder[0];
  const isStageComplete = solved.length >= requiredOrder.length;

  // Reset identifiedTarget when advancing to a new target
  useEffect(() => {
    setIdentifiedTarget(null);
    setWrongChoiceClicked(null);
  }, [solved.length, currentStage]);

  // Generate 3 choices (1 correct + 2 stage/domain distractors) for multiple choice
  const activeStageChoices = useMemo(() => {
    if (!currentTarget) return [];
    const allStageCompounds = (activeStageData?.required || domain?.required || []).map(c => c.name);
    const otherChoices = allStageCompounds.filter(name => name !== currentTarget.name);
    const selectedDistractors = shuffle(otherChoices).slice(0, 2);
    return shuffle([currentTarget.name, ...selectedDistractors]);
  }, [currentTarget, activeStageData, domain]);

  const handleSelectCompoundChoice = (chosenName) => {
    if (chosenName === currentTarget.name) {
      setIdentifiedTarget(currentTarget);
      setWrongChoiceClicked(null);
      setByproduct(null);
    } else {
      setWrongChoiceClicked(chosenName);
      setByproduct(`Dr. Atom: Not quite! "${chosenName}" doesn't match this clue. Re-read the hint and try again!`);
      setTimeout(() => setWrongChoiceClicked(null), 1200);
    }
  };

  const startedAt = useRef(Date.now());
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt.current) / 1000)), 250);
    return () => clearInterval(t);
  }, []);

  const addElement = (s) => {
    if (hazmat && !validInDomain?.includes(s)) return;
    setWorkbench(w => ({ ...w, [s]: (w[s] ?? 0) + 1 }));
    setByproduct(null);
  };

  const removeOne = (s) => {
    setWorkbench(w => {
      const next = { ...w };
      const c = (next[s] ?? 0) - 1;
      if (c <= 0) delete next[s]; else next[s] = c;
      return next;
    });
  };

  const clearBench = () => setWorkbench({});

  const handleExitGame = async () => {
    persist({ stage: currentStage });
    try {
      await fetch(`${API_BASE_URL}/api/features/domain-interaction/reset-session`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ nickname })
      });
    } catch (e) {
      console.warn("Backend session reset skipped:", e);
    }
    onExit();
  };

  const handleAdvanceStage = () => {
    setStageModalOpen(false);
    setSolved([]);
    setWorkbench({});
    setJustCleared(0);
    setSynthLog([]);
    const nextStage = currentStage + 1;
    setCurrentStage(nextStage);
    persist({ stage: nextStage });
  };


  const persist = (extra = {}) => {
    const payload = {
      nickname,
      domain: domain.id,
      stage: extra.stage ?? currentStage,
      completed: extra.completed ?? (currentStage >= maxStages && solved.length >= requiredOrder.length),
      attempts: extra.attempts ?? attempts,
      correct: extra.correct ?? correct,
      time_seconds: Math.floor((Date.now() - startedAt.current) / 1000),
      hazmat_activations: extra.hazmat ?? hazmatCount,
    };
    upsertProgress(payload).catch((e) => onError(e?.message ?? "Failed to save progress"));
  };

  const synthesize = async () => {
    const count = Object.values(workbench).reduce((a, b) => a + (b ?? 0), 0);
    if (count < 2) {
      setByproduct("Add at least two elements before synthesizing.");
      return;
    }

    const elementList = [];
    Object.entries(workbench).forEach(([symbol, qty]) => {
      for (let i = 0; i < qty; i++) elementList.push(symbol);
    });

    const sortedElementsStr = [...elementList].sort().join("-");
    if (solved.includes(sortedElementsStr)) {
      setByproduct("Compound already synthesized in this stage. Try a different combination!");
      return;
    }

    const newAttempts = attempts + 1;
    setAttempts(newAttempts);

    try {
      const response = await fetch(`${API_BASE_URL}/api/features/domain-interaction/synthesize`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nickname: nickname,
          elements: elementList,
          time_seconds: elapsed
        })
      });

      const data = await response.json();

      switch (data.action) {
        case "UNLOCK_PATH": {
          if (!isCompoundInCurrentStage(workbench, domain, currentStage)) {
            const matchedAnywhere = matchCompound(workbench, domain, currentStage);
            const name = matchedAnywhere ? `${matchedAnywhere.name} (${matchedAnywhere.formula})` : elementList.join("");

            if (isCompoundInDomain(workbench, domain)) {
              setByproduct(`Dr. Atom: ${name} is a valid compound, but it belongs in another stage! Focus on the combinations required for Stage ${currentStage}.`);
            } else {
              setByproduct(`Dr. Atom: ${name} is a valid compound, but it uses different bonding rules! We are currently studying ${domain.name}.`);
            }
            break;
          }

          const newSolved = [...solved, sortedElementsStr];
          const newCorrect = correct + 1;

          setSolved(newSolved);
          setCorrect(newCorrect);

          const matchedCompound = matchCompound(workbench, domain, currentStage);
          const displayName = matchedCompound ? `${matchedCompound.name} (${matchedCompound.formula})` : elementList.join(" + ");
          setSynthLog(l => [`✓ Resonance Achieved: ${displayName}`, ...l].slice(0, 12));

          if (matchedCompound) {
            UserService.getCurrentUser().then(user => {
              const userId = user?.userId || "guest_id";
              const discoveryData = {
                name: matchedCompound.name,
                symbol: matchedCompound.formula,
                source: "domain",
                domainId: domain?.id || domain?.name || "domain",
                dateDiscovered: new Date().toISOString().split("T")[0],
                submissionString: elementList.join(" + ")
              };
              DiscoveryService.createDiscovery(userId, discoveryData).catch(e => console.warn("Discovery save failed:", e));
            }).catch(e => console.warn("Failed to get user:", e));

            if (matchedCompound.localVideo) {
              setDiscoveryVideo(matchedCompound);
            }
          }

          setConsecutiveFailures(0);
          setWorkbench({});
          setByproduct(null);
          setGlow(true);
          setJustCleared(blocksPerReaction);
          setTimeout(() => setGlow(false), 900);
          setTimeout(() => setJustCleared(0), 1400);

          if (hazmat) setHazmat(false);
          const doneStage = newSolved.length >= requiredOrder.length;
          const doneAll = doneStage && (currentStage >= maxStages);
          persist({ attempts: newAttempts, correct: newCorrect, completed: doneAll });

          if (doneStage) {
            if (currentStage < maxStages) {
              setTimeout(() => setStageModalOpen(true), 1200);
            } else {
              setTimeout(() => onCleared(), 1500);
            }
          }

          break;
        }

        case "TRIGGER_DIAGNOSTIC": {
          const newFails = consecutiveFailures + 1;
          setConsecutiveFailures(newFails);
          if (newFails >= 3) setShowFailsafeModal(true);

          const smartFeedback = explainFailure(workbench, currentTarget);
          setByproduct(smartFeedback || data.message);
          setShake(true);
          setTimeout(() => setShake(false), 500);

          setSynthLog(l => [`✗ Incompatible: ${elementList.join(" + ")}`, ...l].slice(0, 12));
          persist({ attempts: newAttempts });
          break;
        }



        case "LOCK_POINTER_INTERACTIONS": {
          const newFails = consecutiveFailures + 1;
          setConsecutiveFailures(newFails);
          setShowFailsafeModal(true);
          setByproduct(data.message);
          setShake(true);
          setTimeout(() => setShake(false), 500);

          if (!hazmat) {
            setHazmat(true);
            const newHazmat = hazmatCount + 1;
            setHazmatCount(newHazmat);
            persist({ attempts: newAttempts, hazmat: newHazmat });
          } else {
            persist({ attempts: newAttempts });
          }
          break;
        }

        default:
          console.warn("Unknown network routing action:", data.action);
      }
    } catch {
      onError("Resonance communication link failure. Check backend server.");
    }
  };

  const accentBadge = useMemo(() => ({
    cyan: "bg-gradient-cyan",
    magenta: "bg-gradient-magenta",
    violet: "bg-gradient-violet",
    forge: "bg-gradient-forge",
  }[domain.accent]), [domain.accent]);

  const accuracy = attempts === 0 ? 0 : Math.round((correct / attempts) * 100);
  const progressPct = (solved.length / requiredOrder.length) * 100;

  return (
    <div className="mx-auto grid max-w-[1600px] gap-3 px-2 sm:px-4 py-2.5 lg:grid-cols-[260px_1fr_270px] items-start">
      {/* Left Column: Exit, Telemetry, Obstacle Grid, Synthesized Log, Rules */}
      <aside className="space-y-2.5 lg:sticky lg:top-16 lg:self-start order-2 lg:order-1">
        <button
          onClick={handleExitGame}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-3 py-2 font-mono text-xs font-bold text-red-400 hover:bg-red-500/20 transition-all shadow-[0_0_10px_rgba(239,68,68,0.15)]"
        >
          <X className="size-4" /> EXIT GAME
        </button>

        {/* Live Telemetry */}
        <div className="rounded-2xl border border-border bg-card/70 p-2.5">
          <div className="mb-1.5 font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground font-bold">Live Telemetry</div>
          <div className="grid grid-cols-3 gap-1.5">
            <Stat label="Progress" value={`${solved.length}/${requiredOrder.length}`} accent="magenta" />
            <Stat label="Misses" value={`${attempts - correct}`} accent="cyan" />
            <Stat label="Elapsed" value={fmtTime(elapsed)} accent="violet" />
          </div>
          <div className="mt-1.5 grid grid-cols-2 gap-1.5">
            <Stat label="Accuracy" value={`${accuracy}%`} accent="cyan" />
            <Stat label="Hazmat" value={`${hazmatCount}×`} accent="magenta" />
          </div>
        </div>

        {/* Obstacle Integrity Grid */}
        <div className="rounded-2xl border border-border bg-card/80 p-2.5 shadow-md">
          <div className="mb-1.5 flex items-center justify-between text-[11px] font-mono text-muted-foreground">
            <span>Obstacle integrity</span>
            <span className="text-cyan font-bold">{TOTAL_BLOCKS - cleared} / {TOTAL_BLOCKS} blocks</span>
          </div>
          <ObstacleGrid
            total={TOTAL_BLOCKS}
            cleared={cleared}
            shake={shake}
            glow={glow}
            justCleared={justCleared}
          />
          <div className="mt-2.5 relative h-4 w-full overflow-hidden rounded-full bg-slate-950 border border-magenta/30 shadow-[inset_0_2px_4px_rgba(0,0,0,0.8)]">
            <div
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-magenta transition-all duration-1000 ease-out"
              style={{ width: `${progressPct}%` }}
            >
              <div className="absolute inset-0 bg-white/10 animate-pulse" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-[10px] font-bold tracking-widest text-white drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
                {Math.round(progressPct)}%
              </span>
            </div>
          </div>
        </div>

        {/* Synthesized Log */}
        <div className="rounded-2xl border border-border bg-card/70 p-2.5">
          <div className="mb-1.5 flex items-center justify-between">
            <div className="font-mono text-[10.5px] uppercase tracking-wider text-muted-foreground font-bold">Synthesized Log</div>
            <RotateCcw className="size-3 text-muted-foreground" />
          </div>
          {synthLog.length === 0 ? (
            <div className="text-xs italic text-muted-foreground">No reactions yet.</div>
          ) : (
            <ul className="space-y-1 font-mono text-xs max-h-[85px] overflow-y-auto">
              {synthLog.map((l, i) => (
                <li key={i} className="text-success animate-fade-up">{l}</li>
              ))}
            </ul>
          )}
        </div>

        {byproduct && (
          <div className="rounded-2xl border border-magenta/40 bg-magenta/10 p-3 text-sm text-foreground animate-fade-up">
            <div className="flex items-start gap-2">
              <Sparkles className="mt-0.5 size-4 shrink-0 text-magenta" />
              <div>
                <div className="mb-0.5 font-mono text-[10px] uppercase tracking-wider text-magenta font-bold">Meaningful byproduct</div>
                <div className="text-xs text-slate-300">{byproduct}</div>
              </div>
            </div>
          </div>
        )}
      </aside>

      {/* Center Column: Wide Landscape Workbench & Mission Clue */}
      <div className="space-y-2.5 order-1 lg:order-2 flex-1 min-w-0">
        <div className="flex flex-wrap items-center justify-between gap-2">
          <div>
            <div className={`mb-0.5 inline-flex rounded-md ${accentBadge} px-2 py-0.5 text-[9.5px] font-mono uppercase tracking-[0.25em] text-primary-foreground`}>
              Active Domain
            </div>
            <h2 className="font-pixel text-lg sm:text-xl font-bold text-glow-magenta">{domain.name}</h2>
          </div>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-full bg-slate-900 border border-slate-700 font-mono text-xs text-slate-300 font-bold">
              Stage {currentStage} / {maxStages}
            </span>
          </div>
        </div>

        {/* 2-Phase Stage Mission: Step 1 (Identification) or Step 2 (Live Electron Assembly Workbench) */}
        {!identifiedTarget && !isStageComplete ? (
          <div className="rounded-2xl border border-cyan/40 bg-slate-950/95 p-3.5 shadow-md animate-fade-down backdrop-blur-md">
            {/* Header & Overall Stage Progress */}
            <div className="flex flex-wrap items-center justify-between gap-2 pb-2.5 mb-2.5 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <span className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-cyan/20 border border-cyan/40 font-mono text-[11px] font-bold text-cyan">
                  <Target className="size-3 text-cyan" />
                  Stage Progress: {solved.length} / {requiredOrder.length || 3}
                </span>
                <span className="px-2 py-0.5 rounded-md bg-purple-500/20 border border-purple-500/40 font-mono text-[10px] font-semibold text-purple-300">
                  {domain.type === "element" ? "Covalent Sharing" : "Ionic Transfer"}
                </span>
              </div>

              {/* Step Check Indicators */}
              <div className="flex items-center gap-1">
                {Array.from({ length: requiredOrder.length || 3 }).map((_, idx) => {
                  const isDone = idx < solved.length;
                  const isCurrent = idx === solved.length;
                  return (
                    <div
                      key={idx}
                      className={`flex items-center justify-center size-5 rounded-full font-mono text-[9px] font-bold transition-all ${
                        isDone
                          ? "bg-emerald-500/20 border border-emerald-500 text-emerald-400 shadow-[0_0_8px_rgba(16,185,129,0.3)]"
                          : isCurrent
                          ? "bg-cyan/30 border border-cyan text-cyan animate-pulse shadow-[0_0_8px_rgba(6,182,212,0.5)]"
                          : "bg-slate-900 border border-slate-800 text-slate-500"
                      }`}
                    >
                      {isDone ? <CheckCircle2 className="size-3" /> : idx + 1}
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Step 1: Clue and Multiple Choice Buttons */}
            <div className="space-y-3">
              {/* Mission Clue / Riddle */}
              <div className="rounded-xl border border-cyan/30 bg-cyan/5 p-3 text-left">
                <div className="flex items-center gap-1.5 font-mono text-[10.5px] text-cyan font-bold uppercase tracking-wider mb-1.5">
                  <Lightbulb className="size-3.5 text-cyan" />
                  <span>Mission Clue #{currentTargetIndex + 1}</span>
                  {currentTarget?.missionRole && (
                    <span className="ml-1 px-1.5 py-0.2 rounded bg-purple-500/20 text-purple-300 text-[9px]">
                      {currentTarget.missionRole}
                    </span>
                  )}
                </div>
                <p className="text-sm sm:text-base text-slate-100 font-sans leading-relaxed">
                  "{currentTarget?.hint || currentTarget?.clue}"
                </p>
              </div>

              <div className="space-y-1.5">
                <div className="flex items-center justify-between font-mono text-[11px] text-slate-400">
                  <span className="font-bold text-slate-300">STEP 1: Identify which compound this is:</span>
                  <span className="text-cyan font-bold">Click an option below ↴</span>
                </div>
                <div className="grid grid-cols-1 sm:grid-cols-3 gap-2">
                  {activeStageChoices.map((choiceName) => {
                    const isWrong = wrongChoiceClicked === choiceName;
                    return (
                      <button
                        key={choiceName}
                        type="button"
                        onClick={() => handleSelectCompoundChoice(choiceName)}
                        className={`px-3 py-3 rounded-xl text-xs sm:text-sm font-pixel font-bold transition-all text-center border shadow-md ${
                          isWrong
                            ? "bg-red-500/20 border-red-500 text-red-300 animate-shake"
                            : "bg-slate-900/95 border-slate-700 hover:border-cyan hover:bg-cyan/20 hover:scale-[1.02] text-slate-100 hover:text-white"
                        }`}
                      >
                        {choiceName}
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Collapsible View of All Stage Targets & Solved Formulas */}
              <div className="pt-2 border-t border-slate-800/80">
                <button
                  type="button"
                  onClick={() => setShowHintsDropdown(!showHintsDropdown)}
                  className="flex w-full items-center justify-between px-2.5 py-1 rounded-lg bg-slate-900/60 hover:bg-slate-900 border border-slate-800 text-slate-400 text-[11px] font-mono transition-all"
                >
                  <span>Field Stage Log ({solved.length}/{requiredOrder.length || 3})</span>
                  <span className="flex items-center gap-1 text-[10px]">
                    {showHintsDropdown ? "Hide Log" : "Show Log"}
                    {showHintsDropdown ? <ChevronUp className="size-3" /> : <ChevronDown className="size-3" />}
                  </span>
                </button>

                {showHintsDropdown && (
                  <div className="flex flex-col gap-1.5 mt-2 p-2 rounded-xl bg-slate-900/95 border border-slate-800 animate-fade-down max-h-[140px] overflow-y-auto">
                    {(activeStageData?.required || domain.required || []).map((req, idx) => {
                      const reqKey = Object.entries(req.recipe).flatMap(([s, c]) => Array(c).fill(s)).sort().join("-");
                      const isSolved = solved.includes(reqKey);

                      return (
                        <div
                          key={idx}
                          className={`flex items-center justify-between p-1.5 rounded-lg text-xs font-sans ${
                            isSolved
                              ? "bg-emerald-950/30 border border-emerald-500/40 text-emerald-300"
                              : "bg-slate-950/60 border border-slate-800/80 text-slate-400"
                          }`}
                        >
                          <div className="flex items-center gap-2">
                            {isSolved ? <CheckCircle2 className="size-3.5 text-emerald-400" /> : <span className="text-[10px] font-mono text-slate-500">#{idx + 1}</span>}
                            <span className="font-pixel text-xs">{req.name}</span>
                          </div>
                          <span className="font-mono text-[10px] font-bold">
                            {isSolved ? `${req.formula} ✓` : Object.keys(req.recipe).join(" + ")}
                          </span>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          </div>
        ) : isStageComplete ? (
          <div className="p-4 text-center rounded-2xl bg-emerald-950/40 border border-emerald-500/60 shadow-lg animate-fade-in">
            <span className="font-pixel text-sm sm:text-base text-emerald-300 font-bold block mb-1">
              🎉 Stage {currentStage} Syntheses Complete!
            </span>
            <span className="font-mono text-xs text-slate-300">
              All target molecules successfully formed and verified.
            </span>
          </div>
        ) : (
          /* STEP 2: Target Identified -> Live Electron Orbital Assembly Canvas Takes the Screen */
          <div className="space-y-2.5 animate-fade-in">
            {/* Compact Top Target Identified Banner */}
            <div className="flex flex-wrap items-center justify-between gap-2 p-2.5 sm:px-3.5 rounded-xl bg-emerald-950/40 border border-emerald-500/60 shadow-md">
              <div className="flex items-center gap-2">
                <CheckCircle2 className="size-4 text-emerald-400 shrink-0" />
                <span className="font-pixel text-xs sm:text-sm text-emerald-300 font-bold">
                  Target: {identifiedTarget.name}
                </span>
                <div className="hidden sm:flex items-center gap-1 font-mono text-xs text-slate-300">
                  <span className="text-[10.5px] text-slate-400">Needs:</span>
                  {Object.keys(identifiedTarget.recipe).map((sym) => (
                    <span key={sym} className="px-1.5 py-0.2 rounded bg-cyan/15 border border-cyan/40 text-cyan text-[10px] font-bold">
                      {ELEMENTS[sym]?.name || sym} ({sym})
                    </span>
                  ))}
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className="text-[10px] font-mono text-slate-400">
                  ({solved.length + 1}/{requiredOrder.length || 3})
                </span>
                <button
                  type="button"
                  onClick={() => setIdentifiedTarget(null)}
                  className="text-[10.5px] font-mono text-slate-400 hover:text-slate-100 underline transition"
                  title="Change compound choice"
                >
                  Change Target / Clue ↺
                </button>
              </div>
            </div>

        {/* Wide Landscape Workbench & Live Electron Orbital Canvas */}
        <div className="relative rounded-2xl border border-border bg-card/80 p-2.5 sm:p-3 shadow-md text-left">
          <div className="mb-1.5 flex items-center justify-between">
            <div className="flex items-center gap-2">
              {/* Radio / Popover Toggle Button at the exact spot drawn in user sketch */}
              <div className="relative inline-block">
                <button
                  type="button"
                  onClick={() => setShowRulesPopover(prev => !prev)}
                  className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full border font-mono text-[11px] font-bold shadow-md transition-all hover:scale-105 active:scale-95 ${
                    showRulesPopover
                      ? "border-cyan bg-cyan text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.6)]"
                      : "border-cyan/70 bg-cyan/15 hover:bg-cyan/25 text-cyan"
                  }`}
                  title="Toggle Octet & Sharing Rules"
                >
                  <BookOpen className="size-3.5" />
                  <span>Rules</span>
                  <span className={`size-2 rounded-full ${showRulesPopover ? "bg-slate-950 animate-ping" : "bg-cyan animate-pulse"}`} />
                </button>

                {/* Overlapping Floating Popover Card (Matches User Sketch: localized overlay, not fullscreen) */}
                {showRulesPopover && (
                  <div className="absolute top-full left-0 mt-2 z-50 w-72 sm:w-84 rounded-2xl border-2 border-cyan/70 bg-slate-950/98 p-3.5 shadow-[0_15px_40px_rgba(0,0,0,0.9)] backdrop-blur-md animate-fade-down text-left">
                    <div className="flex items-center justify-between pb-2 mb-2 border-b border-slate-800">
                      <div className="flex items-center gap-1.5 font-mono text-xs font-bold text-cyan">
                        <BookOpen className="size-3.5 text-cyan" />
                        <span>The Octet & Sharing Rules</span>
                      </div>
                      <button
                        type="button"
                        onClick={() => setShowRulesPopover(false)}
                        className="p-1 rounded-md text-slate-400 hover:text-white hover:bg-slate-800 transition"
                        title="Close popover"
                      >
                        <X className="size-3.5" />
                      </button>
                    </div>

                    <div className="space-y-2 font-sans text-xs text-slate-300">
                      {/* Rule 1 */}
                      <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                        <div className="font-mono text-[11px] font-bold text-emerald-300 mb-0.5">
                          ✨ 1. The Octet & Duet Rule
                        </div>
                        <p className="text-slate-200 text-[11px] leading-relaxed">
                          Atoms bond to fill their outer shell with <strong className="text-emerald-300 font-bold">8 electrons</strong> (<strong className="text-cyan font-bold">2 for Hydrogen</strong>).
                        </p>
                      </div>

                      {/* Rule 2 */}
                      <div className="p-2 rounded-xl bg-slate-900/90 border border-slate-800">
                        <div className="font-mono text-[11px] font-bold text-cyan mb-0.5">
                          🤝 2. Share What You Need
                        </div>
                        <p className="text-slate-200 text-[11px] leading-relaxed mb-1.5">
                          An atom only shares as many electrons as it needs to reach 8:
                        </p>
                        <div className="grid grid-cols-2 gap-1 font-mono text-[10px]">
                          <div className="p-1 rounded bg-slate-950 border border-slate-800 text-cyan">
                            <strong>H (1 e⁻)</strong>: Shares 1
                          </div>
                          <div className="p-1 rounded bg-slate-950 border border-slate-800 text-pink-400">
                            <strong>O (6 e⁻)</strong>: Shares 2
                          </div>
                          <div className="p-1 rounded bg-slate-950 border border-slate-800 text-purple-400">
                            <strong>N (5 e⁻)</strong>: Shares 3
                          </div>
                          <div className="p-1 rounded bg-slate-950 border border-slate-800 text-amber-400">
                            <strong>C (4 e⁻)</strong>: Shares 4
                          </div>
                        </div>
                      </div>

                      {/* Cheat-sheet */}
                      <div className="p-2 rounded-xl bg-amber-950/30 border border-amber-500/40 text-[10px] font-mono text-amber-200 leading-relaxed">
                        👑 <strong>Quick Tips:</strong> Carbon forms 4 bonds. Metals (<strong className="text-amber-300">Na, Mg</strong>) donate e⁻. Noble gases (<strong className="text-slate-400">He, Ne</strong>) are inert.
                      </div>
                    </div>
                  </div>
                )}
              </div>

              <div className="flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-muted-foreground font-bold">
                <FlaskConical className="size-4 text-magenta" />
                <span>Simulation Workbench & Live Electron Canvas</span>
              </div>
            </div>

            <button
              onClick={clearBench}
              className="flex items-center gap-1.5 px-2 py-0.5 rounded-lg bg-slate-900 hover:bg-slate-800 border border-slate-700 text-xs font-mono text-muted-foreground transition hover:text-magenta"
            >
              <Trash2 className="size-3.5" /> Clear Workbench
            </button>
          </div>

          <div className="mb-2">
            <MolecularBondVisualizer
              workbench={workbench}
              target={identifiedTarget || currentTarget}
              onRemove={removeOne}
            />
          </div>

          {hazmat && (
            <div className="mt-1.5 flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-1.5 text-xs font-mono text-destructive-foreground">
              <AlertTriangle className="size-4 text-destructive shrink-0" />
              Hazmat Protocol active — irrelevant elements neutralized.
            </div>
          )}

          <button
            onClick={synthesize}
            className="mt-2 flex w-full items-center justify-center gap-2 rounded-2xl bg-gradient-to-br from-[#a855f7] via-[#ec4899] to-[#f43f5e] py-3 font-['Montserrat',sans-serif] font-[800] text-sm sm:text-base text-white shadow-[0_0_20px_rgba(236,72,153,0.4)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_30px_rgba(236,72,153,0.7)] uppercase tracking-wider active:translate-y-0"
          >
            <Sparkles className="size-4" /> Synthesize Reaction
          </button>
        </div>
      </div>
    )}
  </div>

      {/* Right Column: Element Palette */}
      <div className="space-y-2.5 order-3 lg:order-3 lg:sticky lg:top-16 lg:self-start">
        <div className="rounded-2xl border border-border bg-card/70 p-2.5 shadow-md">
          <div className="mb-1.5 flex items-center justify-between font-mono text-[10px] uppercase tracking-wider text-muted-foreground">
            <span>Element Palette</span>
            <span className="text-[9px] text-cyan">Click to Place</span>
          </div>
          <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-2 gap-1.5 items-center justify-items-center">
            {paletteOrder.map((s, idx) => (
              <ElementTile
                key={s}
                symbol={s}
                index={idx}
                disabled={hazmat && !validInDomain?.includes(s)}
                onAdd={addElement}
              />
            ))}
          </div>
          <div className="mt-2 p-1.5 rounded-xl bg-slate-950/60 border border-slate-800 text-[9.5px] font-mono text-slate-400 text-center leading-tight">
            💡 Click tiles to add atoms. Hover for outer orbital details!
          </div>
        </div>
      </div>

      {showTutorialModal && (
        <DoctorAtomTutorialModal
          domainId={domain?.id}
          currentStage={currentStage}
          onClose={() => setShowTutorialModal(false)}
        />
      )}

      {showFailsafeModal && (
        <div className="fixed top-20 right-6 z-50 w-80 sm:w-96 rounded-2xl border border-cyan/50 bg-slate-950/95 p-4 shadow-[0_0_30px_rgba(6,182,212,0.3)] animate-fade-down backdrop-blur-md">
          <div className="flex items-center justify-between mb-2 pb-2 border-b border-slate-800">
            <span className="font-mono text-xs font-bold text-cyan uppercase tracking-wider">
              Doctor Atom Advice
            </span>
            <button
              onClick={() => setShowFailsafeModal(false)}
              className="text-slate-400 hover:text-white text-xs font-mono px-2 py-0.5 rounded bg-slate-800 hover:bg-slate-700"
            >
              ✕ Close
            </button>
          </div>

          <DoctorAtomAssistant
            title="Doctor Atom"
            message={`${consecutiveFailures} attempts made without a match! Tip for ${domain.name}: Check your valence electrons. Pair elements so offered electrons equal needed electrons!`}
            isTalking={true}
          />

          <div className="mt-3 flex items-center justify-between pt-2 border-t border-slate-800/80">
            <span className="font-mono text-[10px] text-amber-400">
              ⚡ Failsafe protocol active: Decoys dimmed
            </span>
            <button
              onClick={() => setShowFailsafeModal(false)}
              className="rounded-full bg-cyan px-4 py-1 font-mono text-[11px] font-bold text-slate-950 hover:bg-cyan/80 transition"
            >
              Got It, Let's Try!
            </button>
          </div>
        </div>
      )}
      {stageModalOpen && (
        <StageTransitionModal
          currentStage={currentStage}
          maxStages={maxStages}
          domain={domain}
          nextStageData={domain.stages?.[currentStage + 1]}
          onAdvanceStage={handleAdvanceStage}
          onReturnHome={onExit}
        />
      )}



      {discoveryVideo && (
        <div className="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-black/90 backdrop-blur-md animate-fade-up">
          <div className="relative w-full max-w-4xl bg-slate-950 border border-cyan/50 rounded-3xl shadow-[0_0_60px_rgba(6,182,212,0.4)] overflow-hidden">
            <div className="p-5 border-b border-slate-800/80 flex justify-between items-center bg-slate-900/40">
              <div className="flex items-center gap-3">
                <Sparkles className="w-6 h-6 text-cyan animate-pulse" />
                <h3 className="font-pixel text-2xl text-white tracking-wider">{discoveryVideo.name} Synthesized!</h3>
              </div>
              <button onClick={() => setDiscoveryVideo(null)} className="text-slate-400 hover:text-white transition bg-slate-800/50 hover:bg-slate-700 p-2 rounded-xl">
                <X className="w-6 h-6" />
              </button>
            </div>
            <div className="relative aspect-video bg-black flex items-center justify-center">
              <video
                key={discoveryVideo.localVideo}
                src={discoveryVideo.localVideo}
                controls
                autoPlay
                preload="metadata"
                className="absolute inset-0 w-full h-full object-contain"
              />
            </div>
            <div className="p-5 bg-slate-900/60 flex justify-between items-center border-t border-slate-800/80">
              <div className="text-sm font-mono text-cyan/70">
                Educational Broadcast • {discoveryVideo.formula}
              </div>
              <button
                onClick={() => setDiscoveryVideo(null)}
                className="px-8 py-3 bg-gradient-to-r from-cyan to-blue-500 text-white font-bold font-mono text-sm rounded-full hover:scale-105 transition shadow-[0_0_20px_rgba(6,182,212,0.5)] uppercase tracking-wider"
              >
                Got It
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

function Stat({ label, value, accent }) {
  const color = accent === "magenta" ? "text-magenta" : accent === "cyan" ? "text-cyan" : "text-violet";
  return (
    <div className="rounded-lg border border-border bg-background/40 p-2">
      <div className="font-mono text-[10px] uppercase tracking-wider text-muted-foreground">{label}</div>
      <div className={`mt-0.5 font-display text-lg font-bold ${color}`}>{value}</div>
    </div>
  );
}

function fmtTime(s) {
  const m = Math.floor(s / 60).toString().padStart(2, "0");
  const ss = (s % 60).toString().padStart(2, "0");
  return `${m}:${ss}`;
}
