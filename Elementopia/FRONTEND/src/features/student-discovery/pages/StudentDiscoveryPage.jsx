import React, { useState, useEffect } from "react";
import { Modal } from "@mui/material";
import { SiteHeader } from '@/components/common/SiteHeader';
import DiscoveryService from '@/features/student-discovery/services/DiscoveryService';
import UserService from '@/features/auth-user';
import ScienceIcon from "@mui/icons-material/Science";
import { Sparkles, Lock, Filter, CheckCircle2, Leaf, FlaskConical, Zap, Globe2 } from "lucide-react";
import { MASTER_DISCOVERIES } from "../data/discovery-data";
import { MolecularBallAndStickVisualizer } from "../components/MolecularBallAndStickVisualizer";

export function StudentDiscoveryPage() {
  const [userDiscoveries, setUserDiscoveries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [selectedDiscovery, setSelectedDiscovery] = useState(null);
  const [activeFilter, setActiveFilter] = useState("ALL"); // ALL, Natural, Synthetic

  useEffect(() => {
    const fetchDiscoveries = async () => {
      try {
        const user = await UserService.getCurrentUser();
        if (user && user.userId) {
          const response = await DiscoveryService.getCurrentUserDiscoveries(user.userId);
          const data = response.data || response || [];
          setUserDiscoveries(Array.isArray(data) ? data : []);
        }
      } catch (error) {
        console.error("Failed to fetch discoveries:", error);
      } finally {
        setLoading(false);
      }
    };
    fetchDiscoveries();
  }, []);

  // Set of normalized discovered symbols
  const discoveredSymbolSet = new Set(
    userDiscoveries.map(d => (d.symbol || d.name || "").replace(/\s+/g, '').toUpperCase())
  );

  // Also match by name if symbol is missing
  const discoveredNameSet = new Set(
    userDiscoveries.map(d => (d.name || "").toLowerCase())
  );

  const isUnlocked = (item) => {
    const normSym = (item.symbol || "").replace(/[^A-Za-z0-9]/g, '').toUpperCase();
    const normName = (item.name || "").toLowerCase();
    return discoveredSymbolSet.has(normSym) || discoveredNameSet.has(normName);
  };

  const unlockedCount = MASTER_DISCOVERIES.filter(item => isUnlocked(item)).length;
  const totalCount = MASTER_DISCOVERIES.length;
  const progressPercent = Math.round((unlockedCount / totalCount) * 100);

  const filteredDiscoveries = MASTER_DISCOVERIES.filter(item => {
    if (activeFilter === "ALL") return true;
    if (activeFilter === "Natural") return item.origin === "Natural";
    if (activeFilter === "Synthetic") return item.origin === "Synthetic";
    return true;
  });

  return (
    <div className="elementopia-scope min-h-screen grid-bg text-foreground flex flex-col">
      <SiteHeader />
      <main className="mx-auto max-w-[1400px] w-full px-6 md:px-12 lg:px-16 py-10">

        {/* Page Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 mb-8">
          <div>
            <p className="font-mono text-xs text-cyan tracking-[0.3em] uppercase mb-1">
              LABORATORY CODEX
            </p>
            <h1 className="font-display text-4xl sm:text-5xl font-bold text-white flex items-center gap-3" style={{ textShadow: '0 0 25px rgba(6,182,212,0.4)' }}>
              <ScienceIcon fontSize="large" sx={{ color: '#22d3ee' }} /> Alchemical Codex
            </h1>
            <p className="text-slate-400 mt-2 max-w-xl text-sm leading-relaxed font-sans">
              Catalog of real-world chemical compounds. Synthesize elements in the puzzle arena to unlock structural data, origins, and applications!
            </p>
          </div>

          {/* Codex Completion Progress Box */}
          <div className="flex flex-col gap-2 rounded-2xl border border-cyan/40 bg-slate-950/90 p-4 shadow-[0_0_20px_rgba(6,182,212,0.15)] min-w-[280px]">
            <div className="flex items-center justify-between text-xs font-mono">
              <span className="text-slate-400 uppercase tracking-wider">Codex Completion</span>
              <span className="font-bold text-cyan">{unlockedCount} / {totalCount} ({progressPercent}%)</span>
            </div>
            <div className="h-2.5 w-full rounded-full bg-slate-800 overflow-hidden p-0.5 border border-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-cyan-500 via-blue-500 to-magenta transition-all duration-700 shadow-[0_0_12px_rgba(6,182,212,0.6)]"
                style={{ width: `${progressPercent}%` }}
              />
            </div>
          </div>
        </div>

        {/* Filter Controls */}
        <div className="flex flex-wrap items-center gap-3 mb-8 pb-4 border-b border-slate-800">
          <div className="flex items-center gap-2 font-mono text-xs text-slate-400 mr-2 uppercase tracking-wider">
            <Filter className="size-3.5 text-cyan" /> Origin Filter:
          </div>
          <button
            onClick={() => setActiveFilter("ALL")}
            className={`rounded-xl px-4 py-2 font-mono text-xs font-bold transition-all ${activeFilter === "ALL"
              ? "bg-cyan text-slate-950 shadow-[0_0_15px_rgba(6,182,212,0.4)]"
              : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
              }`}
          >
            ALL ({totalCount})
          </button>
          <button
            onClick={() => setActiveFilter("Natural")}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 font-mono text-xs font-bold transition-all ${activeFilter === "Natural"
              ? "bg-emerald-500 text-slate-950 shadow-[0_0_15px_rgba(16,185,129,0.4)]"
              : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
              }`}
          >
            <Leaf className="size-3.5" /> NATURALLY OCCURRING
          </button>
          <button
            onClick={() => setActiveFilter("Synthetic")}
            className={`flex items-center gap-1.5 rounded-xl px-4 py-2 font-mono text-xs font-bold transition-all ${activeFilter === "Synthetic"
              ? "bg-magenta text-white shadow-[0_0_15px_rgba(236,72,153,0.4)]"
              : "bg-slate-900 text-slate-400 border border-slate-800 hover:text-white"
              }`}
          >
            <FlaskConical className="size-3.5" /> HUMAN-MADE / SYNTHETIC
          </button>
        </div>

        {/* Card Grid */}
        {loading ? (
          <div className="py-20 text-center font-mono text-sm text-cyan animate-pulse">
            ⚡ Loading Alchemical Codex archives...
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5">
            {filteredDiscoveries.map((item, index) => {
              const unlocked = isUnlocked(item);

              if (!unlocked) {
                return (
                  <div
                    key={index}
                    className="flex flex-col justify-between rounded-2xl border border-slate-800/80 bg-slate-950/60 p-5 opacity-60 transition-all hover:opacity-80"
                  >
                    <div>
                      <div className="flex items-center justify-between mb-3">
                        <span className="inline-flex items-center gap-1 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                          <Lock className="size-3 text-slate-500" /> Locked Entry
                        </span>
                        <span className="font-mono text-[9px] px-2 py-0.5 rounded bg-slate-900 text-slate-500 border border-slate-800">
                          {item.domainId.toUpperCase()}
                        </span>
                      </div>
                      <div className="font-pixel text-lg font-bold text-slate-500 mb-1">
                        ??? Undiscovered
                      </div>
                      <p className="font-mono text-xs text-slate-600 mb-3">
                        Formula: Hidden
                      </p>
                      <div className="rounded-xl border border-slate-800/80 bg-slate-900/40 p-3 font-mono text-[11px] text-slate-500 leading-relaxed">
                        Experiment with element ratios in the arena to discover this entry.
                      </div>
                    </div>
                    <span className="mt-4 text-[10px] font-mono text-slate-500 uppercase tracking-wider">
                      🔒 Synthesize to unlock codex data
                    </span>
                  </div>
                );
              }

              const isNatural = item.origin === "Natural";

              return (
                <button
                  key={index}
                  onClick={() => setSelectedDiscovery(item)}
                  className="text-left flex flex-col justify-between rounded-2xl border border-cyan/30 bg-slate-950/90 p-5 shadow-[0_0_15px_rgba(6,182,212,0.1)] hover:-translate-y-1 hover:border-cyan/60 hover:shadow-[0_0_25px_rgba(6,182,212,0.25)] transition group relative overflow-hidden"
                >
                  <div className="absolute top-0 right-0 p-3 opacity-15 group-hover:opacity-40 transition">
                    <Sparkles className="w-12 h-12 text-cyan" />
                  </div>

                  <div>
                    {/* Header Badges */}
                    <div className="flex items-center justify-between mb-3">
                      <span className={`inline-flex items-center gap-1 text-[10px] font-mono font-bold px-2 py-0.5 rounded border uppercase tracking-wider ${isNatural
                        ? "bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                        : "bg-magenta/10 text-magenta border-magenta/30"
                        }`}>
                        {isNatural ? <Leaf className="size-3" /> : <FlaskConical className="size-3" />}
                        {item.origin}
                      </span>
                      <span className="font-mono text-[10px] text-cyan font-bold">
                        {item.abundance}
                      </span>
                    </div>

                    <h3 className="font-pixel text-base font-bold text-white group-hover:text-glow-white transition mb-1">
                      {item.name}
                    </h3>
                    <p className="font-mono text-xs font-bold text-cyan mb-3">
                      Formula: {item.symbol}
                    </p>

                    <p className="text-xs text-slate-400 font-sans leading-relaxed line-clamp-2 mb-4">
                      {item.description}
                    </p>
                  </div>

                  <div className="pt-3 border-t border-slate-800 flex items-center justify-between text-xs font-mono font-bold text-cyan group-hover:translate-x-1 transition">
                    <span>Inspect Molecular Data</span>
                    <span>→</span>
                  </div>
                </button>
              );
            })}
          </div>
        )}

        {/* Compound Detail Modal */}
        <Modal
          open={!!selectedDiscovery}
          onClose={() => setSelectedDiscovery(null)}
        >
          <div className="elementopia-scope absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[650px] max-w-[95vw] max-h-[90vh] outline-none border-none flex flex-col text-foreground">
            {selectedDiscovery && (
              <div className="relative bg-slate-950 border border-cyan/40 rounded-3xl p-6 sm:p-8 shadow-[0_0_50px_rgba(6,182,212,0.25)] flex flex-col max-h-full overflow-y-auto custom-scrollbar">

                {/* Modal Header */}
                <div className="flex items-start justify-between mb-4">
                  <div>
                    <span className="inline-flex items-center gap-1.5 rounded-xl bg-cyan/10 border border-cyan/40 px-3 py-1 text-xs font-mono font-bold text-cyan uppercase tracking-wider mb-2">
                      <CheckCircle2 className="size-3.5" /> Codex Master Entry
                    </span>
                    <h2 className="font-pixel text-2xl sm:text-3xl font-bold text-white">
                      {selectedDiscovery.name}
                    </h2>
                    <p className="font-mono text-sm font-bold text-cyan mt-0.5">
                      Chemical Formula: {selectedDiscovery.symbol}
                    </p>
                  </div>
                  <button
                    onClick={() => setSelectedDiscovery(null)}
                    className="rounded-full bg-slate-900 p-2 text-slate-400 hover:text-white hover:bg-slate-800 transition"
                  >
                    ✕
                  </button>
                </div>

                {/* 2D/3D Ball and Stick Molecular Visualizer */}
                <div className="my-3">
                  <MolecularBallAndStickVisualizer symbol={selectedDiscovery.symbol} />
                </div>

                {/* Real-World Specimen Photo */}
                {selectedDiscovery.image && (
                  <div className="my-4 rounded-2xl border border-cyan/30 bg-slate-900/80 p-4 shadow-lg">
                    <div className="font-mono text-[10px] text-cyan uppercase tracking-wider mb-3 font-bold flex items-center gap-1.5">
                      <span>📸</span> Real-World Specimen Photo
                    </div>
                    <div style={{ minHeight: '280px', height: '280px' }} className="w-full rounded-xl border border-slate-800 bg-slate-950">
                      <img
                        src={selectedDiscovery.image}
                        alt={`${selectedDiscovery.name} real world photo`}
                        onError={(e) => {
                          if (e.currentTarget.src.endsWith('.jpg')) {
                            e.currentTarget.src = e.currentTarget.src.replace('.jpg', '.jfif');
                          }
                        }}
                        style={{ width: '100%', height: '280px', objectFit: 'cover', borderRadius: '0.75rem', display: 'block' }}
                      />
                    </div>
                  </div>
                )}

                {/* Compound Metadata Grid */}
                <div className="grid grid-cols-2 gap-3 my-4">
                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                    <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                      Natural vs Synthetic Origin
                    </span>
                    <span className={`inline-flex items-center gap-1.5 text-xs font-mono font-bold ${selectedDiscovery.origin === "Natural" ? "text-emerald-400" : "text-magenta"
                      }`}>
                      {selectedDiscovery.origin === "Natural" ? <Leaf className="size-3.5" /> : <FlaskConical className="size-3.5" />}
                      {selectedDiscovery.origin === "Natural" ? "Naturally Occurring" : "Human-Made / Synthetic"}
                    </span>
                  </div>

                  <div className="rounded-xl border border-slate-800 bg-slate-900/60 p-3">
                    <span className="font-mono text-[10px] text-slate-400 uppercase tracking-wider block mb-1">
                      Natural Abundance
                    </span>
                    <span className="inline-flex items-center gap-1.5 text-xs font-mono font-bold text-cyan">
                      <Globe2 className="size-3.5" /> {selectedDiscovery.abundance} in Nature
                    </span>
                  </div>
                </div>

                {/* Description */}
                <div className="space-y-4">
                  <div>
                    <h4 className="font-mono text-xs text-slate-400 uppercase tracking-wider mb-1">
                      Chemical Profile & Octet Bonding
                    </h4>
                    <p className="text-sm text-slate-200 leading-relaxed font-sans bg-slate-900/40 p-3 rounded-xl border border-slate-800">
                      {selectedDiscovery.description}
                    </p>
                  </div>

                  {/* Primary Applications */}
                  <div>
                    <h4 className="font-mono text-xs text-slate-400 uppercase tracking-wider mb-2">
                      Primary Real-World Applications
                    </h4>
                    <div className="flex flex-wrap gap-2">
                      {selectedDiscovery.uses?.map((use, idx) => (
                        <span key={idx} className="rounded-lg bg-cyan/10 border border-cyan/30 px-3 py-1 font-mono text-xs text-cyan font-bold">
                          ✓ {use}
                        </span>
                      ))}
                    </div>
                  </div>
                </div>

                {/* Close Button */}
                <button
                  onClick={() => setSelectedDiscovery(null)}
                  className="mt-6 w-full rounded-xl bg-gradient-to-r from-cyan-500 to-blue-600 py-2.5 font-mono text-xs font-bold text-white shadow-md transition hover:scale-[1.01] uppercase tracking-wider"
                >
                  Close Codex Entry
                </button>

              </div>
            )}
          </div>
        </Modal>

      </main>
    </div>
  );
}

export default StudentDiscoveryPage;
