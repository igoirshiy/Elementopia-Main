import React, { useState, useRef, useCallback, useEffect } from 'react';
import { BohrAtomVisualizer } from './BohrAtomVisualizer';
import { ELEMENTS, calculateValenceStatus } from '../lib/game-data';
import { X, CheckCircle2, AlertCircle, AlertTriangle, Sparkles, Info, ZoomIn, ZoomOut, RotateCcw, Move } from 'lucide-react';

/**
 * Arranges atoms into a chemically intuitive order for visual bonding display.
 * e.g., CO2 -> [O, C, O], H2O -> [H, O, H], H2O2 -> [H, O, O, H], MgCl2 -> [Cl, Mg, Cl]
 */
function organizeMolecularSequence(workbench = {}) {
  const entries = Object.entries(workbench).filter(([, qty]) => (qty ?? 0) > 0);
  const key = entries.map(([s, q]) => `${s}${q}`).sort().join('_');
  
  // Specific known molecular topologies for high educational fidelity
  if (key === 'C1_O2') return ['O', 'C', 'O'];
  if (key === 'H2_O1') return ['H', 'O', 'H'];
  if (key === 'H2_O2') return ['H', 'O', 'O', 'H'];
  if (key === 'C1_H4') return ['H', 'H', 'C', 'H', 'H'];
  if (key === 'H3_N1') return ['H', 'N', 'H', 'H'];
  if (key === 'C1_H2_O1') return ['H', 'C', 'O', 'H'];
  if (key === 'C1_H2_O2') return ['H', 'C', 'O', 'O', 'H'];
  if (key === 'C2_H4_O2') return ['H', 'C', 'C', 'O', 'O', 'H'];
  if (key === 'C2_H6_O1' || key === 'C2_H6_O') return ['H', 'C', 'C', 'O', 'H'];
  if (key === 'C1_H4_N2_O1') return ['H', 'N', 'C', 'O', 'N', 'H'];
  if (key === 'C2_H2') return ['H', 'C', 'C', 'H'];
  if (key === 'Cl2_Mg1') return ['Cl', 'Mg', 'Cl'];
  if (key === 'Cl1_Na1') return ['Na', 'Cl'];
  if (key === 'Mg1_O1') return ['Mg', 'O'];
  if (key === 'Na2_O1') return ['Na', 'O', 'Na'];
  if (key === 'H1_Na1_O1') return ['Na', 'O', 'H'];
  if (key === 'C1_H1_N1') return ['H', 'C', 'N'];
  if (key === 'H1_Cl1') return ['H', 'Cl'];

  // Generic intelligent layout:
  // Put multi-valent central non-metals (C, N, O) in the middle, and perimeter atoms (H, Cl, Na) at edges
  const atomList = [];
  entries.forEach(([symbol, qty]) => {
    for (let i = 0; i < qty; i++) {
      atomList.push(symbol);
    }
  });

  const getPriority = (sym) => {
    if (sym === 'C') return 10;
    if (sym === 'N') return 8;
    if (sym === 'O') return 6;
    if (sym === 'Mg') return 5;
    if (sym === 'Na') return 4;
    if (sym === 'Cl') return 3;
    if (sym === 'H') return 1;
    return 2;
  };

  const sorted = [...atomList].sort((a, b) => getPriority(b) - getPriority(a));
  const result = [];
  sorted.forEach((sym, idx) => {
    if (idx % 2 === 0) result.push(sym);
    else result.unshift(sym);
  });

  return result;
}

/**
 * Calculates per-atom shared and outer electron details based on current combination.
 */
function getAtomDetail(symbol, valenceInfo) {
  const el = ELEMENTS[symbol] || { valence: 1, name: symbol };
  const val = el.valence;
  const isMetal = ['Na', 'Mg', 'K', 'Ca', 'Fe'].includes(symbol);

  if (el.noble) {
    return {
      isFull: true,
      statusText: "Inert Gas (8/8)",
      breakdown: "Has 8 e⁻ (Full, does not bond)",
      role: "Inert"
    };
  }

  if (isMetal) {
    return {
      isFull: valenceInfo.balanced,
      statusText: valenceInfo.balanced ? `[${symbol}]⁺ Stable Ion` : `Has ${val} e⁻ to give`,
      breakdown: valenceInfo.balanced ? `Gave ${val} e⁻ to non-metal` : `Donates ${val} outer e⁻`,
      role: "Metal (+)"
    };
  }

  if (symbol === 'H') {
    return {
      isFull: valenceInfo.balanced,
      statusText: valenceInfo.balanced ? "2/2 e⁻ (Full Duet)" : "1/2 e⁻ (Needs 1 e⁻)",
      breakdown: valenceInfo.balanced ? "Has 1 e⁻ · Shares 1 e⁻" : "Has 1 e⁻ · Needs 1 e⁻",
      role: "Duet"
    };
  }

  // Non-metals (C, N, O, Cl)
  if (valenceInfo.balanced) {
    const needed = 8 - val;
    return {
      isFull: true,
      statusText: "8/8 e⁻ (Full Octet)",
      breakdown: symbol === 'C' 
        ? "Has 4 e⁻ · Shares all 4 e⁻" 
        : `Has ${val} e⁻ · Shares ${needed} e⁻ (keeps ${val - needed})`,
      role: symbol === 'C' ? "Backbone" : "Octet"
    };
  }

  const openSeats = 8 - val;
  return {
    isFull: false,
    statusText: `${val}/8 e⁻ (Needs ${openSeats} e⁻)`,
    breakdown: `Has ${val} e⁻ · Needs ${openSeats} e⁻`,
    role: symbol === 'C' ? "Backbone" : "Non-metal"
  };
}

/**
 * Determines the bond visual type between two adjacent atoms in the sequence.
 */
function getBondType(symA, symB, valenceInfo) {
  const isMetalA = ['Na', 'Mg', 'K', 'Ca', 'Fe'].includes(symA);
  const isMetalB = ['Na', 'Mg', 'K', 'Ca', 'Fe'].includes(symB);

  if (isMetalA || isMetalB) {
    const metal = isMetalA ? symA : symB;
    const nonmetal = isMetalA ? symB : symA;
    return {
      type: "ionic",
      label: "Ionic (e⁻ →)",
      fullExplanation: `${metal} gives ${ELEMENTS[metal]?.valence || 1} e⁻ → ${nonmetal}`,
      isDouble: false,
      isTriple: false
    };
  }

  // Double bond scenarios
  const isCO2Bond = (symA === 'C' && symB === 'O') || (symA === 'O' && symB === 'C');
  const isEthylene = symA === 'C' && symB === 'C' && valenceInfo.balanced;
  if (isCO2Bond || isEthylene) {
    return {
      type: "double",
      label: "Double (═ 4 e⁻)",
      fullExplanation: `${symA} shares 2 e⁻ ═ ${symB} shares 2 e⁻ (4 e⁻ Double Bond)`,
      isDouble: true,
      isTriple: false
    };
  }

  // Triple bond scenarios (HCN, C2H2, N2)
  const isTriple = (symA === 'C' && symB === 'N') || (symA === 'N' && symB === 'C');
  if (isTriple) {
    return {
      type: "triple",
      label: "Triple (≡ 6 e⁻)",
      fullExplanation: `${symA} shares 3 e⁻ ≡ ${symB} shares 3 e⁻ (6 e⁻ Triple Bond)`,
      isDouble: false,
      isTriple: true
    };
  }

  // Default Single Covalent Bond
  return {
    type: "single",
    label: "Single (─ 2 e⁻)",
    fullExplanation: `${symA} shares 1 e⁻ ─ ${symB} shares 1 e⁻ (2 e⁻ Shared Pair)`,
    isDouble: false,
    isTriple: false
  };
}

/**
 * Calculates initial 2D layout coordinates for recognized molecular geometries.
 */
function getInitialMolecularLayout(molecularSequence, key, spacing) {
  const N = molecularSequence.length;

  // Bent V-shape for H2O: [H, O, H]
  if (key === 'H2_O1' && N === 3) {
    return [
      { x: -75, y: -30 }, // Left H
      { x: 0, y: 25 },    // Center O
      { x: 75, y: -30 },  // Right H
    ];
  }

  // Tripod for NH3: [H, N, H, H]
  if (key === 'H3_N1' && N === 4) {
    return [
      { x: -70, y: -35 }, // Left H
      { x: 0, y: 25 },    // Center N
      { x: 0, y: -45 },   // Top H
      { x: 70, y: -35 },  // Right H
    ];
  }

  // Cross for CH4: [H, H, C, H, H]
  if (key === 'C1_H4' && N === 5) {
    return [
      { x: -70, y: 0 },   // Left H
      { x: 0, y: -60 },   // Top H
      { x: 0, y: 0 },     // Center C
      { x: 70, y: 0 },    // Right H
      { x: 0, y: 60 },    // Bottom H
    ];
  }

  // H2O2: [H, O, O, H] slightly staggered
  if (key === 'H2_O2' && N === 4) {
    return [
      { x: -110, y: -20 }, // Left H
      { x: -38, y: 12 },   // Left O
      { x: 38, y: -12 },   // Right O
      { x: 110, y: 20 },   // Right H
    ];
  }

  // CO2: [O, C, O] linear
  if (key === 'C1_O2' && N === 3) {
    return [
      { x: -95, y: 0 },
      { x: 0, y: 0 },
      { x: 95, y: 0 }
    ];
  }

  // Linear default spacing
  return molecularSequence.map((_, idx) => ({
    x: (idx - (N - 1) / 2) * spacing,
    y: 0
  }));
}

/**
 * Determines pair connectivity between atoms based on molecular topology.
 */
function getMolecularBonds(atomNodes, key, valenceInfo) {
  const N = atomNodes.length;
  if (N <= 1) return [];

  let pairs = [];

  if (key === 'H2_O1' && N === 3) {
    // Both H (indices 0 and 2) bond to center O (index 1)
    pairs = [[0, 1], [1, 2]];
  } else if (key === 'H3_N1' && N === 4) {
    // Left H (0), Top H (2), Right H (3) all bond to N (1)
    pairs = [[0, 1], [2, 1], [3, 1]];
  } else if (key === 'C1_H4' && N === 5) {
    // Left H (0), Top H (1), Right H (3), Bottom H (4) all bond to center C (2)
    pairs = [[0, 2], [1, 2], [3, 2], [4, 2]];
  } else if (key === 'C1_O2' && N === 3) {
    // O (0) = C (1) = O (2)
    pairs = [[0, 1], [1, 2]];
  } else if (key === 'H2_O2' && N === 4) {
    // H (0) - O (1) - O (2) - H (3)
    pairs = [[0, 1], [1, 2], [2, 3]];
  } else {
    // Sequential chain by default
    for (let i = 1; i < N; i++) {
      pairs.push([i - 1, i]);
    }
  }

  const bonds = [];
  pairs.forEach(([idxA, idxB]) => {
    const prev = atomNodes[idxA];
    const curr = atomNodes[idxB];
    if (!prev || !curr) return;

    const bondType = getBondType(prev.symbol, curr.symbol, valenceInfo);
    const dx = curr.x - prev.x;
    const dy = curr.y - prev.y;
    const dist = Math.hypot(dx, dy);
    const angle = Math.atan2(dy, dx);
    const r = 30; // Bohr nucleus radius
    const x1 = prev.x + Math.cos(angle) * r;
    const y1 = prev.y + Math.sin(angle) * r;
    const x2 = curr.x - Math.cos(angle) * r;
    const y2 = curr.y - Math.sin(angle) * r;
    const mx = (prev.x + curr.x) / 2;
    const my = (prev.y + curr.y) / 2;
    const nx = -Math.sin(angle) * 3.5;
    const ny = Math.cos(angle) * 3.5;

    bonds.push({
      id: `bond_${prev.key}_${curr.key}`,
      type: bondType,
      x1, y1, x2, y2, mx, my, nx, ny, dist, angle
    });
  });

  return bonds;
}

/**
 * Dynamic educational commentary tailored to the specific workbench mixture.
 */
function getReactionExplanation(workbench = {}, valenceInfo, target = null) {
  const entries = Object.entries(workbench).filter(([, qty]) => (qty ?? 0) > 0);
  const key = entries.map(([s, q]) => `${s}${q}`).sort().join('_');

  if (valenceInfo.balanced) {
    if (key === 'H1_Cl1') {
      return "🎯 Hydrochloric Acid (HCl): Hydrogen has 1 e⁻ and needs 1. Chlorine has 7 e⁻ and needs 1. They each share 1 electron (H ─ Cl) so Hydrogen reaches 2/2 e⁻ (Duet) and Chlorine reaches 8/8 e⁻ (Octet)!";
    }
    if (key === 'H2_O1') {
      return "🎯 Water (H₂O): Oxygen has 6 e⁻ and needs 2. It splits its sharing: 1 e⁻ with Left Hydrogen and 1 e⁻ with Right Hydrogen (H ─ O ─ H). Both Hydrogens reach 2/2 e⁻ and Oxygen reaches 8/8 e⁻!";
    }
    if (key === 'C1_O2') {
      return "🎯 Carbon Dioxide (CO₂): Carbon has 4 e⁻ and needs 4. Each Oxygen has 6 e⁻ and needs 2. Carbon shares 2 e⁻ with Left Oxygen and 2 e⁻ with Right Oxygen (O ═ C ═ O). All 3 atoms achieve a stable 8/8 e⁻ octet!";
    }
    if (key === 'H2_O2') {
      return "🎯 Hydrogen Peroxide (H₂O₂): The two Oxygens share 1 electron pair with each other (O ─ O) and 1 pair with each Hydrogen (H ─ O ─ O ─ H). All atoms reach their full outer shells!";
    }
    if (key === 'C1_H4') {
      return "🎯 Methane (CH₄): Carbon has 4 e⁻ and needs 4. It shares 1 electron pair with each of the 4 Hydrogens (C ─ H). Carbon reaches 8/8 e⁻ and all 4 Hydrogens reach 2/2 e⁻!";
    }
    if (key === 'C1_H2_O2') {
      return "🎯 Formic Acid (CH₂O₂): Carbon has 4 e⁻. It forms a Double Bond with Oxygen (C ═ O) and Single Bonds with Hydrogen (C ─ H) and the second Oxygen (C ─ O ─ H). All 18 valence electrons are shared so every atom is full!";
    }
    if (key === 'C2_H4_O2') {
      return "🎯 Acetic Acid / Vinegar (C₂H₄O₂): The two Carbons form a backbone (C ─ C), sharing electrons with 4 Hydrogens and 2 Oxygens so all 24 valence electrons achieve full octet stability!";
    }
    if (key === 'C2_H6_O1' || key === 'C2_H6_O') {
      return "🎯 Ethanol / Rubbing Alcohol (C₂H₆O): The two Carbons form a backbone (C ─ C), sharing electrons with 6 Hydrogens and 1 Oxygen to achieve 20 fully paired valence electrons!";
    }
    if (key === 'C1_H4_N2_O1') {
      return "🎯 Urea (CH₄N₂O): Carbon forms a Double Bond with Oxygen (C ═ O) and shares pairs with 2 Nitrogen amino groups (─ NH₂), stabilizing all 24 valence electrons!";
    }
    if (key === 'C1_H2_O1') {
      return "🎯 Formaldehyde (CH₂O): Carbon forms a Double Bond with Oxygen (C ═ O) and Single Bonds with 2 Hydrogens (H ─ C ─ H). All atoms reach full shells!";
    }
    if (key === 'Cl1_Na1') {
      return "🎯 Sodium Chloride (NaCl): Sodium transfers 1 electron to Chlorine ([Na]⁺ [Cl]⁻). Both ions achieve full, stable 8-electron outer shells!";
    }
    if (key === 'Cl2_Mg1') {
      return "🎯 Magnesium Chloride (MgCl₂): Magnesium gives 1 electron to each Chlorine ([Cl]⁻ [Mg]²⁺ [Cl]⁻). All ions reach full 8-electron stability!";
    }
    return "✓ Perfect Octet Stability! All outer orbital electron seats are completely filled.";
  }

  if (entries.length === 1 && entries[0][0] === 'H' && entries[0][1] === 2 && target?.recipe?.O) {
    return "⚡ 2 Hydrogens placed (2 e⁻ ready). Target needs Oxygen (12 e⁻) to complete the reaction!";
  }

  return valenceInfo.message;
}

export function MolecularBondVisualizer({ workbench = {}, target = null, onRemove }) {

  const [zoomScale, setZoomScale] = useState(1);
  const [panPos, setPanPos] = useState({ x: 0, y: 0 });
  const [isDragging, setIsDragging] = useState(false);
  const dragStartRef = useRef({ x: 0, y: 0, startPanX: 0, startPanY: 0 });

  // Per-atom draggable position offsets: { [atomKey]: { x: number, y: number } }
  const [atomOffsets, setAtomOffsets] = useState({});
  const draggingAtomRef = useRef(null);

  const handleAtomPointerDown = useCallback((atomKey, e) => {
    e.stopPropagation();
    const clientX = e.clientX ?? e.touches?.[0]?.clientX ?? 0;
    const clientY = e.clientY ?? e.touches?.[0]?.clientY ?? 0;
    const current = atomOffsets[atomKey] || { x: 0, y: 0 };
    draggingAtomRef.current = {
      key: atomKey,
      startX: clientX,
      startY: clientY,
      origX: current.x,
      origY: current.y
    };
  }, [atomOffsets]);

  const handleMouseDown = useCallback((e) => {
    if (e.target.closest('button') || e.target.closest('input')) return;
    setIsDragging(true);
    dragStartRef.current = {
      x: e.clientX,
      y: e.clientY,
      startPanX: panPos.x,
      startPanY: panPos.y
    };
  }, [panPos]);

  const handleMouseMove = useCallback((e) => {
    if (draggingAtomRef.current) {
      const { key, startX, startY, origX, origY } = draggingAtomRef.current;
      const dx = (e.clientX - startX) / zoomScale;
      const dy = (e.clientY - startY) / zoomScale;
      setAtomOffsets(prev => ({
        ...prev,
        [key]: { x: origX + dx, y: origY + dy }
      }));
      return;
    }
    if (!isDragging) return;
    const dx = e.clientX - dragStartRef.current.x;
    const dy = e.clientY - dragStartRef.current.y;
    setPanPos({
      x: dragStartRef.current.startPanX + dx,
      y: dragStartRef.current.startPanY + dy
    });
  }, [isDragging, zoomScale]);

  const handleMouseUp = useCallback(() => {
    if (draggingAtomRef.current) {
      draggingAtomRef.current = null;
    }
    setIsDragging(false);
  }, []);

  const handleTouchStart = useCallback((e) => {
    if (e.touches.length !== 1) return;
    if (e.target.closest('button') || e.target.closest('input')) return;
    const touch = e.touches[0];
    setIsDragging(true);
    dragStartRef.current = {
      x: touch.clientX,
      y: touch.clientY,
      startPanX: panPos.x,
      startPanY: panPos.y
    };
  }, [panPos]);

  const handleTouchMove = useCallback((e) => {
    if (draggingAtomRef.current) {
      const touch = e.touches[0];
      const { key, startX, startY, origX, origY } = draggingAtomRef.current;
      const dx = (touch.clientX - startX) / zoomScale;
      const dy = (touch.clientY - startY) / zoomScale;
      setAtomOffsets(prev => ({
        ...prev,
        [key]: { x: origX + dx, y: origY + dy }
      }));
      return;
    }
    if (!isDragging || e.touches.length !== 1) return;
    const touch = e.touches[0];
    const dx = touch.clientX - dragStartRef.current.x;
    const dy = touch.clientY - dragStartRef.current.y;
    setPanPos({
      x: dragStartRef.current.startPanX + dx,
      y: dragStartRef.current.startPanY + dy
    });
  }, [isDragging, zoomScale]);

  const handleTouchEnd = useCallback(() => {
    if (draggingAtomRef.current) {
      draggingAtomRef.current = null;
    }
    setIsDragging(false);
  }, []);

  const handleResetView = useCallback(() => {
    setZoomScale(1);
    setPanPos({ x: 0, y: 0 });
    setAtomOffsets({});
  }, []);

  // Reset atom offsets when composition changes
  const entries = Object.entries(workbench).filter(([, qty]) => (qty ?? 0) > 0);
  const entriesKey = entries.map(([s, q]) => `${s}:${q}`).sort().join(',');
  const key = entries.map(([s, q]) => `${s}${q}`).sort().join('_');
  useEffect(() => {
    setAtomOffsets({});
  }, [entriesKey]);
  const valenceInfo = calculateValenceStatus(workbench, target);
  const molecularSequence = organizeMolecularSequence(workbench);

  if (entries.length === 0) {
    return (
      <div className="py-4 px-4 rounded-xl border border-slate-800 bg-slate-950/60 text-center font-mono text-xs text-slate-500 italic min-h-[90px] flex flex-col items-center justify-center gap-1">
        <Sparkles className="size-4 text-slate-600 animate-pulse" />
        <span>Click elements from palette to place atoms on workbench…</span>
      </div>
    );
  }

  let totalValenceOffered = 0;
  entries.forEach(([symbol, qty]) => {
    const e = ELEMENTS[symbol];
    if (e && !e.noble) {
      totalValenceOffered += e.valence * qty;
    }
  });

  const explanation = getReactionExplanation(workbench, valenceInfo, target);

  return (
    <div className={`flex flex-col rounded-xl border p-3 shadow-lg transition-all duration-300 ${
      valenceInfo.balanced
        ? "border-emerald-500/60 bg-emerald-950/20 shadow-[0_0_25px_rgba(16,185,129,0.25)]"
        : valenceInfo.isNoble
        ? "border-amber-500/50 bg-amber-950/20"
        : "border-cyan/40 bg-slate-950/90 shadow-[0_0_15px_rgba(6,182,212,0.15)]"
    }`}>
      {/* Compact Active Atoms Bar with Quick Removal Chips */}
      <div className="flex flex-wrap items-center justify-between gap-2 w-full mb-2 pb-1.5 border-b border-slate-800/80">
        <div className="flex flex-wrap items-center gap-1.5">
          <span className="font-mono text-[10px] font-bold text-slate-400 uppercase tracking-wider mr-1">
            Atoms:
          </span>
          {entries.map(([symbol, qty]) => (
            <button
              key={symbol}
              type="button"
              onClick={() => onRemove && onRemove(symbol)}
              className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-slate-900 hover:bg-red-950/40 border border-slate-700/80 hover:border-red-500/70 text-slate-200 hover:text-red-300 font-mono text-xs font-bold transition-all shadow-sm cursor-pointer group"
              title={`Click to remove 1× ${symbol}`}
            >
              <span>{qty}× {symbol}</span>
              <X className="size-3 text-slate-400 group-hover:text-red-400 transition" />
            </button>
          ))}
        </div>
        <div className="flex items-center gap-2">
          {valenceInfo.balanced ? (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-emerald-500/20 border border-emerald-500/50 font-mono text-[10px] font-bold text-emerald-300 animate-pulse">
              <CheckCircle2 className="size-3 text-emerald-400" /> Stable Octet
            </span>
          ) : valenceInfo.isNoble ? (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-amber-500/20 border border-amber-500/50 font-mono text-[10px] font-bold text-amber-300">
              <AlertTriangle className="size-3 text-amber-400" /> Inert Gas
            </span>
          ) : (
            <span className="flex items-center gap-1 px-2.5 py-0.5 rounded-full bg-cyan/10 border border-cyan/30 font-mono text-[10px] font-bold text-cyan">
              <AlertCircle className="size-3 text-cyan" /> {totalValenceOffered} e⁻ pool
            </span>
          )}
        </div>
      </div>

      {/* Live Electron Sharing & Molecular Assembly View */}
      <div className={`rounded-xl border p-3 mb-2.5 transition-all duration-500 ${
        valenceInfo.balanced
          ? "bg-slate-950/95 border-emerald-500/60 shadow-[0_0_25px_rgba(16,185,129,0.25)]"
          : "bg-slate-950/90 border-slate-800"
      }`}>
        <div className="flex items-center justify-between text-[10px] font-mono text-slate-400 mb-2 pb-1.5 border-b border-slate-800/80">
          <span className="flex items-center gap-1 font-bold text-slate-300 uppercase tracking-wider">
            <Sparkles className="size-3 text-cyan animate-pulse" /> Live Electron Orbital Assembly
          </span>
          <span className={valenceInfo.balanced ? "text-emerald-400 font-bold animate-pulse" : "text-cyan"}>
            {valenceInfo.balanced ? "✓ 8/8 Stable Octet Achieved!" : "⚡ Sharing Active e⁻"}
          </span>
        </div>

        {/* Interactive Rectangular Whiteboard Canvas (Landscape Sandbox Stage Style) */}
        <div
          onMouseDown={handleMouseDown}
          onMouseMove={handleMouseMove}
          onMouseUp={handleMouseUp}
          onMouseLeave={handleMouseUp}
          onTouchStart={handleTouchStart}
          onTouchMove={handleTouchMove}
          onTouchEnd={handleTouchEnd}
          className={`relative w-full rounded-2xl border-2 p-3 sm:p-5 my-2.5 overflow-hidden transition-colors duration-500 shadow-2xl select-none ${
            isDragging ? 'cursor-grabbing' : 'cursor-grab'
          } ${
            valenceInfo.balanced
              ? "border-emerald-500/80 bg-slate-950 shadow-[0_0_35px_rgba(16,185,129,0.25)]"
              : "border-cyan/50 bg-slate-950/95 shadow-[0_0_25px_rgba(6,182,212,0.18)]"
          }`}
        >
          {/* Whiteboard / Blueprint Graph Grid Lines (Matching Sandbox Stage) */}
          <div className="absolute inset-0 bg-[radial-gradient(#33415540_1px,transparent_1px)] bg-[size:16px_16px] pointer-events-none" />

          {/* Auto-Arrangement Notification Pill & Zoom Controls Toolbar */}
          <div className="relative z-30 flex flex-wrap items-center justify-between mb-3 px-1 gap-2 border-b border-slate-800/60 pb-2">
            <div className="flex items-center gap-2">
              <span className="font-mono text-[10.5px] font-bold text-slate-300 flex items-center gap-1.5">
                <Sparkles className="size-3.5 text-cyan animate-pulse" />
                <span>Spatial Molecular Stage</span>
              </span>
              {valenceInfo.balanced ? (
                <button
                  type="button"
                  onClick={() => setAtomOffsets({})}
                  className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 hover:bg-emerald-500/30 border border-emerald-500 text-emerald-300 font-mono text-[9.5px] font-bold shadow-[0_0_12px_rgba(16,185,129,0.4)] cursor-pointer transition"
                  title="Click to snap all atoms back to auto-arranged alignment"
                >
                  ✨ RESET ALIGNMENT
                </button>
              ) : (
                <button
                  type="button"
                  onClick={() => setAtomOffsets({})}
                  className="px-2.5 py-0.5 rounded-full bg-cyan/15 hover:bg-cyan/25 border border-cyan/40 text-cyan font-mono text-[9px] font-semibold cursor-pointer transition flex items-center gap-1"
                  title="Click to snap all atoms back to auto-arranged alignment"
                >
                  ⚡ Auto-arrange
                </button>
              )}
            </div>

            {/* High-Tech Zoom & Pan Controls Toolbar */}
            <div className="flex items-center gap-1 bg-slate-900/95 border border-cyan/40 rounded-lg p-0.5 shadow-md">
              <div className="flex items-center gap-1 px-1.5 py-0.5 text-slate-400 border-r border-slate-800">
                <Move className="size-3 text-cyan animate-pulse" />
                <span className="font-mono text-[9px] text-slate-400 hidden sm:inline">Hold & Drag to pan</span>
              </div>
              <button
                type="button"
                onClick={() => setZoomScale(prev => Math.max(0.4, +(prev - 0.15).toFixed(2)))}
                className="p-1 rounded text-slate-400 hover:text-cyan hover:bg-slate-800 transition"
                title="Zoom Out (-)"
              >
                <ZoomOut className="size-3.5" />
              </button>
              <span className="font-mono text-[9.5px] font-bold text-cyan px-1.5 select-none min-w-[38px] text-center">
                {Math.round(zoomScale * 100)}%
              </span>
              <button
                type="button"
                onClick={() => setZoomScale(prev => Math.min(1.8, +(prev + 0.15).toFixed(2)))}
                className="p-1 rounded text-slate-400 hover:text-cyan hover:bg-slate-800 transition"
                title="Zoom In (+)"
              >
                <ZoomIn className="size-3.5" />
              </button>
              <button
                type="button"
                onClick={handleResetView}
                className="p-1 rounded text-slate-400 hover:text-white hover:bg-slate-800 transition"
                title="Reset Zoom & Pan (100%)"
              >
                <RotateCcw className="size-3" />
              </button>
            </div>
          </div>

          {/* Zoomable & Pannable Inner Stage Container */}
          <div
            className={`w-full flex-1 flex flex-col items-center justify-center origin-center ${
              isDragging ? '' : 'transition-transform duration-200 ease-out'
            }`}
            style={{
              transform: `translate(${panPos.x}px, ${panPos.y}px) scale(${zoomScale})`,
              transformOrigin: 'center center'
            }}
          >
            {(() => {
              const N = molecularSequence.length;
              const spacing = Math.min(130, Math.max(90, Math.floor(460 / Math.max(1, N))));
              const initialLayout = getInitialMolecularLayout(molecularSequence, key, spacing);

              // Calculate 2D position for each atom
              const atomNodes = molecularSequence.map((symbol, idx) => {
                const nodeKey = `atom_${idx}_${symbol}`;
                const base = initialLayout[idx] || { x: (idx - (N - 1) / 2) * spacing, y: 0 };
                const offset = atomOffsets[nodeKey] || { x: 0, y: 0 };
                const x = base.x + offset.x;
                const y = base.y + offset.y;
                const detail = getAtomDetail(symbol, valenceInfo);
                return { key: nodeKey, symbol, idx, x, y, detail };
              });

              // Calculate bond connections based on topology
              const bonds = getMolecularBonds(atomNodes, key, valenceInfo);

              return (
                <div className="relative w-full min-h-[220px] flex items-center justify-center overflow-visible select-none py-2">
                  {/* SVG Dynamic Vector Bond Layer */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none overflow-visible z-10">
                    <defs>
                      <filter id="laser-glow" x="-20%" y="-20%" width="140%" height="140%">
                        <feDropShadow dx="0" dy="0" stdDeviation="3" floodColor={valenceInfo.balanced ? "#34d399" : "#06b6d4"} />
                      </filter>
                    </defs>
                    {bonds.map(b => {
                      if (b.dist < 45) return null;
                      const strokeColor = valenceInfo.balanced ? "#34d399" : "#06b6d4";
                      const isDouble = b.type.isDouble;
                      const isTriple = b.type.isTriple;

                      if (isTriple) {
                        return (
                          <g key={b.id} filter="url(#laser-glow)">
                            <line x1={`calc(50% + ${b.x1 + b.nx * 1.5}px)`} y1={`calc(50% + ${b.y1 + b.ny * 1.5}px)`} x2={`calc(50% + ${b.x2 + b.nx * 1.5}px)`} y2={`calc(50% + ${b.y2 + b.ny * 1.5}px)`} stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
                            <line x1={`calc(50% + ${b.x1}px)`} y1={`calc(50% + ${b.y1}px)`} x2={`calc(50% + ${b.x2}px)`} y2={`calc(50% + ${b.y2}px)`} stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
                            <line x1={`calc(50% + ${b.x1 - b.nx * 1.5}px)`} y1={`calc(50% + ${b.y1 - b.ny * 1.5}px)`} x2={`calc(50% + ${b.x2 - b.nx * 1.5}px)`} y2={`calc(50% + ${b.y2 - b.ny * 1.5}px)`} stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
                          </g>
                        );
                      }

                      if (isDouble) {
                        return (
                          <g key={b.id} filter="url(#laser-glow)">
                            <line x1={`calc(50% + ${b.x1 + b.nx}px)`} y1={`calc(50% + ${b.y1 + b.ny}px)`} x2={`calc(50% + ${b.x2 + b.nx}px)`} y2={`calc(50% + ${b.y2 + b.ny}px)`} stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
                            <line x1={`calc(50% + ${b.x1 - b.nx}px)`} y1={`calc(50% + ${b.y1 - b.ny}px)`} x2={`calc(50% + ${b.x2 - b.nx}px)`} y2={`calc(50% + ${b.y2 - b.ny}px)`} stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
                          </g>
                        );
                      }

                      return (
                        <g key={b.id} filter="url(#laser-glow)">
                          <line x1={`calc(50% + ${b.x1}px)`} y1={`calc(50% + ${b.y1}px)`} x2={`calc(50% + ${b.x2}px)`} y2={`calc(50% + ${b.y2}px)`} stroke={strokeColor} strokeWidth="2.5" strokeLinecap="round" />
                        </g>
                      );
                    })}
                  </svg>

                  {/* Floating Bond Labels at Dynamic Vector Midpoints */}
                  {bonds.map(b => (
                    <div
                      key={`lbl_${b.id}`}
                      style={{
                        left: `calc(50% + ${b.mx}px)`,
                        top: `calc(50% + ${b.my}px)`
                      }}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-30 pointer-events-auto select-none transition-all duration-75"
                      title={b.type.fullExplanation || b.type.label}
                    >
                      <span className="font-mono text-[7px] sm:text-[7.5px] text-cyan-200 font-bold whitespace-nowrap bg-slate-950/95 border border-cyan/40 px-1.5 py-0.2 rounded-full shadow-md">
                        {b.type.label}
                      </span>
                    </div>
                  ))}

                  {/* Individually Draggable Bohr Atom Nodes */}
                  {atomNodes.map(node => (
                    <div
                      key={node.key}
                      style={{
                        left: `calc(50% + ${node.x}px)`,
                        top: `calc(50% + ${node.y}px)`
                      }}
                      onMouseDown={(e) => handleAtomPointerDown(node.key, e)}
                      onTouchStart={(e) => handleAtomPointerDown(node.key, e)}
                      className="absolute -translate-x-1/2 -translate-y-1/2 z-20 flex flex-col items-center cursor-grab active:cursor-grabbing select-none p-1 group hover:scale-105 transition-transform"
                      title={`Drag ${node.symbol} atom anywhere on stage`}
                    >
                      <BohrAtomVisualizer
                        symbol={node.symbol}
                        size="sm"
                        animated={true}
                        showEmptySeats={!valenceInfo.balanced}
                      />
                      {node.detail.isFull ? (
                        <span className="font-mono text-[8px] font-bold text-emerald-300 mt-0.5 pointer-events-none whitespace-nowrap">
                          {node.symbol === "H" ? "Duet Full ✓" : "Octet Full ✓"}
                        </span>
                      ) : node.detail.role ? (
                        <span className="font-mono text-[7.5px] text-slate-400 mt-0.5 pointer-events-none whitespace-nowrap">
                          {node.detail.role}
                        </span>
                      ) : null}
                    </div>
                  ))}
                </div>
              );
            })()}
          </div>
        </div>

        {/* Dynamic Educational Commentary on the Molecular Structure */}
        <div className={`mt-2 px-3 py-1.5 rounded-lg border text-left font-mono text-[10.5px] flex items-center gap-2 transition-all ${
          valenceInfo.balanced
            ? "bg-emerald-950/40 border-emerald-500/40 text-emerald-200"
            : "bg-slate-900/80 border-slate-800 text-slate-300"
        }`}>
          {valenceInfo.balanced ? (
            <CheckCircle2 className="size-3.5 text-emerald-400 shrink-0" />
          ) : (
            <Info className="size-3.5 text-cyan shrink-0" />
          )}
          <p className="line-clamp-1 truncate text-xs">
            <span className="font-bold text-white mr-1.5">
              {valenceInfo.balanced ? "Bonding Analysis:" : "Orbital Status:"}
            </span>
            <span className="text-slate-300">{explanation}</span>
          </p>
        </div>
      </div>
    </div>
  );
}


