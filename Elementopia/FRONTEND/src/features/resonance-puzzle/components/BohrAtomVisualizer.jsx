import React from 'react';
import { ELEMENTS } from '../lib/game-data';

// Electron shell configuration per element: [innerShellCount, outerShellCount]
const ATOMIC_SHELLS = {
  H:  { total: 1, valence: 1, rings: [1] },
  He: { total: 2, valence: 2, rings: [2], noble: true },
  C:  { total: 6, valence: 4, rings: [2, 4] },
  N:  { total: 7, valence: 5, rings: [2, 5] },
  O:  { total: 8, valence: 6, rings: [2, 6] },
  Na: { total: 11, valence: 1, rings: [2, 8, 1] },
  Mg: { total: 12, valence: 2, rings: [2, 8, 2] },
  Cl: { total: 17, valence: 7, rings: [2, 8, 7] },
  Ne: { total: 10, valence: 8, rings: [2, 8], noble: true },
};

export function BohrAtomVisualizer({
  symbol = "H",
  size = "md",
  animated = true,
  showNucleus = true,
  showEmptySeats = false,
  themeColor = "var(--cyan)"
}) {
  const elem = ELEMENTS[symbol] || { symbol, name: symbol, gradient: "from-cyan-500 to-blue-600" };
  const config = ATOMIC_SHELLS[symbol] || { total: 1, valence: 1, rings: [1] };

  // Dimension scaling: xs=42px, sm=64px, md=110px, lg=180px
  const dim = size === "xs" ? 42 : size === "sm" ? 64 : size === "lg" ? 180 : 110;
  const center = dim / 2;

  return (
    <div className="relative flex items-center justify-center select-none" style={{ width: dim, height: dim }}>
      <svg width={dim} height={dim} className="absolute inset-0 overflow-visible">
        {/* Orbital Shell Rings */}
        {config.rings.map((eCount, ringIdx) => {
          const radius = (dim * 0.22) + ringIdx * (dim * 0.14);
          const isValenceRing = ringIdx === config.rings.length - 1;
          const capacity = ringIdx === 0 && config.rings.length === 1 ? 2 : 8;
          const emptySeats = isValenceRing && !config.noble && !["Na", "Mg"].includes(symbol) ? Math.max(0, capacity - eCount) : 0;
          const totalSlotPositions = showEmptySeats && isValenceRing && emptySeats > 0 ? capacity : eCount;

          const strokeColor = config.noble
            ? themeColor
            : isValenceRing
            ? themeColor
            : "rgba(148, 163, 184, 0.25)";

          return (
            <g key={ringIdx}>
              {/* Ring Path */}
              <circle
                cx={center}
                cy={center}
                r={radius}
                fill="none"
                stroke={strokeColor}
                strokeWidth={isValenceRing ? "1.5" : "1"}
                strokeDasharray={isValenceRing ? "3 1.5" : "none"}
              />

              {/* Orbiting Electrons with Native SVG animateTransform */}
              <g>
                {animated && (
                  <animateTransform
                    attributeName="transform"
                    type="rotate"
                    from={ringIdx % 2 === 1 ? `360 ${center} ${center}` : `0 ${center} ${center}`}
                    to={ringIdx % 2 === 1 ? `0 ${center} ${center}` : `360 ${center} ${center}`}
                    dur={`${6 - ringIdx * 1.2}s`}
                    repeatCount="indefinite"
                  />
                )}
                {Array.from({ length: totalSlotPositions }).map((_, slotIdx) => {
                  const angle = (slotIdx / totalSlotPositions) * 2 * Math.PI;
                  const ex = center + radius * Math.cos(angle);
                  const ey = center + radius * Math.sin(angle);
                  const isFilled = slotIdx < eCount;
                  const r = size === "xs" ? 1.8 : size === "sm" ? 2.5 : 3.5;

                  if (isFilled) {
                    return (
                      <circle
                        key={slotIdx}
                        cx={ex}
                        cy={ey}
                        r={r}
                        fill={config.noble ? themeColor : isValenceRing ? themeColor : "#94a3b8"}
                        filter={isValenceRing || config.noble ? `drop-shadow(0px 0px 3px ${themeColor})` : "none"}
                      />
                    );
                  }

                  // Render empty valence seat slot
                  return (
                    <circle
                      key={slotIdx}
                      cx={ex}
                      cy={ey}
                      r={r + 0.5}
                      fill="rgba(239, 68, 68, 0.15)"
                      stroke="#ef4444"
                      strokeWidth="1"
                      strokeDasharray="1.5 1"
                      className="animate-pulse"
                    />
                  );
                })}
              </g>
            </g>
          );
        })}
      </svg>

      {/* Nucleus Core */}
      {showNucleus && (
        <div
          className={`relative z-10 flex items-center justify-center rounded-full bg-gradient-to-br ${elem.gradient} font-bold text-white shadow-[0_0_10px_rgba(6,182,212,0.5)] transition-all`}
          style={{
            width: dim * 0.34,
            height: dim * 0.34,
            fontSize: size === "xs" ? "9px" : size === "sm" ? "11px" : size === "lg" ? "20px" : "13px",
          }}
        >
          <span>{symbol}</span>
        </div>
      )}
    </div>
  );
}
