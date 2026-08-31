import React from "react";
import { ELEMENTS_DATA } from "../data/elements-data";

export function BohrModelVisualizer({ elementNum = 1 }) {
  const el = ELEMENTS_DATA.find((e) => e.num === elementNum) || ELEMENTS_DATA[0];

  let remaining = el.num;
  const shellCounts = [];
  shellCounts.push(Math.min(remaining, 2));
  remaining -= shellCounts[0];

  if (remaining > 0) {
    shellCounts.push(Math.min(remaining, 8));
    remaining -= shellCounts[1];
  }
  if (remaining > 0) {
    shellCounts.push(Math.min(remaining, 8));
    remaining -= shellCounts[2];
  }
  if (remaining > 0) {
    shellCounts.push(remaining);
  }

  const maxShellsToShow = Math.min(el.shells || 1, 4);
  const shellColors = [
    "border-cyan-500/30",
    "border-rose-500/30",
    "border-amber-500/30",
    "border-emerald-500/30",
  ];
  const electronColors = [
    "bg-cyan-400 shadow-md shadow-current",
    "bg-rose-400 shadow-md shadow-current",
    "bg-amber-400 shadow-md shadow-current",
    "bg-emerald-400 shadow-md shadow-current",
  ];

  const pWord = el.num === 1 ? "proton" : "protons";
  const rWord = el.shells === 1 ? "ring" : "rings";
  const eWord = el.num === 1 ? "electron" : "electrons";

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full py-2">
      {/* Visualizer Area */}
      <div className="relative w-36 h-36 flex items-center justify-center border border-slate-800/40 rounded-full bg-slate-900/10">
        {/* Center Nucleus */}
        <div className="w-6 h-6 rounded-full bg-gradient-to-r from-rose-500 to-amber-500 flex items-center justify-center text-[8px] font-bold text-black font-mono shadow-lg shadow-orange-500/40 z-10">
          +{el.num}
        </div>

        {/* Orbiting Shells */}
        {Array.from({ length: maxShellsToShow }).map((_, s) => {
          const ringSize = 36 + s * 22;
          const count = shellCounts[s] || 0;
          const isReverse = s % 2 === 1;

          return (
            <div
              key={s}
              className={`absolute rounded-full border border-dashed ${shellColors[s]}`}
              style={{
                width: `${ringSize}px`,
                height: `${ringSize}px`,
                animation: isReverse
                  ? `spin ${8 + s * 4}s linear infinite reverse`
                  : `spin ${8 + s * 4}s linear infinite`,
              }}
            >
              {Array.from({ length: count }).map((__, e) => {
                const angle = (360 / count) * e;
                const radius = ringSize / 2;
                const rad = angle * (Math.PI / 180);
                const x = radius + radius * Math.cos(rad) - 3;
                const y = radius + radius * Math.sin(rad) - 3;

                return (
                  <div
                    key={e}
                    className={`absolute w-1.5 h-1.5 rounded-full ${electronColors[s]}`}
                    style={{ left: `${x}px`, top: `${y}px` }}
                  />
                );
              })}
            </div>
          );
        })}
      </div>

      {/* Label and Explainer Description */}
      <div className="text-center">
        <h4 className="font-heading text-sm font-bold text-white">
          {el.name} ({el.symbol})
        </h4>
        <p className="text-[10px] text-gray-400 max-w-[240px] leading-relaxed mt-1 font-sans">
          {el.name} has <strong className="text-slate-200">{el.num} {pWord}</strong> in the center nucleus, and <strong className="text-slate-200">{el.shells} {rWord}</strong> holding <strong className="text-slate-200">{el.num} {eWord}</strong>.
        </p>
      </div>
    </div>
  );
}
