import { useEffect, useMemo, useRef, useState } from "react";
import { ELEMENTS, shuffle, liveCommentary, matchCompound } from "@/features/resonance-puzzle/lib/game-data";
import { ElementTile } from "./ElementTile";
import { ObstacleGrid } from "./ObstacleGrid";
import { upsertProgress } from "@/features/mastery-dashboard/lib/progress";
import DiscoveryService from "@/features/student-discovery/services/DiscoveryService";
import UserService from "@/features/auth-user";
import { AlertTriangle, FlaskConical, Sparkles, X, Trash2, RotateCcw } from "lucide-react";

const BLOCKS_PER_REACTION = 8;
const TOTAL_BLOCKS = BLOCKS_PER_REACTION * 3;

export function GameBoard({ nickname, domain, onCleared, onExit, onError }) {
  const [paletteOrder] = useState(() => domain.palette);
  const [requiredOrder] = useState(() => shuffle(domain.required));
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

  const startedAt = useRef(Date.now());
  const [elapsed, setElapsed] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setElapsed(Math.floor((Date.now() - startedAt.current) / 1000)), 250);
    return () => clearInterval(t);
  }, []);
  const cleared = solved.length * BLOCKS_PER_REACTION;

  const addElement = (s) => {
    if (hazmat && !domain.validInDomain.includes(s)) return;
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

  const persist = (extra = {}) => {
    const payload = {
      nickname,
      domain: domain.id,
      completed: extra.completed ?? (solved.length >= requiredOrder.length),
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
          const newSolved = [...solved, elementList.join("-")];
          const newCorrect = correct + 1;
          
          setSolved(newSolved);
          setCorrect(newCorrect);
          setSynthLog(l => [`✓ Resonance Achieved: ${elementList.join(" + ")}`, ...l].slice(0, 12));

          const matchedCompound = matchCompound(workbench, domain);
          if (matchedCompound) {
            // The first compound in the required array is the "primary" goal (e.g., Water for Domain 1).
            // We only want to save the "secret" alternative compounds as discoveries.
            const isPrimary = matchedCompound.formula === domain.required[0].formula;
            
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
          }

          setWorkbench({});
          setByproduct(null);
          setGlow(true);
          setJustCleared(BLOCKS_PER_REACTION);
          setTimeout(() => setGlow(false), 900);
          setTimeout(() => setJustCleared(0), 1400);

          if (hazmat) setHazmat(false);
          const done = newSolved.length >= requiredOrder.length;
          persist({ attempts: newAttempts, correct: newCorrect, completed: done });
          if (done) setTimeout(() => onCleared(), 1500);
          break;
        }
        
        case "TRIGGER_DIAGNOSTIC":
          // The standard diagnostic (less than 5 failures)
          setByproduct(data.message); 
          setShake(true);
          setTimeout(() => setShake(false), 500);
          
          persist({ attempts: newAttempts });
          break;

        case "LOCK_POINTER_INTERACTIONS":
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

        default:
          console.warn("Unknown network routing action:", data.action);
      }
    } catch {
      onError("Resonance communication link failure. Check backend server.");
    }
  };

  const accentBadge = useMemo(() => ({
    cyan:    "bg-gradient-cyan",
    magenta: "bg-gradient-magenta",
    violet:  "bg-gradient-violet",
    forge:   "bg-gradient-forge",
  }[domain.accent]), [domain.accent]);

  const accuracy = attempts === 0 ? 0 : Math.round((correct / attempts) * 100);
  const progressPct = (solved.length / requiredOrder.length) * 100;

  return (
    <div className="mx-auto grid max-w-7xl gap-6 px-4 py-6 lg:grid-cols-[1fr_320px]">
      <div className="space-y-5">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <div className={`mb-1 inline-flex rounded-md ${accentBadge} px-2 py-0.5 text-[10px] font-mono uppercase tracking-[0.25em] text-primary-foreground`}>
              Active Domain
            </div>
            <h2 className="font-display text-2xl font-bold text-glow-magenta sm:text-3xl">{domain.name}</h2>
          </div>
          <button onClick={onExit} className="flex items-center gap-1 rounded-lg border border-border bg-card/60 px-3 py-2 text-xs text-muted-foreground transition hover:text-foreground">
            <X className="size-3.5" /> Exit Domain
          </button>
        </div>

        <div>
          <div className="mb-2 flex items-center justify-between text-xs font-mono text-muted-foreground">
            <span>Obstacle integrity</span>
            <span className="text-cyan">{TOTAL_BLOCKS - cleared} / {TOTAL_BLOCKS} blocks</span>
          </div>
          <ObstacleGrid total={TOTAL_BLOCKS} cleared={cleared} shake={shake} glow={glow} justCleared={justCleared} />
          <div className="mt-3 h-1.5 w-full overflow-hidden rounded-full bg-muted">
            <div className="h-full bg-gradient-magenta transition-all duration-700" style={{ width: `${progressPct}%` }} />
          </div>
          <div className="mt-2 text-center font-mono text-[10px] uppercase tracking-[0.25em] text-muted-foreground">
            Three valid syntheses dissolve the obstacle. The compounds are not listed — deduce them from the elements and your story.
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/70 p-4">
          <div className="mb-3 flex items-center justify-between">
            <div className="flex items-center gap-2 font-mono text-xs uppercase tracking-wider text-muted-foreground">
              <FlaskConical className="size-3.5 text-magenta" /> Workbench
            </div>
            <button onClick={clearBench} className="flex items-center gap-1 text-xs text-muted-foreground transition hover:text-magenta">
              <Trash2 className="size-3" /> Clear
            </button>
          </div>
          <div className="min-h-[68px] flex flex-wrap items-center gap-2">
            {Object.entries(workbench).filter(([, n]) => (n ?? 0) > 0).length === 0 && (
              <div className="text-sm text-muted-foreground italic">Click elements below to add them…</div>
            )}
            {Object.entries(workbench).map(([sym, n]) => {
              if (!n) return null;
              const e = ELEMENTS[sym];
              return (
                <button
                  key={sym}
                  onClick={() => removeOne(sym)}
                  className={`group flex items-center gap-2 rounded-lg bg-gradient-to-br ${e.gradient} px-3 py-2 text-white shadow transition hover:scale-105`}
                  title="Click to remove one"
                >
                  <span className="font-display text-lg font-bold">{e.symbol}</span>
                  <span className="font-mono text-xs opacity-90">×{n}</span>
                  <X className="size-3 opacity-0 group-hover:opacity-80" />
                </button>
              );
            })}
          </div>

          <div className="mt-3 rounded-lg border border-cyan/30 bg-cyan/5 p-3 font-mono text-xs text-cyan/90 animate-fade-up">
            <div className="mb-0.5 text-[10px] uppercase tracking-wider text-cyan/70">Bond Analyzer</div>
            <div className="text-foreground/85">{liveCommentary(workbench)}</div>
          </div>

          {byproduct && (
            <div className="mt-3 flex items-start gap-2 rounded-lg border border-magenta/40 bg-magenta/10 p-3 text-sm text-foreground animate-fade-up">
              <Sparkles className="mt-0.5 size-4 shrink-0 text-magenta" />
              <div>
                <div className="mb-0.5 font-mono text-[10px] uppercase tracking-wider text-magenta">Meaningful byproduct</div>
                <div className="text-muted-foreground">{byproduct}</div>
              </div>
            </div>
          )}

          {hazmat && (
            <div className="mt-3 flex items-center gap-2 rounded-lg border border-destructive/40 bg-destructive/10 px-3 py-2 text-xs font-mono text-destructive-foreground">
              <AlertTriangle className="size-4 text-destructive" />
              Hazmat Protocol active — irrelevant elements neutralized. Focus on what's left.
            </div>
          )}

          <button
            onClick={synthesize}
            className="mt-4 flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-magenta py-3 font-display text-base font-semibold text-primary-foreground transition hover:opacity-90 active:scale-[0.98]"
          >
            <Sparkles className="size-4" /> Synthesize
          </button>
        </div>

        <div className="rounded-2xl border border-border bg-card/40 p-4">
          <div className="mb-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">
            Element Palette · hover for properties
          </div>
          <div className="grid grid-cols-3 gap-3 sm:grid-cols-5 md:grid-cols-6">
            {paletteOrder.map(s => (
              <ElementTile
                key={s}
                symbol={s}
                disabled={hazmat && !domain.validInDomain.includes(s)}
                onAdd={addElement}
              />
            ))}
          </div>
        </div>
      </div>

      <aside className="space-y-4 lg:sticky lg:top-20 lg:self-start">
        <div className="rounded-2xl border border-border bg-card/70 p-4">
          <div className="mb-3 font-mono text-xs uppercase tracking-wider text-muted-foreground">Live Telemetry</div>
          <div className="grid grid-cols-3 gap-2">
            <Stat label="Progress" value={`${solved.length}/${requiredOrder.length}`} accent="magenta" />
            <Stat label="Misses"   value={`${attempts - correct}`} accent="cyan" />
            <Stat label="Elapsed"  value={fmtTime(elapsed)} accent="violet" />
          </div>
          <div className="mt-3 grid grid-cols-2 gap-2">
            <Stat label="Accuracy" value={`${accuracy}%`} accent="cyan" />
            <Stat label="Hazmat"   value={`${hazmatCount}×`} accent="magenta" />
          </div>
        </div>

        <div className="rounded-2xl border border-border bg-card/70 p-4">
          <div className="mb-3 flex items-center justify-between">
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
      </aside>
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
