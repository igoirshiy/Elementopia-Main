import React from "react";
import { Handshake, ShieldCheck, Atom } from "lucide-react";

export function RadiusTrendVisualizer() {
  return (
    <div className="space-y-3 pb-2 w-full max-w-sm mx-auto">
      <div className="text-[11px] font-bold text-white uppercase tracking-wider text-center font-mono">
        Magnetic Pull Animation
      </div>
      <div className="relative w-full h-32 mx-auto bg-slate-950/80 rounded-xl border border-slate-800 overflow-hidden">
        {/* Ring */}
        <div
          className="absolute top-1/2 left-1/2 w-28 h-28 border border-dashed rounded-full pointer-events-none"
          style={{ animation: "ring-squeeze 6s infinite ease-in-out" }}
        />

        {/* Nucleus */}
        <div
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg pointer-events-none"
          style={{ animation: "nucleus-power 6s infinite ease-in-out" }}
        >
          <span className="absolute" style={{ animation: "text-swap-na 6s infinite" }}>
            +11
          </span>
          <span className="absolute" style={{ animation: "text-swap-cl 6s infinite" }}>
            +17
          </span>
        </div>

        {/* Labels */}
        <div
          className="absolute bottom-2 left-0 w-full text-center text-[9px] font-mono font-bold"
          style={{ animation: "text-swap-na 6s infinite" }}
        >
          <span className="text-rose-400">Sodium (Weak Pull)</span>
        </div>
        <div
          className="absolute bottom-2 left-0 w-full text-center text-[9px] font-mono font-bold"
          style={{ animation: "text-swap-cl 6s infinite" }}
        >
          <span className="text-cyan-400">Chlorine (Strong Pull)</span>
        </div>
      </div>
    </div>
  );
}

export function IonizationTrendVisualizer() {
  return (
    <div className="space-y-3 pb-2 w-full max-w-sm mx-auto">
      <div className="text-[11px] font-bold text-white uppercase tracking-wider text-center font-mono">
        Electron Grip Animation
      </div>
      <div className="relative w-full h-32 mx-auto bg-slate-950/80 rounded-xl border border-slate-800 overflow-hidden">
        {/* Line / Beam */}
        <div
          className="absolute top-1/2 pointer-events-none"
          style={{
            left: "calc(50% - 30px)",
            animation: "tractor-beam-pulse 6s infinite ease-in-out",
            transformOrigin: "left center",
          }}
        />

        {/* Nucleus */}
        <div
          className="absolute top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-8 h-8 rounded-full flex items-center justify-center text-[10px] font-bold text-white shadow-lg pointer-events-none"
          style={{
            animation: "nucleus-grip-color 6s infinite ease-in-out",
            left: "calc(50% - 30px)",
          }}
        >
          <span className="absolute" style={{ animation: "text-swap-na 6s infinite" }}>
            +11
          </span>
          <span className="absolute" style={{ animation: "text-swap-cl 6s infinite" }}>
            +17
          </span>
        </div>

        {/* Outer Electron */}
        <div
          className="absolute top-1/2 w-3.5 h-3.5 rounded-full bg-yellow-300 shadow-[0_0_8px_#facc15] flex items-center justify-center pointer-events-none"
          style={{
            animation: "electron-wobble 6s infinite ease-in-out",
            left: "calc(50% - 30px)",
            marginTop: "-7px",
            marginLeft: "-7px",
          }}
        >
          <span className="text-[8px] font-bold text-black font-mono">-e</span>
        </div>

        {/* Labels */}
        <div
          className="absolute bottom-2 left-0 w-full text-center text-[9px] font-mono font-bold"
          style={{ animation: "text-swap-na 6s infinite" }}
        >
          <span className="text-rose-400">Sodium (Weak Grip)</span>
        </div>
        <div
          className="absolute bottom-2 left-0 w-full text-center text-[9px] font-mono font-bold"
          style={{ animation: "text-swap-cl 6s infinite" }}
        >
          <span className="text-cyan-400">Chlorine (Strong Grip)</span>
        </div>
      </div>
    </div>
  );
}

export function GoldenRuleSummary() {
  return (
    <div className="space-y-4 pt-2 w-full max-w-sm mx-auto">
      {/* Will Bond Card */}
      <div className="bg-emerald-900/40 border border-emerald-500/50 p-3 rounded-xl flex items-start gap-3 relative overflow-hidden shadow-lg shadow-emerald-500/10 text-left">
        <div className="w-10 h-10 rounded-full border border-dashed border-emerald-500/50 flex items-center justify-center shrink-0 mt-0.5 relative" style={{ animation: "spin 10s linear infinite" }}>
          <div className="w-2 h-2 bg-emerald-500 rounded-full" />
          <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_#34d399] top-[10%] left-[10%]" />
          <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_#34d399] top-[10%] right-[10%]" />
          <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_#34d399] bottom-[10%] left-[10%]" />
          <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_#34d399] bottom-[10%] right-[10%]" />
          <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_#34d399] top-1/2 -left-1 -translate-y-1/2" />
          <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_#34d399] top-1/2 -right-1 -translate-y-1/2" />
          <div className="absolute w-1.5 h-1.5 rounded-full bg-emerald-400 shadow-[0_0_4px_#34d399] left-1/2 -bottom-1 -translate-x-1/2" />
          {/* Empty slot */}
          <div className="absolute w-2 h-2 rounded-full border border-dashed border-emerald-300 shadow-[0_0_8px_#34d399_inset] left-1/2 -top-1 -translate-x-1/2 animate-pulse" />
        </div>
        <div className="relative z-10">
          <h4 className="text-emerald-400 font-bold text-xs mb-1 uppercase tracking-wider font-mono">
            It WILL bond if...
          </h4>
          <p className="text-[10px] text-emerald-50 leading-relaxed font-sans">
            It doesn't have a full outer shell. It will share, steal, or give away electrons to reach the magic number (usually 8)!
          </p>
        </div>
      </div>

      {/* Will Not Bond Card */}
      <div className="bg-rose-900/40 border border-rose-500/50 p-3 rounded-xl flex items-start gap-3 relative overflow-hidden shadow-lg shadow-rose-500/10 text-left">
        <div className="w-10 h-10 rounded-full border border-dashed border-rose-500/50 flex items-center justify-center shrink-0 mt-0.5 relative" style={{ animation: "spin 10s linear infinite" }}>
          <div className="w-2 h-2 bg-rose-500 rounded-full" />
          <div className="absolute w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_4px_#fb7185] top-[10%] left-[10%]" />
          <div className="absolute w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_4px_#fb7185] top-[10%] right-[10%]" />
          <div className="absolute w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_4px_#fb7185] bottom-[10%] left-[10%]" />
          <div className="absolute w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_4px_#fb7185] bottom-[10%] right-[10%]" />
          <div className="absolute w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_4px_#fb7185] top-1/2 -left-1 -translate-y-1/2" />
          <div className="absolute w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_4px_#fb7185] top-1/2 -right-1 -translate-y-1/2" />
          <div className="absolute w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_4px_#fb7185] left-1/2 -bottom-1 -translate-x-1/2" />
          <div className="absolute w-1.5 h-1.5 rounded-full bg-rose-400 shadow-[0_0_4px_#fb7185] left-1/2 -top-1 -translate-x-1/2" />
        </div>
        <div className="relative z-10">
          <h4 className="text-rose-400 font-bold text-xs mb-1 uppercase tracking-wider font-mono">
            It WILL NOT bond if...
          </h4>
          <p className="text-[10px] text-rose-50 leading-relaxed font-sans">
            It already has a full outer shell (like the Noble Gases). They are perfectly stable and want to be left alone!
          </p>
        </div>
      </div>
    </div>
  );
}
