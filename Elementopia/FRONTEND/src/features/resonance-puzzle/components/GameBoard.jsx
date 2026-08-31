import { useEffect, useMemo, useRef, useState } from "react";
import { ELEMENTS, shuffle, liveCommentary, matchCompound, isCompoundInDomain } from "@/features/resonance-puzzle/lib/game-data";
import { ElementTile } from "./ElementTile";
import { ObstacleGrid } from "./ObstacleGrid";
import { upsertProgress } from "@/features/mastery-dashboard/lib/progress";
import DiscoveryService from "@/features/student-discovery/services/DiscoveryService";
import UserService from "@/features/auth-user";
import { AlertTriangle, FlaskConical, Sparkles, X, Trash2, RotateCcw } from "lucide-react";
import { DoctorAtomAssistant } from "./DoctorAtomAssistant";
import { StageTransitionModal } from "./StageTransitionModal";
import { DoctorAtomTutorialModal } from "./DoctorAtomTutorialModal";
import { MolecularBondVisualizer } from "./MolecularBondVisualizer";

export function GameBoard({ nickname, domain, initialStage = 1, onCleared, onExit, onError }) {
  const [workbench, setWorkbench] = useState({});
  const [solved, setSolved] = useState([]);
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

  useEffect(() => {
    setShowTutorialModal(true);
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
      await fetch("http://localhost:8080/api/features/domain-interaction/reset-session", {
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
      const response = await fetch("http://localhost:8080/api/features/domain-interaction/synthesize", {
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
          if (!isCompoundInDomain(workbench, domain)) {
            const matchedAnywhere = matchCompound(workbench, domain, currentStage);
            const name = matchedAnywhere ? matchedAnywhere.name : elementList.join("");
            
            setByproduct(`Dr. Atoms: ${name} is a valid compound, but it uses different bonding rules! We are currently studying ${domain.name}.`);
            break;
          }

          const newSolved = [...solved, sortedElementsStr];
          const newCorrect = correct + 1;

          setSolved(newSolved);
          setCorrect(newCorrect);
          setSynthLog(l => [`✓ Resonance Achieved: ${elementList.join(" + ")}`, ...l].slice(0, 12));

          const matchedCompound = matchCompound(workbench, domain, currentStage);
          if (matchedCompound) {
            const reqList = activeStageData.required || domain.required;
            const isPrimary = reqList && reqList[0] && matchedCompound.formula === reqList[0].formula;

            if (!isPrimary) {
              UserService.getCurrentUser().then(user => {
                if (user && user.userId) {
                  const discoveryData = {
                    name: matchedCompound.name,
                    dateDiscovered: new Date().toISOString(),
                    submissionString: elementList.join(" + ")
                  };
                  DiscoveryService.createDiscovery(user.userId, discoveryData).catch(e => console.warn("Discovery save failed:", e));
                }
              }).catch(e => console.warn("Failed to get user:", e));
            }
            
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

          setByproduct(data.message);
          setShake(true);
          setTimeout(() => setShake(false), 500);

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
    <div className="mx-auto grid max-w-7xl gap-4 px-4 py-4 lg:grid-cols-[280px_1.6fr_1fr] items-start">
      {/* Right Column */}
      <aside className="space-y-3 lg:sticky lg:top-16 lg:self-start order-3 lg:order-1">
        <button
          onClick={handleExitGame}
          className="flex w-full items-center justify-center gap-2 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-2.5 font-mono text-xs font-bold text-red-400 hover:bg-red-500/20 transition-all shadow-[0_0_10px_rgba(239,68,68,0.15)]"
        >
          <X className="size-4" /> EXIT GAME
        </button>
        <div className="rounded-2xl border border-border bg-card/70 p-3">
          <div className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">Live Telemetry</div>
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Progress" value={`${solved.length}/${requiredOrder.length}`} accent="magenta" />
            <Stat label="Misses" value={`${attempts - correct}`} accent="cyan" />
            <Stat label="Elapsed" value={fmtTime(elapsed)} accent="violet" />
          </div>
          <div className="mt-2 grid grid-cols-2 gap-2">
            <Stat label="Accuracy" value={`${accuracy}%`} accent="cyan" />
            <Stat label="Hazmat" value={`${hazmatCount}×`} accent="magenta" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/70 p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="font-mono text-xs uppercase tracking-wider text-muted-foreground">Synthesized</div>
            <RotateCcw className="size-3 text-muted-foreground" />
          </div>
          {synthLog.length === 0 ? (
            <div className="text-xs italic text-muted-foreground">No reactions yet.</div>
          ) : (
            <ul className="space-y-1 font-mono text-xs">
              {synthLog.map((l, i) => (
                <li key={i} className="text-success animate-fade-up">{l}</li>
              ))}
            </ul>
          )}
        </div>

        <div className="rounded-2xl border border-cyan/30 bg-cyan/5 p-3.5 shadow-[0_0_12px_oklch(0.82_0.18_200/0.05)] animate-fade-up">
          <div className="mb-1.5 flex items-center gap-1.5 font-mono text-xs uppercase tracking-wider text-cyan/70">
            <Sparkles className="size-3.5 text-cyan animate-pulse" /> Objective
          </div>
          <div className="font-mono text-[11px] leading-relaxed text-foreground/80">
            Three valid syntheses dissolve the obstacle. Deduce compounds from elements and your story.
          </div>
        </div>

        {byproduct && (
          <div className="rounded-2xl border border-magenta/40 bg-magenta/10 p-3.5 text-sm text-foreground animate-fade-up">
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

      {/* Center */}
      <div className="space-y-3 order-1 lg:order-2">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className={`mb-1 inline-flex rounded-md ${accentBadge} px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.25em] text-primary-foreground`}>
              Active Domain
            </div>
            <h2 className="font-pixel text-xl font-bold text-glow-magenta sm:text-2xl">{domain.name}</h2>
          </div>
        </div>
        <div>
          <div className="mb-2 flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span>Obstacle integrity</span>
            <span className="text-cyan">{TOTAL_BLOCKS - cleared} / {TOTAL_BLOCKS} blocks</span>
          </div>
          <ObstacleGrid
            total={TOTAL_BLOCKS}
            cleared={cleared}
            shake={shake}
            glow={glow}
            justCleared={justCleared}
          />
          <div className="mt-3 relative h-5 w-full overflow-hidden rounded-full bg-slate-950 border border-magenta/30 shadow-[inset_0_2px_5px_rgba(0,0,0,0.8)]">
            <div 
              className="absolute top-0 left-0 h-full bg-gradient-to-r from-purple-600 to-magenta transition-all duration-1000 ease-out" 
              style={{ width: `${progressPct}%` }} 
            >
              <div className="absolute inset-0 bg-white/10 animate-pulse" />
            </div>
            <div className="absolute inset-0 flex items-center justify-center">
              <span className="font-mono text-[11px] font-bold tracking-widest text-white drop-shadow-[0_1px_2px_rgba(0,0,0,1)]">
                {Math.round(progressPct)}%
              </span>
            </div>
          </div>
        </div>
      </div>
      {/* Left Column */}
      <div className="space-y-3 order-2 lg:order-3">
        <div className="rounded-2xl border border-border bg-card/70 p-3">
          <div className="mb-2 flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              <FlaskConical className="size-3.5 text-magenta" /> Workbench
            </div>
            <button onClick={clearBench} className="flex items-center gap-1 text-xs text-muted-foreground transition hover:text-magenta">
              <Trash2 className="size-3" /> Clear
            </button>
          </div>

          <div className="mb-2">
            <MolecularBondVisualizer workbench={workbench} onRemove={removeOne} />
          </div>

          {hazmat && (
            <div className="mt-2 flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs font-mono text-destructive-foreground">
              <AlertTriangle className="size-4 text-destructive" />
              Hazmat Protocol active — irrelevant elements neutralized. Focus on what's left.
            </div>
          )}

          <button
            onClick={synthesize}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-full bg-gradient-to-br from-[#a855f7] to-[#ec4899] py-3 font-['Montserrat',sans-serif] font-[800] text-[0.9rem] text-white shadow-[0_0_15px_rgba(236,72,153,0.3)] transition-all duration-300 hover:-translate-y-0.5 hover:shadow-[0_0_20px_rgba(236,72,153,0.5)] uppercase tracking-wider"
          >
            <Sparkles className="size-4" /> Synthesize
          </button>
        </div>

        <div className="rounded-2xl border border-border bg-card/40 p-2 md:p-3">
          <div className="mb-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Element Palette · hover for properties
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-3 items-center justify-items-center">
            {paletteOrder.map(s => (
              <ElementTile
                key={s}
                symbol={s}
                disabled={hazmat && !validInDomain?.includes(s)}
                onAdd={addElement}
              />
            ))}
          </div>
        </div>

        <div className="rounded-xl border border-cyan/30 bg-cyan/5 p-3 shadow-[0_0_15px_rgba(6,182,212,0.1)]">
          <div className="mb-1 flex items-center justify-between font-mono text-[10px] font-bold text-cyan uppercase tracking-wider">
            <span>🧪 Bond Analyzer</span>
            <span className="text-[9px] text-cyan/70">Realtime Reasoning</span>
          </div>
          <div className="font-mono text-xs leading-relaxed text-slate-200">
            {liveCommentary(workbench)}
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
