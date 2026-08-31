import React, { useState } from "react";
import { Play } from "lucide-react";

export function BondingTheater({ onSubtitleUpdate }) {
  const [scenario, setScenario] = useState("ionic"); // "ionic" or "neon"
  const [animating, setAnimating] = useState(false);
  const [transferred, setTransferred] = useState(false);
  const [rejected, setRejected] = useState(false);

  const handleScenarioChange = (scen) => {
    setScenario(scen);
    setAnimating(false);
    setTransferred(false);
    setRejected(false);
    if (scen === "ionic") {
      onSubtitleUpdate &&
        onSubtitleUpdate(
          `<strong>Dr. Atom:</strong> "Let's see synthesis in action! Click 'Play Animation' below to watch Sodium and Chlorine form an ionic bond!"`
        );
    } else {
      onSubtitleUpdate &&
        onSubtitleUpdate(
          `<strong>Dr. Atom:</strong> "Now let's try bonding Sodium with Neon (a Noble Gas)! Watch what happens when you click 'Play Animation'!"`
        );
    }
  };

  const handlePlayAnimation = () => {
    if (animating) return;
    setAnimating(true);
    setTransferred(false);
    setRejected(false);

    if (scenario === "ionic") {
      onSubtitleUpdate &&
        onSubtitleUpdate(
          `<strong>Dr. Atom:</strong> "Watch closely! Sodium is transferring its 1 outer electron to Chlorine to reach stability!"`
        );

      setTimeout(() => {
        setTransferred(true);
        setAnimating(false);
        onSubtitleUpdate &&
          onSubtitleUpdate(
            `<strong>Dr. Atom:</strong> "Perfect! They both have full outer shells now! They form an Ionic Bond to create Table Salt (NaCl)."`
          );
      }, 1100);
    } else {
      onSubtitleUpdate &&
        onSubtitleUpdate(
          `<strong>Dr. Atom:</strong> "Sodium throws its electron, hoping Neon will catch it..."`
        );

      setTimeout(() => {
        setRejected(true);
        onSubtitleUpdate &&
          onSubtitleUpdate(
            `<strong>Dr. Atom:</strong> "BOING! Neon's outer shell is completely full (8 electrons). It refuses to accept Sodium's electron!"`
          );
      }, 1050);

      setTimeout(() => {
        setAnimating(false);
      }, 2050);
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full relative py-2">
      {/* Scenario Toggles */}
      <div className="flex gap-2 bg-slate-900 p-1 rounded-lg border border-slate-700 mb-6 mt-2 relative z-30 pointer-events-auto">
        <button
          onClick={() => handleScenarioChange("ionic")}
          className={`px-3 py-1 rounded text-[9px] font-bold transition cursor-pointer ${
            scenario === "ionic"
              ? "bg-cyan-500/20 text-cyan-300"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Na + Cl (Ionic)
        </button>
        <button
          onClick={() => handleScenarioChange("neon")}
          className={`px-3 py-1 rounded text-[9px] font-bold transition cursor-pointer ${
            scenario === "neon"
              ? "bg-cyan-500/20 text-cyan-300"
              : "text-gray-400 hover:text-white"
          }`}
        >
          Na + Ne (Noble)
        </button>
      </div>

      {/* Atoms Display */}
      <div className="flex items-center justify-between w-full max-w-[280px] relative">
        {/* Sodium (Na) Atom */}
        <div
          className={`relative w-24 h-24 flex items-center justify-center rounded-full transition-all duration-500 ${
            transferred ? "anim-glow" : ""
          }`}
        >
          <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-32 text-center text-[7px] text-rose-200 bg-rose-900/50 p-1 rounded border border-rose-500/30">
            {transferred ? (
              <span>Lost 1 electron.<br />Inner shell full (+1)!</span>
            ) : (
              <span>Has 1 extra electron.<br />Wants to lose it!</span>
            )}
          </div>
          <div className="w-6 h-6 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 flex items-center justify-center text-[8px] font-bold text-black z-10">
            +11
          </div>
          <div
            className="absolute w-12 h-12 rounded-full border border-dashed border-rose-500/30"
            style={{ animation: "spin 10s linear infinite" }}
          >
            <div className="absolute w-1.5 h-1.5 rounded-full bg-rose-400 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-rose-400 bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2" />
          </div>
          <div
            className="absolute rounded-full border border-dashed border-rose-500/30"
            style={{
              animation: "spin 15s linear infinite reverse",
              width: "72px",
              height: "72px",
            }}
          >
            <div className="absolute w-1.5 h-1.5 rounded-full bg-rose-400" style={{ top: "10%", left: "10%" }} />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-rose-400" style={{ top: "10%", right: "10%" }} />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-rose-400" style={{ bottom: "10%", left: "10%" }} />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-rose-400" style={{ bottom: "10%", right: "10%" }} />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-rose-400" style={{ top: "50%", left: "-3px" }} />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-rose-400" style={{ top: "50%", right: "-3px" }} />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-rose-400" style={{ left: "50%", top: "-3px" }} />
            <div className="absolute w-1.5 h-1.5 rounded-full bg-rose-400" style={{ left: "50%", bottom: "-3px" }} />
          </div>
          <div
            className="absolute w-24 h-24 rounded-full border border-dashed border-rose-500/50"
            style={{
              animation: animating ? "none" : "spin 20s linear infinite",
            }}
          >
            {!transferred && (
              <div
                className={`absolute w-2 h-2 rounded-full bg-rose-400 shadow-[0_0_8px_#fb7185] top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 transition-all duration-1000 ${
                  animating
                    ? scenario === "ionic"
                      ? "translate-x-28 translate-y-12 scale-125 bg-cyan-300 shadow-[0_0_12px_#22d3ee]"
                      : "translate-x-20 translate-y-8 scale-110"
                    : ""
                }`}
              />
            )}
          </div>
          <div className="absolute -bottom-6 text-[10px] font-bold text-gray-400 font-mono">Na</div>
        </div>

        {/* Spacer / Transfer Arrow */}
        <div className="w-16 h-px relative flex items-center justify-center">
          <span
            className={`text-gray-600 text-xs font-mono transition-opacity duration-300 ${
              animating ? "opacity-100 text-cyan-400" : "opacity-0"
            }`}
          >
            ➔
          </span>
        </div>

        {/* Chlorine or Neon */}
        {scenario === "ionic" ? (
          <div
            className={`relative w-28 h-28 flex items-center justify-center rounded-full transition-all duration-500 ${
              transferred ? "anim-glow" : ""
            }`}
          >
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-32 text-center text-[7px] text-cyan-200 bg-cyan-900/50 p-1 rounded border border-cyan-500/30">
              {transferred ? (
                <span>Gained 1 electron.<br />Outer shell full (-1)!</span>
              ) : (
                <span>Has 7 valence electrons.<br />Needs 1 more to be full!</span>
              )}
            </div>
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-emerald-500 to-cyan-500 flex items-center justify-center text-[8px] font-bold text-black z-10">
              +17
            </div>
            <div
              className="absolute w-12 h-12 rounded-full border border-dashed border-emerald-500/30"
              style={{ animation: "spin 10s linear infinite" }}
            >
              <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400 bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2" />
            </div>
            <div
              className="absolute rounded-full border border-dashed border-emerald-500/30"
              style={{
                animation: "spin 15s linear infinite reverse",
                width: "72px",
                height: "72px",
              }}
            >
              <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ top: "10%", left: "10%" }} />
              <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ top: "10%", right: "10%" }} />
              <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ bottom: "10%", left: "10%" }} />
              <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ bottom: "10%", right: "10%" }} />
              <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ top: "50%", left: "-3px" }} />
              <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ top: "50%", right: "-3px" }} />
              <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ left: "50%", top: "-3px" }} />
              <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ left: "50%", bottom: "-3px" }} />
            </div>
            <div
              className="absolute w-28 h-28 rounded-full border border-dashed border-emerald-500/50"
              style={{ animation: "spin 20s linear infinite" }}
            >
              <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ top: "10%", right: "10%" }} />
              <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ bottom: "10%", left: "10%" }} />
              <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ bottom: "10%", right: "10%" }} />
              <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ top: "50%", left: "-3px" }} />
              <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ top: "50%", right: "-3px" }} />
              <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ left: "50%", top: "-3px" }} />
              <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400" style={{ left: "50%", bottom: "-3px" }} />
              {/* Target slot */}
              <div
                className={`absolute rounded-full transition-all duration-500 ${
                  transferred
                    ? "bg-cyan-300 w-2 h-2 shadow-[0_0_12px_#22d3ee] -translate-x-1/2 -translate-y-1/2 scale-125"
                    : "w-3 h-3 border border-emerald-400/50 -translate-x-1/2 -translate-y-1/2"
                }`}
                style={{ top: "10%", left: "10%" }}
              />
            </div>
            <div className="absolute -bottom-6 text-[10px] font-bold text-gray-400 font-mono">Cl</div>
          </div>
        ) : (
          <div
            className={`relative w-24 h-24 flex items-center justify-center rounded-full transition-all duration-500`}
          >
            <div className="absolute -top-10 left-1/2 transform -translate-x-1/2 w-32 text-center text-[7px] text-fuchsia-200 bg-fuchsia-900/50 p-1 rounded border border-fuchsia-500/30">
              {rejected ? (
                <span>Told you! I'm full.<br />No room for that!</span>
              ) : (
                <span>Has 8 valence electrons.<br />Already full! Won't bond!</span>
              )}
            </div>
            <div className="w-6 h-6 rounded-full bg-gradient-to-r from-fuchsia-500 to-purple-500 flex items-center justify-center text-[8px] font-bold text-black z-10">
              +10
            </div>
            <div
              className="absolute w-12 h-12 rounded-full border border-dashed border-fuchsia-500/30"
              style={{ animation: "spin 10s linear infinite" }}
            >
              <div className="absolute w-1.5 h-1.5 rounded-full bg-fuchsia-400 top-0 left-1/2 -translate-x-1/2 -translate-y-1/2" />
              <div className="absolute w-1.5 h-1.5 rounded-full bg-fuchsia-400 bottom-0 left-1/2 -translate-x-1/2 translate-y-1/2" />
            </div>
            <div
              className="absolute w-24 h-24 rounded-full border border-dashed border-fuchsia-500/50"
              style={{ animation: "spin 20s linear infinite" }}
            >
              <div className="absolute w-1.5 h-1.5 rounded-full bg-fuchsia-400" style={{ top: "10%", left: "10%" }} />
              <div className="absolute w-1.5 h-1.5 rounded-full bg-fuchsia-400" style={{ top: "10%", right: "10%" }} />
              <div className="absolute w-1.5 h-1.5 rounded-full bg-fuchsia-400" style={{ bottom: "10%", left: "10%" }} />
              <div className="absolute w-1.5 h-1.5 rounded-full bg-fuchsia-400" style={{ bottom: "10%", right: "10%" }} />
              <div className="absolute w-1.5 h-1.5 rounded-full bg-fuchsia-400" style={{ top: "50%", left: "-3px" }} />
              <div className="absolute w-1.5 h-1.5 rounded-full bg-fuchsia-400" style={{ top: "50%", right: "-3px" }} />
              <div className="absolute w-1.5 h-1.5 rounded-full bg-fuchsia-400" style={{ left: "50%", top: "-3px" }} />
              <div className="absolute w-1.5 h-1.5 rounded-full bg-fuchsia-400" style={{ left: "50%", bottom: "-3px" }} />
            </div>
            <div className="absolute -bottom-6 text-[10px] font-bold text-gray-400 font-mono">Ne</div>
          </div>
        )}
      </div>

      {/* Play Animation Button */}
      <button
        onClick={handlePlayAnimation}
        disabled={animating}
        className="mt-8 px-4 py-1.5 rounded-lg bg-gradient-to-r from-emerald-400 to-cyan-500 text-black font-semibold text-xs hover:scale-105 transition shadow-lg shadow-cyan-500/20 cursor-pointer disabled:opacity-40"
      >
        <Play className="size-3 inline fill-black mr-1" /> Play Animation
      </button>
    </div>
  );
}
