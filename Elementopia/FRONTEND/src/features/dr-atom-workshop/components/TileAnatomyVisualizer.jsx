import React, { useState } from "react";

export function TileAnatomyVisualizer() {
  const [selectedPart, setSelectedPart] = useState(null);

  const getExplanation = () => {
    switch (selectedPart) {
      case "num":
        return (
          <span>
            🔢 <strong>Atomic Number (6):</strong> The atom's unique ID. It tells you exactly how many protons are in its center. Carbon always has 6!
          </span>
        );
      case "en":
        return (
          <span>
            ⚡ <strong>Pulling Power (2.55):</strong> Electronegativity. Shows how greedy this atom is for electrons. Carbon has medium power, so it prefers to share!
          </span>
        );
      case "symbol":
        return (
          <span>
            🔤 <strong>Symbol (C):</strong> The short international nickname for the element. 'C' stands for Carbon.
          </span>
        );
      case "mass":
        return (
          <span>
            ⚖️ <strong>Weight (12.011):</strong> Atomic Mass. How heavy the atom is. Larger numbers mean a heavier atom!
          </span>
        );
      default:
        return (
          <span>
            👈 <strong>Click any button or item</strong> on the Carbon tile above to learn about it in simple terms!
          </span>
        );
    }
  };

  return (
    <div className="flex flex-col items-center justify-center gap-4 w-full py-2">
      {/* Anatomy Tile */}
      <div className="w-32 h-32 rounded-2xl bg-cyan-950/40 border border-cyan-500/30 flex flex-col justify-between p-2.5 relative select-none shadow-lg">
        {/* Atomic Number Button */}
        <button
          onClick={() => setSelectedPart("num")}
          className={`absolute top-2 left-2 px-1 py-0.5 rounded bg-slate-900 border text-[10px] font-mono font-bold transition cursor-pointer ${
            selectedPart === "num"
              ? "border-cyan-400 text-cyan-300 ring-1 ring-cyan-400"
              : "border-slate-700 hover:border-cyan-400 text-cyan-400"
          }`}
        >
          6
        </button>

        {/* Electronegativity Button */}
        <button
          onClick={() => setSelectedPart("en")}
          className={`absolute top-2 right-2 px-1 py-0.5 rounded bg-slate-900 border text-[8px] font-mono transition cursor-pointer ${
            selectedPart === "en"
              ? "border-purple-400 text-purple-300 ring-1 ring-purple-400"
              : "border-slate-700 hover:border-purple-400 text-purple-400"
          }`}
        >
          2.55
        </button>

        {/* Symbol Button */}
        <button
          onClick={() => setSelectedPart("symbol")}
          className={`w-full flex justify-center mt-5 py-0.5 rounded-lg transition cursor-pointer ${
            selectedPart === "symbol"
              ? "bg-cyan-500/20 ring-1 ring-cyan-400"
              : "hover:bg-cyan-500/10"
          }`}
        >
          <span className="text-3xl font-heading font-bold text-white">C</span>
        </button>

        {/* Name & Mass Button */}
        <button
          onClick={() => setSelectedPart("mass")}
          className={`w-full flex flex-col items-center py-0.5 rounded-lg transition mt-0.5 cursor-pointer ${
            selectedPart === "mass"
              ? "bg-cyan-500/20 ring-1 ring-cyan-400"
              : "hover:bg-cyan-500/10"
          }`}
        >
          <span className="text-[8px] text-cyan-200">Carbon</span>
          <span className="text-[7px] font-mono text-cyan-400">12.011</span>
        </button>
      </div>

      {/* Explainer Box */}
      <div className="bg-slate-900/60 p-2.5 rounded-xl border border-slate-800 text-[10px] text-gray-300 w-full max-w-[280px] text-center font-sans">
        {getExplanation()}
      </div>
    </div>
  );
}
