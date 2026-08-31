import React from "react";
import { ELEMENTS_DATA, getFamilyClasses } from "../data/elements-data";

export function InteractivePeriodicMap({
  activeSlide,
  selectedGroup,
  selectedPeriod,
  activeElementNum,
  onSelectElement
}) {
  const getCellStyles = (el) => {
    if (!el) return {};

    const { highlightType, highlightTargets } = activeSlide;

    // Size trend visual
    if (highlightType === "size-trend") {
      const sizeFactor = (8 - el.period) * 0.08 + (19 - el.group) * 0.02;
      return {
        transform: `scale(${0.75 + sizeFactor * 0.45})`,
        opacity: 1,
        zIndex: 1,
      };
    }

    // Grip / Electronegativity trend visual
    if (highlightType === "grip-trend") {
      if (el.en === "-") {
        return { opacity: 0.15, transform: "scale(0.85)", zIndex: 1 };
      }
      const enVal = parseFloat(el.en);
      const factor = (enVal - 0.7) / 3.3;
      return {
        opacity: 0.2 + factor * 0.8,
        transform: `scale(${0.85 + factor * 0.3})`,
        boxShadow: enVal > 3.0 ? "0 0 10px #c084fc" : "none",
        zIndex: enVal > 3.0 ? 10 : 1,
      };
    }

    // Specific elements target highlight
    if (highlightType === "elements") {
      const targets = highlightTargets || [];
      const isTarget = targets.includes(el.num) || el.num === activeElementNum;
      if (isTarget) {
        return {
          opacity: 1,
          transform: "scale(1.15)",
          boxShadow: "0 0 12px #22d3ee",
          zIndex: 15,
        };
      }
      return { opacity: 0.15, transform: "scale(0.9)", zIndex: 1 };
    }

    // Group highlight
    if (highlightType === "group" || selectedGroup) {
      const targetGroup = selectedGroup || (highlightTargets ? highlightTargets[0] : 1);
      if (el.group === targetGroup) {
        return {
          opacity: 1,
          transform: "scale(1.15)",
          boxShadow: "0 0 12px #0ea5e9",
          zIndex: 15,
        };
      }
      return { opacity: 0.15, transform: "scale(0.9)", zIndex: 1 };
    }

    // Period highlight
    if (highlightType === "period" || selectedPeriod) {
      const targetPeriod = selectedPeriod || (highlightTargets ? highlightTargets[0] : 1);
      if (el.period === targetPeriod) {
        return {
          opacity: 1,
          transform: "scale(1.15)",
          boxShadow: "0 0 12px #22c55e",
          zIndex: 15,
        };
      }
      return { opacity: 0.15, transform: "scale(0.9)", zIndex: 1 };
    }

    return { opacity: 1, transform: "scale(1)", zIndex: 1 };
  };

  // Build grid of 7 periods x 18 groups
  const gridCells = [];
  for (let p = 1; p <= 7; p++) {
    for (let g = 1; g <= 18; g++) {
      const el = ELEMENTS_DATA.find(
        (e) => e.period === p && e.group === g && e.family !== "lanthanide" && e.family !== "actinide"
      );
      gridCells.push({ key: `${p}-${g}`, el });
    }
  }

  return (
    <div className="w-full">
      <div
        className="w-full"
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(18, minmax(0, 1fr))",
          gap: "3px",
        }}
      >
        {gridCells.map(({ key, el }) => {
          if (!el) {
            return <div key={key} className="aspect-square" />;
          }

          const dynamicStyles = getCellStyles(el);
          const familyClass = getFamilyClasses(el.family);

          return (
            <button
              key={key}
              onClick={() => onSelectElement && onSelectElement(el.num)}
              style={dynamicStyles}
              className={`aspect-square rounded-md border flex flex-col justify-center items-center font-mono font-bold text-white transition-all duration-300 cursor-pointer p-0.5 select-none ${familyClass}`}
            >
              <span className="text-[6px] opacity-75 leading-none">{el.num}</span>
              <span className="text-[9px] leading-none mt-0.5 font-sans font-bold">{el.symbol}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
}
