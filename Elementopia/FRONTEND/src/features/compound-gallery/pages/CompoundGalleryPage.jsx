import React, { useState, useMemo } from "react";
import { SiteHeader } from "@/components/common/SiteHeader";
import { CompoundCard } from "../components/CompoundCard";
import { COMPOUND_GALLERY_DATA } from "../data/compound-gallery-data";
import { FlaskConical, Search, Sparkles, Filter, Layers } from "lucide-react";

export function CompoundGalleryPage() {
  const [searchQuery, setSearchQuery] = useState("");

  const filteredCompounds = useMemo(() => {
    if (!searchQuery.trim()) return COMPOUND_GALLERY_DATA;
    const q = searchQuery.toLowerCase().trim();
    return COMPOUND_GALLERY_DATA.filter(
      (c) =>
        c.name.toLowerCase().includes(q) ||
        c.mix.toLowerCase().includes(q) ||
        c.desc.toLowerCase().includes(q)
    );
  }, [searchQuery]);

  return (
    <div className="elementopia-scope min-h-screen grid-bg text-foreground flex flex-col bg-slate-950">
      <SiteHeader />

      <main className="mx-auto max-w-[1400px] w-full px-6 md:px-12 lg:px-16 py-10 flex-1 flex flex-col">
        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <p className="font-mono text-xs text-cyan tracking-[0.3em] uppercase mb-1 flex items-center gap-2">
              <Sparkles className="size-3.5 text-cyan" /> ELEMENTAL ENCYCLOPEDIA
            </p>
            <h1
              className="font-display text-4xl sm:text-5xl font-bold text-white flex items-center gap-3"
              style={{ textShadow: "0 0 25px rgba(6,182,212,0.4)" }}
            >
              <FlaskConical className="size-10 text-cyan shrink-0" /> Compound Gallery
            </h1>
            <p className="text-slate-400 mt-2 max-w-xl text-sm leading-relaxed font-sans">
              Explore how fundamental elements combine to create real-world molecules, materials, and compounds. Click any card to reveal its synthesis recipe and scientific facts!
            </p>
          </div>

          {/* Stats Box */}
          <div className="flex flex-col gap-2 rounded-2xl border border-cyan/40 bg-slate-950/90 p-4 shadow-[0_0_20px_rgba(6,182,212,0.15)] min-w-[260px]">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 uppercase tracking-wider flex items-center gap-1.5">
                <Layers className="size-3.5 text-cyan" /> Total Compounds
              </span>
              <span className="font-bold text-cyan text-sm">
                {filteredCompounds.length} / {COMPOUND_GALLERY_DATA.length}
              </span>
            </div>
            <div className="h-2 w-full rounded-full bg-slate-800 overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan via-blue-500 to-magenta transition-all duration-500 shadow-[0_0_12px_rgba(6,182,212,0.6)]"
                style={{
                  width: `${Math.round(
                    (filteredCompounds.length / COMPOUND_GALLERY_DATA.length) * 100
                  )}%`,
                }}
              />
            </div>
          </div>
        </div>

        {/* Search / Filter Toolbar */}
        <div className="flex flex-col sm:flex-row items-center justify-between gap-4 mb-8 pb-6 border-b border-slate-800">
          <div className="relative w-full sm:w-96">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 size-4 text-slate-400" />
            <input
              type="text"
              placeholder="Search by name, recipe (e.g. H + Cl), or fact..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full pl-10 pr-4 py-2.5 bg-slate-900/90 border border-slate-700 rounded-xl text-sm text-white placeholder:text-slate-500 focus:outline-none focus:border-cyan focus:ring-1 focus:ring-cyan transition-all"
            />
            {searchQuery && (
              <button
                onClick={() => setSearchQuery("")}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-xs font-mono text-slate-400 hover:text-white px-1.5 py-0.5 rounded bg-slate-800"
              >
                Clear
              </button>
            )}
          </div>

          <div className="text-xs font-mono text-slate-400 flex items-center gap-2 self-start sm:self-auto">
            <Filter className="size-3.5 text-cyan" /> Showing {filteredCompounds.length} compound cards
          </div>
        </div>

        {/* Compound Grid */}
        {filteredCompounds.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 pb-16">
            {filteredCompounds.map((compound) => (
              <CompoundCard key={compound.id} compound={compound} />
            ))}
          </div>
        ) : (
          <div className="flex-1 flex flex-col items-center justify-center py-20 text-center">
            <div className="p-4 rounded-full bg-slate-900 border border-slate-800 mb-4 text-slate-500">
              <FlaskConical className="size-12" />
            </div>
            <h3 className="text-lg font-bold text-white mb-1">No compounds found</h3>
            <p className="text-sm text-slate-400 max-w-sm">
              We couldn't find any compounds matching "{searchQuery}". Try searching for another name or chemical symbol.
            </p>
            <button
              onClick={() => setSearchQuery("")}
              className="mt-4 px-4 py-2 text-xs font-mono bg-cyan/20 border border-cyan/40 text-cyan rounded-lg hover:bg-cyan/30 transition-colors"
            >
              Reset Search
            </button>
          </div>
        )}
      </main>

      <footer className="border-t border-slate-800 py-6 text-center font-mono text-[10px] uppercase tracking-[0.3em] text-slate-500 mt-auto shrink-0 bg-slate-950">
        Elementopia · Compound Gallery · Molecular Codex
      </footer>
    </div>
  );
}
export default CompoundGalleryPage;
