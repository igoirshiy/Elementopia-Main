import React from "react";
import { Search } from "lucide-react";

export const FAMILIES = [
  { id: "all", label: "All Families", btnClass: "bg-cyan-500/20 text-cyan-300 border-cyan-500/40" },
  { id: "alkali", label: "Alkali", btnClass: "bg-rose-950/60 text-rose-300 border-rose-500/30 hover:bg-rose-900/50" },
  { id: "alkaline", label: "Alkaline Earth", btnClass: "bg-amber-950/60 text-amber-300 border-amber-500/30 hover:bg-amber-900/50" },
  { id: "transition", label: "Transition", btnClass: "bg-yellow-950/60 text-yellow-300 border-yellow-500/30 hover:bg-yellow-900/50" },
  { id: "post", label: "Post-Transition", btnClass: "bg-emerald-950/60 text-emerald-300 border-emerald-500/30 hover:bg-emerald-900/50" },
  { id: "metalloid", label: "Metalloids", btnClass: "bg-teal-950/60 text-teal-300 border-teal-500/30 hover:bg-teal-900/50" },
  { id: "nonmetal", label: "Non-Metals", btnClass: "bg-sky-950/60 text-sky-300 border-sky-500/30 hover:bg-sky-900/50" },
  { id: "halogen", label: "Halogens", btnClass: "bg-indigo-950/60 text-indigo-300 border-indigo-500/30 hover:bg-indigo-900/50" },
  { id: "noble", label: "Noble Gases", btnClass: "bg-purple-950/60 text-purple-300 border-purple-500/30 hover:bg-purple-900/50" },
  { id: "lanthanide", label: "Lanthanides", btnClass: "bg-pink-950/60 text-pink-300 border-pink-500/30 hover:bg-pink-900/50" },
  { id: "actinide", label: "Actinides", btnClass: "bg-fuchsia-950/60 text-fuchsia-300 border-fuchsia-500/30 hover:bg-fuchsia-900/50" },
];

export function FamilyFilterBar({ activeFamily, onSelectFamily, searchQuery, onSearchChange }) {
  return (
    <div className="glass-panel p-4 rounded-2xl flex flex-wrap items-center justify-between gap-4 border border-slate-800 bg-slate-900/60">
      {/* Category Filter Buttons */}
      <div className="flex flex-wrap gap-1.5 text-[11px] font-medium" id="family-filters">
        {FAMILIES.map((fam) => {
          const isActive = activeFamily === fam.id;
          return (
            <button
              key={fam.id}
              type="button"
              onClick={() => onSelectFamily(fam.id)}
              className={`px-3 py-1 rounded-lg border transition-all cursor-pointer ${fam.btnClass} ${
                isActive ? "ring-2 ring-cyan-400 font-bold scale-105" : "opacity-80 hover:opacity-100"
              }`}
            >
              {fam.label}
            </button>
          );
        })}
      </div>

      {/* Search Input */}
      <div className="relative min-w-[220px] flex-grow sm:flex-grow-0">
        <Search className="absolute left-3 top-2.5 size-3.5 text-gray-400" />
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => onSearchChange(e.target.value)}
          placeholder="Search symbol, name, #..."
          className="w-full bg-slate-900/90 border border-slate-700 text-xs rounded-xl pl-9 pr-3 py-2 text-white placeholder-gray-500 focus:outline-none focus:border-cyan-400 transition"
        />
      </div>
    </div>
  );
}
