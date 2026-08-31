import React, { useState, useMemo } from "react";
import { SiteHeader } from "@/components/common/SiteHeader";
import { ELEMENTS_DATA, getFamilyClasses } from "@/features/dr-atom-workshop";
import { ElementTile } from "../components/ElementTile";
import { FamilyFilterBar } from "../components/FamilyFilterBar";
import { ElementModal } from "../components/ElementModal";
import { TableCellsMerge, Sparkles, ArrowDown } from "lucide-react";

export function PeriodicMatrixPage() {
  const [activeFamily, setActiveFamily] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedElement, setSelectedElement] = useState(null);

  // Filter elements by family and search query
  const isElementVisible = (el) => {
    if (!el) return false;
    const matchesFamily = activeFamily === "all" || el.family === activeFamily;
    const q = searchQuery.toLowerCase().trim();
    const matchesSearch =
      !q ||
      el.symbol.toLowerCase().includes(q) ||
      el.name.toLowerCase().includes(q) ||
      el.num.toString() === q;
    return matchesFamily && matchesSearch;
  };

  // 7 Periods x 18 Groups for main table grid
  const mainGridRows = useMemo(() => {
    const rows = [];
    for (let p = 1; p <= 7; p++) {
      const rowCells = [];
      for (let g = 1; g <= 18; g++) {
        if (p === 6 && g === 3) {
          rowCells.push({ type: "anchor-lanthanide", label: "57-71", symbol: "La", family: "lanthanide" });
        } else if (p === 7 && g === 3) {
          rowCells.push({ type: "anchor-actinide", label: "89-103", symbol: "Ac", family: "actinide" });
        } else {
          const el = ELEMENTS_DATA.find(
            (e) => e.period === p && e.group === g && e.family !== "lanthanide" && e.family !== "actinide"
          );
          rowCells.push({ type: "element", element: el });
        }
      }
      rows.push({ period: p, cells: rowCells });
    }
    return rows;
  }, []);

  const lanthanides = useMemo(() => ELEMENTS_DATA.filter((e) => e.family === "lanthanide"), []);
  const actinides = useMemo(() => ELEMENTS_DATA.filter((e) => e.family === "actinide"), []);

  return (
    <div className="elementopia-scope min-h-screen grid-bg text-foreground flex flex-col bg-slate-950">
      <SiteHeader />

      <main className="mx-auto max-w-[1500px] w-full px-4 sm:px-6 lg:px-8 py-8 flex-1 flex flex-col space-y-6">
        {/* Page Header */}
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2 border-b border-slate-800">
          <div>
            <p className="font-mono text-xs text-cyan tracking-[0.3em] uppercase mb-1 flex items-center gap-1.5">
              <Sparkles className="size-3.5 text-cyan" /> 118 ELEMENTS COMPREHENSIVE ATLAS
            </p>
            <h1
              className="font-display text-3xl sm:text-4xl font-bold text-white flex items-center gap-3"
              style={{ textShadow: "0 0 25px rgba(6,182,212,0.4)" }}
            >
              <TableCellsMerge className="size-8 text-cyan shrink-0" /> Periodic Matrix
            </h1>
          </div>

          <div className="text-xs font-mono text-slate-400">
            Click any element tile to inspect atomic structures & specs
          </div>
        </div>

        {/* Filter Bar & Search */}
        <FamilyFilterBar
          activeFamily={activeFamily}
          onSelectFamily={setActiveFamily}
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
        />

        {/* Periodic Grid Container */}
        <div className="element-grid-container glass-panel p-4 sm:p-6 rounded-3xl overflow-x-auto border border-slate-800 bg-slate-900/50 shadow-2xl">
          {/* Main 18-Column Grid */}
          <div
            className="element-grid min-w-[1000px] gap-1.5"
            style={{
              display: "grid",
              gridTemplateColumns: "28px repeat(18, minmax(48px, 1fr))",
              gap: "4px",
            }}
          >
            {/* Group Number Headers (Row 0) */}
            <div className="text-center text-[9px] font-mono text-gray-600 self-end" />
            {Array.from({ length: 18 }).map((_, g) => (
              <div key={g} className="text-center text-[10px] font-mono text-gray-500 font-bold self-end py-1">
                {g + 1}
              </div>
            ))}

            {/* Periods 1 to 7 */}
            {mainGridRows.map(({ period, cells }) => (
              <React.Fragment key={period}>
                {/* Period Number Header */}
                <div className="text-center text-xs font-mono font-bold text-cyan-500 flex items-center justify-center h-full">
                  {period}
                </div>

                {/* 18 Group Cells */}
                {cells.map((cell, idx) => {
                  if (cell.type === "anchor-lanthanide" || cell.type === "anchor-actinide") {
                    const isLanthanide = cell.type === "anchor-lanthanide";
                    const isAnchorDimmed = activeFamily !== "all" && activeFamily !== cell.family;
                    return (
                      <button
                        key={idx}
                        type="button"
                        onClick={() => setActiveFamily(cell.family)}
                        className={`series-anchor-tile flex flex-col items-center justify-center rounded-xl p-1 border transition-all cursor-pointer ${
                          isLanthanide
                            ? "bg-pink-950/45 border-pink-500/30 text-pink-300 hover:bg-pink-900/50"
                            : "bg-fuchsia-950/45 border-fuchsia-500/30 text-fuchsia-300 hover:bg-fuchsia-900/50"
                        } ${isAnchorDimmed ? "opacity-15 pointer-events-none scale-95" : "opacity-100 hover:scale-105"}`}
                        style={{ aspectRatio: "1 / 1" }}
                      >
                        <span className="text-[7px] font-mono leading-none">{cell.label}</span>
                        <span className="text-[11px] font-bold font-sans leading-none mt-0.5">{cell.symbol}</span>
                      </button>
                    );
                  }

                  if (!cell.element) {
                    return <div key={idx} className="aspect-square" />;
                  }

                  const isVisible = isElementVisible(cell.element);
                  return (
                    <ElementTile
                      key={idx}
                      element={cell.element}
                      onClick={(el) => setSelectedElement(el)}
                      isDimmed={!isVisible}
                    />
                  );
                })}
              </React.Fragment>
            ))}
          </div>

          {/* Separator for Rare Earth Series (Lanthanides / Actinides) */}
          <div className="my-5 border-t border-dashed border-slate-800 pt-4 flex items-center justify-between text-[11px] font-mono text-gray-400 px-2 min-w-[1000px]">
            <span className="flex items-center gap-2">
              <ArrowDown className="size-3.5 text-pink-400" />
              <strong className="text-slate-200">Rare Earth Series</strong> (Lanthanides #57–71 & Actinides #89–103)
            </span>
            <span className="text-gray-500 text-[10px]">
              * Separated below to maintain standard 18-column aspect ratio
            </span>
          </div>

          {/* Rare Earth Series Grid */}
          <div
            className="rare-earth-grid min-w-[1000px] gap-1.5"
            style={{
              display: "grid",
              gridTemplateColumns: "28px repeat(18, minmax(48px, 1fr))",
              gap: "4px",
            }}
          >
            {/* Lanthanides Row */}
            <div className="text-center text-[8px] font-mono font-bold text-pink-400 flex flex-col items-center justify-center h-full leading-tight">
              La
              <span className="text-[6px] text-gray-500">#57-71</span>
            </div>
            {/* 3 Spacer columns */}
            <div /><div /><div />
            {lanthanides.map((el) => {
              const isVisible = isElementVisible(el);
              return (
                <ElementTile
                  key={el.num}
                  element={el}
                  onClick={(elem) => setSelectedElement(elem)}
                  isDimmed={!isVisible}
                />
              );
            })}

            {/* Actinides Row */}
            <div className="text-center text-[8px] font-mono font-bold text-fuchsia-400 flex flex-col items-center justify-center h-full leading-tight mt-1">
              Ac
              <span className="text-[6px] text-gray-500">#89-103</span>
            </div>
            {/* 3 Spacer columns */}
            <div /><div /><div />
            {actinides.map((el) => {
              const isVisible = isElementVisible(el);
              return (
                <ElementTile
                  key={el.num}
                  element={el}
                  onClick={(elem) => setSelectedElement(elem)}
                  isDimmed={!isVisible}
                />
              );
            })}
          </div>
        </div>
      </main>

      {/* Selected Element Inspection Modal */}
      {selectedElement && (
        <ElementModal
          element={selectedElement}
          onClose={() => setSelectedElement(null)}
        />
      )}

      <footer className="border-t border-slate-800 py-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500 mt-auto shrink-0 bg-slate-950">
        Elementopia · Periodic Matrix · 118 Chemical Elements Atlas
      </footer>
    </div>
  );
}
export default PeriodicMatrixPage;
