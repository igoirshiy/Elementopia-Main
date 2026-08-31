import React from 'react';

const ATOM_COLORS = {
  H: { fill: "#F8FAFC", stroke: "#94A3B8", glow: "rgba(248, 250, 252, 0.6)", label: "#0F172A", size: 18 },
  O: { fill: "#EF4444", stroke: "#B91C1C", glow: "rgba(239, 68, 68, 0.6)", label: "#FFFFFF", size: 24 },
  N: { fill: "#3B82F6", stroke: "#1D4ED8", glow: "rgba(59, 130, 246, 0.6)", label: "#FFFFFF", size: 24 },
  C: { fill: "#334155", stroke: "#1E293B", glow: "rgba(51, 65, 85, 0.6)", label: "#FFFFFF", size: 26 },
  Na: { fill: "#A855F7", stroke: "#7E22CE", glow: "rgba(168, 85, 247, 0.6)", label: "#FFFFFF", size: 28 },
  Cl: { fill: "#22C55E", stroke: "#15803D", glow: "rgba(34, 197, 94, 0.6)", label: "#FFFFFF", size: 26 },
  Mg: { fill: "#F59E0B", stroke: "#B45309", glow: "rgba(245, 158, 11, 0.6)", label: "#FFFFFF", size: 28 }
};

const MOLECULE_GEOMETRIES = {
  "H2O": {
    atoms: [
      { symbol: "O", x: 150, y: 110 },
      { symbol: "H", x: 90, y: 160 },
      { symbol: "H", x: 210, y: 160 }
    ],
    bonds: [
      { from: 0, to: 1 },
      { from: 0, to: 2 }
    ]
  },
  "NaCl": {
    atoms: [
      { symbol: "Na", x: 100, y: 130 },
      { symbol: "Cl", x: 200, y: 130 }
    ],
    bonds: [
      { from: 0, to: 1, type: "ionic" }
    ]
  },
  "CO2": {
    atoms: [
      { symbol: "O", x: 70, y: 130 },
      { symbol: "C", x: 150, y: 130 },
      { symbol: "O", x: 230, y: 130 }
    ],
    bonds: [
      { from: 1, to: 0, double: true },
      { from: 1, to: 2, double: true }
    ]
  },
  "NH3": {
    atoms: [
      { symbol: "N", x: 150, y: 100 },
      { symbol: "H", x: 90, y: 160 },
      { symbol: "H", x: 150, y: 180 },
      { symbol: "H", x: 210, y: 160 }
    ],
    bonds: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 0, to: 3 }
    ]
  },
  "CH4": {
    atoms: [
      { symbol: "C", x: 150, y: 130 },
      { symbol: "H", x: 150, y: 60 },
      { symbol: "H", x: 80, y: 170 },
      { symbol: "H", x: 220, y: 170 },
      { symbol: "H", x: 150, y: 200 }
    ],
    bonds: [
      { from: 0, to: 1 },
      { from: 0, to: 2 },
      { from: 0, to: 3 },
      { from: 0, to: 4 }
    ]
  },
  "HCl": {
    atoms: [
      { symbol: "H", x: 100, y: 130 },
      { symbol: "Cl", x: 200, y: 130 }
    ],
    bonds: [
      { from: 0, to: 1 }
    ]
  },
  "NaOH": {
    atoms: [
      { symbol: "Na", x: 80, y: 130 },
      { symbol: "O", x: 160, y: 130 },
      { symbol: "H", x: 230, y: 130 }
    ],
    bonds: [
      { from: 0, to: 1, type: "ionic" },
      { from: 1, to: 2 }
    ]
  },
  "MgCl2": {
    atoms: [
      { symbol: "Cl", x: 70, y: 130 },
      { symbol: "Mg", x: 150, y: 130 },
      { symbol: "Cl", x: 230, y: 130 }
    ],
    bonds: [
      { from: 1, to: 0, type: "ionic" },
      { from: 1, to: 2, type: "ionic" }
    ]
  },
  "NaHCO3": {
    atoms: [
      { symbol: "Na", x: 60, y: 90 },
      { symbol: "O", x: 120, y: 130 },
      { symbol: "C", x: 170, y: 130 },
      { symbol: "O", x: 170, y: 70 },
      { symbol: "O", x: 220, y: 170 },
      { symbol: "H", x: 270, y: 170 }
    ],
    bonds: [
      { from: 0, to: 1, type: "ionic" },
      { from: 1, to: 2 },
      { from: 2, to: 3, double: true },
      { from: 2, to: 4 },
      { from: 4, to: 5 }
    ]
  },
  "HCN": {
    atoms: [
      { symbol: "H", x: 70, y: 130 },
      { symbol: "C", x: 150, y: 130 },
      { symbol: "N", x: 230, y: 130 }
    ],
    bonds: [
      { from: 0, to: 1 },
      { from: 1, to: 2, triple: true }
    ]
  }
};

function generateFallbackGeometry(symbol) {
  const chars = symbol ? symbol.replace(/[0-9₀-₉]/g, '').match(/([A-Z][a-z]?)/g) || ["C"] : ["C"];
  const total = Math.min(chars.length, 6);
  const atoms = [];
  const bonds = [];
  const cx = 150, cy = 130, radius = 65;

  atoms.push({ symbol: chars[0] || "C", x: cx, y: cy });
  for (let i = 1; i < total; i++) {
    const angle = ((i - 1) / (total - 1)) * Math.PI * 2;
    const x = cx + radius * Math.cos(angle);
    const y = cy + radius * Math.sin(angle);
    atoms.push({ symbol: chars[i] || "H", x, y });
    bonds.push({ from: 0, to: i });
  }

  return { atoms, bonds };
}

export function MolecularBallAndStickVisualizer({ symbol, className = "" }) {
  const normSymbol = (symbol || "").replace(/[₀-₉]/g, m => "0123456789"["₀₁₂₃₄₅₆₇₈₉".indexOf(m)]);
  const geo = MOLECULE_GEOMETRIES[normSymbol] || generateFallbackGeometry(normSymbol);

  return (
    <div className={`relative flex items-center justify-center rounded-2xl border border-slate-800 bg-slate-950/80 p-4 shadow-inner overflow-hidden ${className}`}>
      <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,rgba(6,182,212,0.12)_0%,transparent_70%)] pointer-events-none" />

      <svg width="300" height="240" viewBox="0 0 300 240" className="w-full h-auto max-h-[220px]">
        <defs>
          <filter id="glow-filter" x="-20%" y="-20%" width="140%" height="140%">
            <feGaussianBlur stdDeviation="3" result="blur" />
            <feComposite in="SourceGraphic" in2="blur" operator="over" />
          </filter>
        </defs>
        {geo.bonds.map((bond, idx) => {
          const fromAtom = geo.atoms[bond.from];
          const toAtom = geo.atoms[bond.to];
          if (!fromAtom || !toAtom) return null;

          const isIonic = bond.type === "ionic";

          if (bond.double) {
            return (
              <g key={`bond-${idx}`}>
                <line
                  x1={fromAtom.x} y1={fromAtom.y - 4}
                  x2={toAtom.x} y2={toAtom.y - 4}
                  stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" opacity="0.8"
                />
                <line
                  x1={fromAtom.x} y1={fromAtom.y + 4}
                  x2={toAtom.x} y2={toAtom.y + 4}
                  stroke="#38BDF8" strokeWidth="4" strokeLinecap="round" opacity="0.8"
                />
              </g>
            );
          }

          if (bond.triple) {
            return (
              <g key={`bond-${idx}`}>
                <line x1={fromAtom.x} y1={fromAtom.y - 6} x2={toAtom.x} y2={toAtom.y - 6} stroke="#38BDF8" strokeWidth="3.5" opacity="0.9" />
                <line x1={fromAtom.x} y1={fromAtom.y} x2={toAtom.x} y2={toAtom.y} stroke="#38BDF8" strokeWidth="3.5" opacity="0.9" />
                <line x1={fromAtom.x} y1={fromAtom.y + 6} x2={toAtom.x} y2={toAtom.y + 6} stroke="#38BDF8" strokeWidth="3.5" opacity="0.9" />
              </g>
            );
          }

          return (
            <line
              key={`bond-${idx}`}
              x1={fromAtom.x} y1={fromAtom.y}
              x2={toAtom.x} y2={toAtom.y}
              stroke={isIonic ? "#E056FD" : "#38BDF8"}
              strokeWidth="4"
              strokeDasharray={isIonic ? "6 4" : "none"}
              strokeLinecap="round"
              opacity="0.85"
            />
          );
        })}

        {geo.atoms.map((atom, idx) => {
          const config = ATOM_COLORS[atom.symbol] || ATOM_COLORS.C;
          return (
            <g key={`atom-${idx}`} className="transition-transform hover:scale-110 cursor-pointer">
              <circle
                cx={atom.x} cy={atom.y} r={config.size + 4}
                fill={config.glow} filter="url(#glow-filter)"
              />
              <circle
                cx={atom.x} cy={atom.y} r={config.size}
                fill={config.fill} stroke={config.stroke} strokeWidth="3"
              />
              <circle
                cx={atom.x - config.size * 0.3} cy={atom.y - config.size * 0.3} r={config.size * 0.35}
                fill="rgba(255, 255, 255, 0.45)"
              />
              <text
                x={atom.x} y={atom.y + 1}
                dominantBaseline="central" textAnchor="middle"
                fill={config.label}
                fontSize={config.size * 0.85}
                fontWeight="bold"
                fontFamily="sans-serif"
              >
                {atom.symbol}
              </text>
            </g>
          );
        })}
      </svg>

      <div className="absolute bottom-2 left-3 flex items-center gap-2 text-[10px] font-mono text-slate-400">
        <span className="inline-block size-2 rounded-full bg-cyan animate-ping" />
        <span>Live Ball-and-Stick Geometry</span>
      </div>
    </div>
  );
}
